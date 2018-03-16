package cn.showclear.www.service;


import cn.showclear.www.pojo.common.LocalFile;

public interface ShareService {

    /**
     * 添加分享
     * @param username 请求添加分享者的用户名
     * @param fID 请求分享的文件/文件夹ID
     * @param flag 0表示分享文件，1表示分享文件夹
     */
    public  boolean addShare(String username, int fID, int flag);

    /**
     * 请求关闭分享
     * @param shareID 请求关闭的分享记录的ID
     * @param username  请求者的用户名
     */
    public  boolean deleteShare(int shareID, String username);

    /**
     * 请求下载分享
     *  分享的id，分享的文件、文件夹标志
     * @return  类中包含文件输入流和文件名
     */
    public LocalFile getShare(int fID, int flag);

    /**
     * 展示某个用户分享记录的json树
     * @param username 展示分享用户的用户名
     * @return 分享记录的json树
     */
    public String showShare(String username);

    /**
     * 检查当前的分享标志位是否存在
     * @param shareFlag 分享的链接标志
     * @return success存在 error不存在
     */
    public String checkShare(String shareFlag);

    /**
     * 展示某个分享链接的JSON树
     * @param shareFlag 分享的链接标志
     * @return json树
     */
    public String showShareByFlag(String shareFlag);
}
