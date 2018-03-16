package cn.showclear.www.service;



import cn.showclear.www.pojo.common.LoadFile;
import cn.showclear.www.pojo.common.LocalFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface FileService {
    /**
     * 上传文件
     * @param inputStream 上传文件的输入流
     * @param username 请求上传者的用户名
     * @param folderID 请求上传至的位置（文件夹ID）
     * @param filename 请求上传的文件名
     * @throws IOException
     */
    public  boolean uploadFile(InputStream inputStream, String username, int folderID, String filename) throws IOException;


    /**
     * 下载文件
     * @param username 请求下载者的用户名
     * @param fID 请求下载的文件/文件夹ID
     * @param flag 0代表请求下载文件，1代表请求下载文件夹
     * @return 包装类型 里面有文件输入流和下载文件名
     */
    public LocalFile downloadFile(String username, int fID, int flag);

    /**
     * 删除文件
     * @param username 请求删除者的用户名
     * @param fileID 请求删除的文件ID
     */
    public  boolean deleteFile(String username, int fileID);

    /**
     * 修改文件名
     * @param username 请求修改者的用户名
     * @param FileID 请求删除的文件ID
     * @param newName 新的文件名
     */
    public boolean editFile(String username, int FileID, String newName);
    /**
     * 校验文件的名字是否重复（用于上传文件和修改文件名），并返回合适的文件名
     * 若重名 则在文件名后加入 "(数字)"
     *
     * @param files    文件列表
     * @param fileName 要添加的文件名
     * @return
     */
    public String CheckAndEditSameName(List<LoadFile> files, String fileName);

    /**
     * 检查该文件的临时目录是否存在，不存在则创建
     * @param username 请求者用户名
     * @param fileName 请求检查的文件名
     * @return 返回当前是第几个碎片
     */
    public int checkTempFile(String username, String fileName);

    /**
     * 上传碎片 目录为 临时总目录/用户名/文件名+temp
     * @param username 请求者用户名
     * @param fileName 请求上传的文件名
     * @param currentShip 当前的碎片是第几个
     * @return
     */
    public boolean uploadFileShip(InputStream inputStream, String username, String fileName, String currentShip);

    /**
     * 合并碎片为一个文件
     * @param username 发送结束请求合并者
     * @param fileName 请求合并的文件名
     * @param folderID 文件所属的文件夹
     * @return
     */
    public boolean combineFileShip(String username, String fileName, int folderID, int shipCount);
}
