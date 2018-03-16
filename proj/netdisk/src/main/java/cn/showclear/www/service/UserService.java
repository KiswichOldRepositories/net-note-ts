package cn.showclear.www.service;


import cn.showclear.www.pojo.common.User;

public interface UserService {

    /**
     * 注册用户
     * @param user （其中的id属性不重要）
     */
    public  boolean addUser(User user);

    /**
     * 用户登录
     * @param user （其中的id属性不重要）
     * @return 登录成功/失败
     */
    public  boolean loginInUser(User user) ;

    /**
     * 检查文件夹是否为该用户的
     * @param username
     * @param folderID
     * @return
     */
    public boolean isFolderBelong2User(String username, int folderID);


}
