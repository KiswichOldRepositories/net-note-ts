package cn.showclear.www.service.impl;


import cn.showclear.utils.CreateRandomString;
import cn.showclear.utils.ParseShare2JOSNUtil;
import cn.showclear.utils.zip.PackFolder2Zip;
import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.config.entity.Entity;
import cn.showclear.www.dao.FileMapper;
import cn.showclear.www.dao.FolderMapper;
import cn.showclear.www.dao.ShareMapper;
import cn.showclear.www.dao.UserMapper;

import cn.showclear.www.pojo.common.*;
import cn.showclear.www.service.ShareService;
import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;

import java.io.*;
import java.util.Iterator;
import java.util.List;
import java.util.zip.ZipOutputStream;

/**
 * 文件分享业务
 */
public class ShareServiceImpl implements ShareService {
    private static Logger logger = Logger.getLogger(ShareServiceImpl.class);

    //添加分享 传入用户名、文件/文件夹ID，文件、文件夹标志 0文件 1文件夹
    public boolean addShare(String username, int fID, int flag) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        FileMapper fileMapper = sqlSession.getMapper(FileMapper.class);
        FolderMapper folderMapper = sqlSession.getMapper(FolderMapper.class);
        ShareMapper shareMapper = sqlSession.getMapper(ShareMapper.class);

        try {
            User user = userMapper.selectUserByUsername(username);

            //校验文件/文件夹是否为用户的
            if (flag == CommonConstant.FILE_FLAG) {//文件
                LoadFile loadFile = fileMapper.selectFileByID(fID);
                Folder folder = folderMapper.selectFolderById(loadFile.getFloderID());
                if (folder.getUsernameID() == user.getId()) {//要分享的文件是属于当前用户的
                    //加入分享数据库
                    List<Share> shares;
                    String shareURL;
                    //生成URL直到其唯一
                    do {
                        shareURL = CreateRandomString.create(10);
                        shares = shareMapper.selectShareByURL(shareURL);
                    } while (!shares.isEmpty());

                    Share share = new Share(shareURL, fID, 0, user.getId());
                    shareMapper.insertShare(share);
                } else {//分享的文件不是当前用户的
                    return false;
                }
            } else if (flag == CommonConstant.FOLDER_FLAG) {//文件夹(打成zip？)//代码重复
                Folder folder = folderMapper.selectFolderById(fID);

                if (folder.getUsernameID() == user.getId()) {//要分享的文件是属于当前用户的
                    //加入分享数据库
                    List<Share> shares;
                    String shareURL;
                    //生成URL直到其唯一
                    do {
                        shareURL = CreateRandomString.create(10);
                        shares = shareMapper.selectShareByURL(shareURL);
                    } while (!shares.isEmpty());

                    Share share = new Share(shareURL, fID, 1, user.getId());
                    shareMapper.insertShare(share);
                } else {//分享的文件不是当前用户的
                    return false;
                }
            }
            sqlSession.commit();
        } catch (Exception e) {
            e.printStackTrace();
            sqlSession.rollback();
            return false;
        } finally {
            sqlSession.close();
        }
        return true;
    }

    //关闭分享
    public boolean deleteShare(int shareID, String username) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        try {

            ShareMapper shareMapper = sqlSession.getMapper(ShareMapper.class);
            List<Share> shares = shareMapper.selectShareByUsername(username);
            for (Share share : shares) {
                if (share.getId() == shareID) {
                    shareMapper.deleteShareByID(shareID);
                    break;
                }
            }
            sqlSession.commit();
        } catch (Exception e) {
            sqlSession.rollback();
            e.printStackTrace();
            return false;
        } finally {
            sqlSession.close();
        }
        return true;
    }

    //获取分享文件
    public LocalFile getShare(int fID, int flag) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        ShareMapper shareMapper = sqlSession.getMapper(ShareMapper.class);
        FileMapper fileMapper = sqlSession.getMapper(FileMapper.class);
        FolderMapper folderMapper = sqlSession.getMapper(FolderMapper.class);
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);

        ZipOutputStream zipOutputStream = null;

        try {
            if (flag == CommonConstant.FILE_FLAG) {//为单个文件

                LoadFile loadFile = fileMapper.selectFileByID(fID);
                File localFile = new File(loadFile.getLocalURL());
                InputStream inputStream = new FileInputStream(localFile);

                //乱码测试
                //System.out.println("service中的filename ： " + loadFile.getFileName());
                logger.info("service中的filename ： " + loadFile.getFileName());

                sqlSession.commit();
                return new LocalFile(loadFile.getFileName(), inputStream);

            } else {//为一个文件夹
                //找到要分享的文件夹作为父目录
                Folder parentFolder = folderMapper.selectFolderById(fID);
                User user = userMapper.selectUserById(parentFolder.getUsernameID());
                List<Folder> folderList = folderMapper.findFoldersByUser(user);
                List<LoadFile> fileList = fileMapper.selectFilesByUsename(user.getUsername());

                //在本用户的文件夹里创建临时目录  //代码重复 建议重构
                String localPath = Entity.localPath + "/" + user.getUsername() + "/" + parentFolder.getFolderName() + ".zip";
                zipOutputStream = new ZipOutputStream(new FileOutputStream(new File(
                        localPath)));


                PackFolder2Zip folder2Zip = new PackFolder2Zip(fileList, folderList, zipOutputStream);
                folder2Zip.parse(parentFolder.getId());
                zipOutputStream.flush();


                //返回LocalFile对象

                FileInputStream fileInputStream = new FileInputStream(new File(localPath));
                sqlSession.commit();

                return new LocalFile(parentFolder.getFolderName() + ".zip", fileInputStream);

            }
        } catch (Exception e) {
            sqlSession.rollback();
            //e.printStackTrace();
            logger.error("获取分享文件失败", e);
        } finally {
            sqlSession.close();

            try {
                if (zipOutputStream != null) zipOutputStream.close();
            } catch (IOException e) {
                logger.error("zipoutputstream关闭失败", e);
            }
        }
        return null;
    }

    /**
     * 展示某个用户分享记录的json树
     *
     * @param username 展示分享用户的用户名
     * @return 分享记录的json树
     */
    public String showShare(String username) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        String json = null;
        ShareMapper shareMapper = sqlSession.getMapper(ShareMapper.class);
        FolderMapper folderMapper = sqlSession.getMapper(FolderMapper.class);
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        FileMapper fileMapper = sqlSession.getMapper(FileMapper.class);

        try {

            User user = userMapper.selectUserByUsername(username);
            List<Share> shares = shareMapper.selectShareByUsername(username);
            //内部逻辑还是用代码实现吧
            List<Folder> folders = folderMapper.findFoldersByUser(user);
            List<LoadFile> loadFiles = fileMapper.selectFilesByUsename(username);

            //检查分享文件为空的情况,若为空则删除
            Iterator<Share> shareIterator = shares.iterator();

            while(shareIterator.hasNext()){
                Share next = shareIterator.next();
                if (next.getShareType() == CommonConstant.FILE_FLAG) {//分享的是单个文件
                    LoadFile checkedLoadFile = fileMapper.selectFileByID(next.getShareFID());
                    if (checkedLoadFile == null) {
                        Entity.entityManger.shareService.deleteShare(next.getId(), username);
                        shareIterator.remove();
                    }

                } else if (next.getShareType() == CommonConstant.FOLDER_FLAG) {
                    Folder checkedFolder = folderMapper.selectFolderById(next.getShareFID());
                    if (checkedFolder == null) {
                        Entity.entityManger.shareService.deleteShare(next.getId(), username);
                        shareIterator.remove();
                    }
                }
            }

            //转成json字符串
            json = new ParseShare2JOSNUtil(shares, loadFiles, folders).parse();

            sqlSession.commit();
        } catch (Exception e) {
            //e.printStackTrace();
            logger.error(username + "的分享目录获取失败了", e);
            sqlSession.rollback();
        } finally {
            sqlSession.close();
        }
        return json;
    }

    /**
     * 检查当前的分享标志位是否存在
     *
     * @param shareFlag 分享的链接标志
     * @return success存在 error不存在
     */
    @Override
    public String checkShare(String shareFlag) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();

        try {
            ShareMapper shareMapper = sqlSession.getMapper(ShareMapper.class);
            List<Share> shares = shareMapper.selectShareByURL(shareFlag);
            sqlSession.commit();
            if (!shares.isEmpty()) {
                return "success";
            }
        } catch (Exception e) {
            //没有必要作出处理
        } finally {
            sqlSession.close();
        }
        return "error";
    }

    /**
     * 公共分享
     *
     * @param shareFlag 分享的链接标志
     * @return
     */
    @Override
    public String showShareByFlag(String shareFlag) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        String json = null;
        ShareMapper shareMapper = sqlSession.getMapper(ShareMapper.class);
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        FolderMapper folderMapper = sqlSession.getMapper(FolderMapper.class);
        FileMapper fileMapper = sqlSession.getMapper(FileMapper.class);
        try {
            List<Share> shares = shareMapper.selectShareByURL(shareFlag);
            //System.out.println(shares);
            logger.info(shares);
            //System.out.println(shareFlag);
            logger.info(shareFlag);
            User user = userMapper.selectUserById(shares.get(0).getUserID());
            List<Folder> folders = folderMapper.findFoldersByUser(user);
            List<LoadFile> files = fileMapper.selectFilesByUsename(user.getUsername());

            //转换成json树
            ParseShare2JOSNUtil parseShare2JOSNUtil = new ParseShare2JOSNUtil(shares, files, folders);
            json = parseShare2JOSNUtil.parse();

            sqlSession.commit();
        } catch (Exception e) {
            sqlSession.rollback();
            //e.printStackTrace();
            logger.error("公共分享出错", e);
        } finally {
            sqlSession.close();
        }

        return json;
    }
}
