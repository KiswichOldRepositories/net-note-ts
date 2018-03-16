package cn.showclear.www.service.impl;


import cn.showclear.utils.DeleteFolderUtil;
import cn.showclear.utils.ParseFolders2JSONUtil;
import cn.showclear.www.config.entity.Entity;
import cn.showclear.www.dao.FileMapper;
import cn.showclear.www.dao.FolderMapper;
import cn.showclear.www.dao.UserMapper;

import cn.showclear.www.pojo.common.Folder;
import cn.showclear.www.pojo.common.LoadFile;
import cn.showclear.www.pojo.common.User;
import cn.showclear.www.service.FolderService;
import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;

import java.io.File;
import java.util.Date;
import java.util.List;

/**
 * 文件夹相关业务
 */
public class FolderServiceImpl implements FolderService {
    private static Logger logger = Logger.getLogger(FolderServiceImpl.class);

    //文件夹本地地址


    /**
     * 创建用户目录，仅在注册完毕后创建（登陆的时候也会进行校验，方便调试）
     *
     * @param user 注册的用户信息
     */
    public boolean createUserFolder(User user) {
        File file = new File(Entity.localPath + user.getUsername());
        if (!file.exists() && !file.isDirectory()) {
            file.mkdir();
            SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
            try {
                Folder folder = new Folder();
                folder.setFolderName(user.getUsername());
                folder.setCreateTime(new Date());
                folder.setUsernameID(user.getId());

                FolderMapper mapper = sqlSession.getMapper(FolderMapper.class);
                mapper.createFolder(folder);
                sqlSession.commit();
            } catch (Exception e) {
                sqlSession.rollback();
                e.printStackTrace();
                return false;
            } finally {
                sqlSession.close();
            }
        }
        return true;
    }

    /**
     * 创建目录 需要传入父目录（必须要有父目录的id）、该目录名称、用户名（从session中获取，应该是相对安全的）
     * 目录名字要重名校验，重名文件夹则加入 "(数字)"
     */
    public boolean createFolder(Folder parentFolder, String folderName, String username) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();

        try {
            Folder folder = new Folder();
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            FolderMapper folderMapper = sqlSession.getMapper(FolderMapper.class);

            Folder parent = folderMapper.selectFolderById(parentFolder.getId());//找到父目录
            User user = userMapper.selectUserById(parent.getUsernameID());//用父目录的用户ID找到用户名

            if(user.getUsername().equals(username)){//文件所属用户即当前用户的时候
                //重名校验
                List<Folder> folders = folderMapper.selectFoldersByParentsId(parent.getId());
                //folderName = new folderNameUtil(folders,folderName).checkAndGetFolderName();
                folderName = checkAndGetFolderName(folders,folderName);

                folder.setUsernameID(user.getId());
                folder.setCreateTime(new Date());
                folder.setFolderName(folderName);
                folder.setParentFolderID(parent.getId());
                folderMapper.createFolder(folder);
                sqlSession.commit();
            }else{//非法请求
                return false;
            }
        } catch (Exception e) {
            //e.printStackTrace();
            logger.error("创建目录失败",e);
            sqlSession.rollback();
            return false;
        } finally {
            sqlSession.close();
        }
        return true;
    }

    /**
     * 删除目录（内部文件同时删除）
     */
    public boolean deleteFolder(String username,int folderID) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        FolderMapper folderMapper = sqlSession.getMapper(FolderMapper.class);
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        FileMapper fileMapper = sqlSession.getMapper(FileMapper.class);
        try {
            //校验用户
            Folder deletedFolder = folderMapper.selectFolderById(folderID);
            if(deletedFolder.getParentFolderID() == 0) {
                return false;//主目录不允许删除
            }

            User user = userMapper.selectUserByUsername(username);
            //System.out.println(deletedFolder + "  " + folderID);
            logger.info(deletedFolder + "  " + folderID);
            //System.out.println(user);
            logger.info(user);
            if(deletedFolder.getUsernameID() == user.getId()){//用户校验通过
                //递归删除（文件/文件夹）
                List<LoadFile> fileList = fileMapper.selectFilesByUsename(username);
                List<Folder> folderList = folderMapper.findFoldersByUser(user);
                DeleteFolderUtil deleteFolderUtil = new DeleteFolderUtil(folderMapper, fileMapper, folderList, fileList);
                deleteFolderUtil.delete(deletedFolder);
            }else{
                return false;
            }
            sqlSession.commit();
        }catch (Exception e){
            sqlSession.rollback();
            //e.printStackTrace();
            logger.error("删除目录失败",e);
            return false;
        }finally {
            sqlSession.close();
        }
        return true;
    }

    /**
     * 修改目录名称（要有重名校验），重名文件夹则加入 "(数字)"
     */
    public boolean editFolder(String username,int folderID,String newName) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        FolderMapper folderMapper = sqlSession.getMapper(FolderMapper.class);

        try {
            //确认文件夹的所有者
            User user = userMapper.selectUserByUsername(username);
            Folder folder = folderMapper.selectFolderById(folderID);
            if(user.getId() == folder.getUsernameID()){//属于当前用户
                //修改目录名
                if(folder.getParentFolderID()!=0){//修改目录不是主目录

                    //重名校验
                    List<Folder> folders = folderMapper.selectFoldersByParentsId(folder.getParentFolderID());
                    //newName = new folderNameUtil(folders,newName).checkAndGetFolderName();
                    newName = checkAndGetFolderName(folders,newName);

                    folder.setFolderName(newName);
                    folderMapper.editFolder(folder);
                }else{
                    return false;
                }
            }else{
                return false;
            }
            sqlSession.commit();
        }catch (Exception e){
            sqlSession.rollback();
            //e.printStackTrace();
            logger.error("修改目录名称失败",e);
            return false;
        }finally {
            sqlSession.close();
        }
        return true;
    }

    /**
     * 获取用户目录结构（之前的servlet已经验证了登录状态）
     */
    public String getFolderByUser(String username) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        List<Folder> foldersByUser = null;
        List<LoadFile> loadFiles=null;

        try {
            UserMapper user = sqlSession.getMapper(UserMapper.class);
            FileMapper fileMapper = sqlSession.getMapper(FileMapper.class);
            FolderMapper folderMapper = sqlSession.getMapper(FolderMapper.class);
            User exitedUser = user.selectUserByUsername(username);
            foldersByUser = folderMapper.findFoldersByUser(exitedUser);
            loadFiles = fileMapper.selectFilesByUsename(username);

            //处理文件夹集合和文件集合 ，表达出他们的树形结构， 返回json字符串
            String json = new ParseFolders2JSONUtil().parse2JSON(foldersByUser, loadFiles);

            sqlSession.commit();
            return json;
        } catch (Exception e) {
            //e.printStackTrace();
            logger.error("目录结构获取失败",e);
            sqlSession.rollback();
            return  null;
        } finally {
            sqlSession.close();
        }
    }

    /**
     * 校验文件夹的名字是否重复（用于新建文件夹和修改文件夹），并返回合适的文件夹名称 ：文件名加"（数字）"
     * @param folders 待检查的文件夹列表
     * @param folderName 待检查的文件名
     * @return 处理后的文件名
     */
    private String checkAndGetFolderName(List<Folder> folders, String folderName){
        //准备返回的合适的文件夹名
        String newName = folderName;
        //重名编号
        int num = 0;
        boolean nameFlag = false;

        while(!nameFlag){
            nameFlag = true;
            if(num!=0){
                newName = new StringBuilder().append(folderName).append("(").append(num).append(")").toString();
            }
            for(Folder folder : folders){
                if (folder.getFolderName().equals(newName)) {
                    nameFlag = false;
                }
            }
            num++;
        }
        return  newName;
    }


}
