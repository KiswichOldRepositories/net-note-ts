package cn.showclear.www.service.impl;


import cn.showclear.utils.zip.PackFolder2Zip;
import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.config.entity.Entity;
import cn.showclear.www.dao.FileMapper;
import cn.showclear.www.dao.FolderMapper;
import cn.showclear.www.dao.UserMapper;
import cn.showclear.www.pojo.common.Folder;
import cn.showclear.www.pojo.common.LoadFile;
import cn.showclear.www.pojo.common.LocalFile;
import cn.showclear.www.pojo.common.User;
import cn.showclear.www.service.FileService;
import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;

import java.io.*;
import java.util.Date;
import java.util.List;
import java.util.zip.ZipOutputStream;

/**
 * 文件业务
 */
public class FileServiceImpl implements FileService {
    private static Logger logger = Logger.getLogger(FileServiceImpl.class);

    /**
     * 上传文件（需要文件输入流，用户名，父文件ID，上传的文件名，）
     * 需要检测同一目录下重名的情况 重名文件依次加 "（数字）"
     */
    public boolean uploadFile(InputStream inputStream, String username, int folderID, String filename) throws IOException {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();

        //文件输出流
        OutputStream fileOutputStream = null;
        //校验用户和文件夹是否匹配
        try {
            FolderMapper folderMapper = sqlSession.getMapper(FolderMapper.class);
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            Folder folder = folderMapper.selectFolderById(folderID);
            User user = userMapper.selectUserByUsername(username);
            if (user.getId() != folder.getUsernameID()) {
                //不匹配(文件不是该用户的,用户数据来自session) 走了
                sqlSession.rollback();
                sqlSession.close();
                return false;
            }
        } catch (Exception e) {
            //可能上传了假的数据（比如不存在的文件夹id） 走了
            //e.printStackTrace();
            logger.debug("可能上传了假的数据（比如不存在的文件夹id） 走了", e);
            sqlSession.rollback();
            sqlSession.close();
            return false;
        }
        //文件
        File file = null;

        try {
            //按照月份创建文件夹 (封装到了timeManager中)
            //获取文件夹的名称
            String childPath = username + File.separator + Entity.timeManager.getFolderName();
            File folder = new File(Entity.localPath, childPath);

            if (!folder.exists() && !folder.isDirectory()) {
                if (!folder.mkdirs()) {
                    //文件夹创建失败 之后的操作已经没有必要
                    return false;
                }
            }

            //文件物理存储路径 /用户名/年月/文件名(时间戳)
            Date createtime = Entity.timeManager.getFileName();
            String filePath = Entity.localPath + File.separator + childPath + File.separator + createtime.getTime();
            //存储文件
            file = new File(filePath);
            if (!file.exists()) {
                if (!file.createNewFile()) {//文件创建失败 之后的操作已经没有必要(给出错误页面)

                    return false;
                }
            }
            //文件流输入
            byte[] bytes = new byte[1024];
            fileOutputStream = new FileOutputStream(file);
            int size = 0;
            int almost = 0;
            while (-1 != (size = inputStream.read(bytes))) {
                fileOutputStream.write(bytes, 0, size);
                fileOutputStream.flush();
                almost += size;
            }

            //写入文件部分属性到数据库
            FileMapper fileMapper = sqlSession.getMapper(FileMapper.class);
            /* 重名校验 *///重名文件在文件名后夹 "(数字)"
            List<LoadFile> files = fileMapper.selectFoldersByFolderID(folderID);
            //filename = new FileNameUtil(files, filename).checkAndGetFileName();
            filename = CheckAndEditSameName(files,filename);


            LoadFile loadFile = new LoadFile(filename, filePath, folderID, createtime, almost);
            fileMapper.insertFile(loadFile);
            sqlSession.commit();
        } catch (Exception e) {
            sqlSession.rollback();
            //e.printStackTrace();
            logger.error(e);
            //出错时删除原本写入的文件
            if (file.exists()) {
                file.delete();
            }
            return false;
        } finally {
            sqlSession.close();
            if (fileOutputStream != null) fileOutputStream.close();
        }
        return true;
    }

    /**
     * 下载文件(需要 操作用户名，下载文件/文件夹id，区分文件夹/文件标志)flag(0文件，1文件夹)
     * 传出文件byte数组//（不太合适 换成流或者本地路径 会比较好）
     */
    public LocalFile downloadFile(String username, int fID, int flag) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        FileMapper fileMapper = sqlSession.getMapper(FileMapper.class);
        FolderMapper folderMapper = sqlSession.getMapper(FolderMapper.class);

        ZipOutputStream zipOutputStream = null;
        InputStream inputStream = null;
        FileInputStream fileInputStream = null;

        //下载需求为文件的情况
        if (flag == CommonConstant.FILE_FLAG) {
            //验证当前用户是否为文件的拥有者
            try {
                User user = userMapper.selectUserByUsername(username);
                LoadFile file = fileMapper.selectFileByID(fID);
                if (file != null) {//检验文件是否存在
                    Folder folder = folderMapper.selectFolderById(file.getFloderID());
                    //验证文件为当前用户的
                    if (folder.getUsernameID() == user.getId()) {
                        File localFile = new File(file.getLocalURL());
                        inputStream = new FileInputStream(localFile);

                        return new LocalFile(file.getFileName(), inputStream);
                    }
                } else {//文件不是当前用户的 走了
                }
            } catch (Exception e) {
                //传入了错误的数据
                //e.printStackTrace();
                logger.error("传入了错误的数据", e);
                sqlSession.rollback();

            } finally {
                sqlSession.close();
            }
        } else {//再写下载需求为文件夹的情况
            try {
                User user = userMapper.selectUserByUsername(username);
                Folder folder = folderMapper.selectFolderById(fID);
                if (user.getId() == folder.getUsernameID()) {//该文件夹是这个用户的
                    //递归打包文件夹里的内容
                    List<LoadFile> loadFiles = fileMapper.selectFilesByUsename(username);
                    List<Folder> foldersByUser = folderMapper.findFoldersByUser(user);
                    sqlSession.commit();

                    //在本用户的文件夹里创建临时目录
                    String childPath = username + File.separator + folder.getFolderName() + ".zip";

                    zipOutputStream = new ZipOutputStream(new FileOutputStream(new File(
                            Entity.localPath, childPath)));

                    PackFolder2Zip folder2Zip = new PackFolder2Zip(loadFiles, foldersByUser, zipOutputStream);
                    folder2Zip.parse(fID);
                    zipOutputStream.flush();

                    //将本地打包完的文件夹（zip文件）的文件流传出
                    fileInputStream = new FileInputStream(new File(Entity.localPath, childPath));
                    //返回LocalFile对象
                    return new LocalFile(folder.getFolderName() + ".zip", fileInputStream);
                }
            } catch (Exception e) {
                sqlSession.rollback();
                logger.error("传入了错误的数据", e);
//                e.printStackTrace();
            } finally {
                sqlSession.close();
                try {
                    if (zipOutputStream != null) zipOutputStream.close();
                } catch (IOException e) {
                    logger.error("zipOutputStream关闭错误", e);
                }
            }
        }
        return null;
    }

    /**
     * 删除文件
     */
    public boolean deleteFile(String username, int fileID) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        FileMapper fileMapper = sqlSession.getMapper(FileMapper.class);
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        FolderMapper folderMapper = sqlSession.getMapper(FolderMapper.class);
        if (fileID != 0) {//文件树下空文件的情况
            try {
                //校验文件所有者
                User user = userMapper.selectUserByUsername(username);
                LoadFile loadFile = fileMapper.selectFileByID(fileID);
                Folder folder = folderMapper.selectFolderById(loadFile.getFloderID());
                if (folder.getUsernameID() == user.getId()) {//文件为用户本身的

                    File file = new File(loadFile.getLocalURL());
                    if (file.exists()) {
                        //删除文件（本地）
                        if (file.delete()) {
                            //删除文件（数据库）
                            fileMapper.deleteFile(loadFile);
                        } else {
                            //本地文件删除失败 做相应处理
                            return false;
                        }
                    }
                }
                sqlSession.commit();
            } catch (Exception e) {
                sqlSession.rollback();
                // e.printStackTrace();
                logger.error("删除的id不存在 或者删除出错", e);
                return false;
            } finally {
                sqlSession.close();
            }
        }
        return true;
    }

    /**
     * 修改文件名（同样要有重名校验）
     *
     * @param username 当前用户
     * @param FileID   修改的文件ID
     * @param newName  新的文件名
     */
    @Override
    public boolean editFile(String username, int FileID, String newName) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        FolderMapper folderMapper = sqlSession.getMapper(FolderMapper.class);
        FileMapper fileMapper = sqlSession.getMapper(FileMapper.class);
        try {
            //校验文件的所有者
            LoadFile file = fileMapper.selectFileByID(FileID);
            Folder folder = folderMapper.selectFolderById(file.getFloderID());
            User user = userMapper.selectUserByUsername(username);
            if (user.getId() == folder.getUsernameID()) {//为当前用户的
                //检查重名
                List<LoadFile> files = fileMapper.selectFoldersByFolderID(file.getFloderID());
                //newName = new FileNameUtil(files, newName).checkAndGetFileName();
                newName = CheckAndEditSameName(files,newName);


                //修改文件名
                file.setFileName(newName);
                fileMapper.updataFileName(file);
            } else {//文件不用属于当前用户
                return false;
            }
            sqlSession.commit();
        } catch (Exception e) {
            sqlSession.rollback();
            //e.printStackTrace();
            logger.error("传入的ID不存在", e);
            return false;
        } finally {
            sqlSession.close();
        }
        return true;
    }

    /**
     * 校验文件的名字是否重复（用于上传文件和修改文件名），并返回合适的文件名
     * 若重名 则在文件名后加入 "(数字)"
     *
     * @param files    文件列表
     * @param fileName 要添加的文件名
     * @return
     */
    public String CheckAndEditSameName(List<LoadFile> files, String fileName) {
        String filePostfix = null;//被检查的文件名的后缀
        String fileSubName = null;//被检查的文件名（不带后缀）
        String newName = fileName;//重名处理后的文件名
        int num = 0;//重名编号

        //文件名处理
        String[] strings = fileName.split("\\.");
        if(strings.length == 1){//处理没有后缀名的文件
            fileSubName = fileName;

            boolean checkFalg = false;
            while (!checkFalg) {
                //赋予新的newname
                if (num != 0) {
                    newName = new StringBuilder().append(fileName).append("(").append(num).append(")").toString();
                }
                checkFalg = true;
                //检测当前的newname是否符合要求
                for (LoadFile file : files) {
                    if (file.getFileName().equals(newName)) {
                        checkFalg = false;
                    }
                }
                num++;
            }
        }else{//处理有后缀名的文件
            StringBuilder stringBuilder = new StringBuilder();
            for (int i = 0; i < strings.length - 1; i++) {
                stringBuilder.append(strings[i]).append(".");
            }
            stringBuilder.deleteCharAt(stringBuilder.length() - 1);
            fileSubName = stringBuilder.toString();
            filePostfix = strings[strings.length - 1];

            boolean checkFalg = false;
            while (!checkFalg) {
                //赋予新的newname
                if (num != 0) {
                    newName = new StringBuilder().append(fileSubName).append("(").append(num).append(").").append(filePostfix).toString();
                }
                checkFalg = true;
                //检测当前的newname是否符合要求
                for (LoadFile file : files) {
                    if (file.getFileName().equals(newName)) {
                        checkFalg = false;
                    }
                }
                num++;
            }
        }

        return newName;
    }

    /**
     * 检查该文件的临时目录是否存在，不存在则创建
     *
     * @param username 请求者用户名
     * @param fileName 请求检查的文件名
     * @return 返回当前是第几个碎片
     */
    @Override
    public int checkTempFile(String username, String fileName) {
        return 0;
    }

    /**
     * 上传碎片 目录为 临时总目录/用户名/文件名+temp
     *
     * @param inputStream
     * @param username    请求者用户名
     * @param fileName    请求上传的文件名
     * @param currentShip 当前的碎片是第几个
     * @return
     */
    @Override
    public boolean uploadFileShip(InputStream inputStream, String username, String fileName, String currentShip) {
        return false;
    }

    /**
     * 合并碎片为一个文件
     *
     * @param username  发送结束请求合并者
     * @param fileName  请求合并的文件名
     * @param folderID  文件所属的文件夹
     * @param shipCount
     * @return
     */
    @Override
    public boolean combineFileShip(String username, String fileName, int folderID, int shipCount) {
        return false;
    }
}
