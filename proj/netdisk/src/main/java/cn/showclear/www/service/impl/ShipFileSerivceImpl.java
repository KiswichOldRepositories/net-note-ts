package cn.showclear.www.service.impl;


import cn.showclear.utils.DeleteFolder;
import cn.showclear.www.config.entity.Entity;
import cn.showclear.www.dao.FileMapper;

import cn.showclear.www.pojo.common.LoadFile;
import cn.showclear.www.pojo.common.LocalFile;
import cn.showclear.www.service.FileService;
import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;

import java.io.*;
import java.util.Date;
import java.util.List;

public class ShipFileSerivceImpl implements FileService {
    private final static Logger logger = Logger.getLogger(ShipFileSerivceImpl.class);
    @Override
    public boolean uploadFile(InputStream inputStream, String username, int folderID, String filename) throws IOException {
        return false;
    }
    @Override
    public LocalFile downloadFile(String username, int fID, int flag) {
        return Entity.entityManger.fileService.downloadFile(username, fID, flag);
    }

    @Override
    public boolean deleteFile(String username, int fileID) {
        return Entity.entityManger.fileService.deleteFile(username, fileID);
    }

    @Override
    public boolean editFile(String username, int FileID, String newName) {
        return Entity.entityManger.fileService.editFile(username, FileID, newName);
    }

    /**
     * 校验文件的名字是否重复（用于上传文件和修改文件名），并返回合适的文件名
     * 若重名 则在文件名后加入 "(数字)"
     *
     * @param files    文件列表
     * @param fileName 要添加的文件名
     * @return
     */
    @Override
    public String CheckAndEditSameName(List<LoadFile> files, String fileName) {
        return Entity.entityManger.fileService.CheckAndEditSameName(files, fileName);
    }

    /**
     * @param username 请求者用户名
     * @param fileName 请求检查的文件名
     * @return
     */
    @Override
    public int checkTempFile(String username, String fileName) {
        //校验是否有存在未发完的文件
        File file = new File(
                Entity.tempShipPath + File.separator + username, fileName + "temp");
        int i = 0;
        if (file.exists() && file.isDirectory()) {//上次有还没传输完的
            //查找已经传输到第几个了 找到第一个断层，比如12 14 15 16,就返回13，
            File tempFile = new File(
                    Entity.tempShipPath + File.separator + username + File.separator + fileName + "temp", fileName + i);

            while (tempFile.exists()) {
                i++;
                tempFile = new File(
                        Entity.tempShipPath + File.separator + username + File.separator + fileName + "temp", fileName + i);
            }
        } else {//这是个新的文件夹
            file.mkdirs();//建立文件夹
        }
        return i;
    }

    /**
     * @param username    请求者用户名
     * @param fileName    请求上传的文件名
     * @param currentShip 当前的碎片是第几个
     * @return
     */
    @Override
    public boolean uploadFileShip(InputStream inputStream, String username, String fileName, String currentShip) {
        FileOutputStream fileOutputStream = null;
        File localFile = null;
        try {
            int almost = 0;
            localFile = new File(Entity.tempShipPath + File.separator + username + File.separator + fileName + "temp", fileName + currentShip);
            if(localFile.exists()) localFile.delete();//删除原有的文件
            fileOutputStream = new FileOutputStream(localFile);
            int len = 0;
            byte[] bytes = new byte[1024];
            while ((len = inputStream.read(bytes)) != -1) {
                fileOutputStream.write(bytes, 0, len);
                fileOutputStream.flush();
                almost+=len;
            }
           // System.out.println("第" + currentShip + "个碎片的大小为" + almost);
            return true;

        } catch (Exception e) {
            //e.printStackTrace();
            logger.error("第" + currentShip + "个碎片上传失败",e);
            try {//先关闭流
                if (fileOutputStream != null) fileOutputStream.close();
            } catch (Exception e1) {
                logger.error("关闭流失败",e);
            }

            //并删除当前传输的文件
            if (localFile != null && localFile.exists()) localFile.delete();
        } finally {
            //关闭流
            try {
                if (fileOutputStream != null) fileOutputStream.close();
            } catch (Exception e) {
                //e.printStackTrace();
                logger.error("关闭流失败",e);
            }
        }
        return false;
    }

    /**
     * 合并碎片为一个文件
     *
     * @param username 发送结束请求合并者
     * @param fileName 请求合并的文件名
     * @param folderID 文件所属的文件夹
     * @return
     */
    @Override
    public boolean combineFileShip(String username, String fileName, int folderID, int shipCount) {
        if (!Entity.entityManger.userService.isFolderBelong2User(username, folderID)) return false;

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
        String tempPath = Entity.tempShipPath + File.separator + username + File.separator + fileName + "temp";
        int almost = 0;//文件总大小

        FileOutputStream fileOutputStream = null;
        try {
            //这里是存放正式文件的地方
            fileOutputStream = new FileOutputStream(new File(filePath));

            for (int i = 0; i < shipCount; i++) {
                //这里是存放临时文件的地方
                File file = new File(tempPath, fileName + i);
                FileInputStream fileInputStream = new FileInputStream(file);
                try {
                    byte[] bytes = new byte[1024];
                    int len = 0;
                    while ((len = fileInputStream.read(bytes)) != -1) {
                        fileOutputStream.write(bytes, 0, len);
                        almost += len;
                    }
                } finally {
                    fileInputStream.close();
                    if (file.exists()) file.delete();
                }
            }
            //写入文件数据到数据库
            //写入文件部分属性到数据库

            SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
            try {
                FileMapper fileMapper = sqlSession.getMapper(FileMapper.class);
            /* 重名校验 *///重名文件在文件名后夹 "(数字)"
                List<LoadFile> files = fileMapper.selectFoldersByFolderID(folderID);
                //filename = new FileNameUtil(files, filename).checkAndGetFileName();
                fileName = CheckAndEditSameName(files, fileName);
                LoadFile loadFile = new LoadFile(fileName, filePath, folderID, createtime, almost);
                fileMapper.insertFile(loadFile);
                sqlSession.commit();
            } catch (Exception e) {
                //文件数据写入数据库失败
                sqlSession.rollback();
                logger.error("文件写入数据库失败",e);

            } finally {
                sqlSession.close();
            }
            return true;

        } catch (Exception e) {
           //e.printStackTrace();
            logger.error(e);

        } finally {
            //完全删除临时文件夹
            DeleteFolder.delete(tempPath);
            try {
                if (fileOutputStream != null) fileOutputStream.close();
            } catch (IOException e) {
            }
        }
        return false;
    }


}
