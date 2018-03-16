package cn.showclear.www.service;


import cn.showclear.www.pojo.common.Folder;
import cn.showclear.www.pojo.common.User;

public interface FolderService {
    /**
     * 创建用户目录，仅在注册完毕后创建
     * @param user 注册的用户信息（id必须包含）
     */
    public  boolean createUserFolder(User user) ;


    /**
     * 创建目录
     * @param parentFolder 请求上传至的位置（文件夹ID）
     * @param folderName 请求上传的文件夹名
     * @param username 请求创建者用户名
     */
    public  boolean createFolder(Folder parentFolder, String folderName, String username);

    /**
     * 删除文件夹（文件夹内部内容一并删除）
     * @param username 请求删除者的用户名
     * @param folderID 请求删除的文件夹ID
     */
    public  boolean deleteFolder(String username, int folderID);

    /**
     * 修改文件夹名称
     * @param username 请求修改者的用户名
     * @param folderID 请求修改的文件夹ID
     * @param newName 修改后的文件夹名称
     */
    public  boolean editFolder(String username, int folderID, String newName);


    /**
     * 获取某个用户的目录结构（传出json树）
     * @param username 获取的目录所属的用户 的用户名
     * @return 目录结构json树
     */
    public  String getFolderByUser(String username);
}
