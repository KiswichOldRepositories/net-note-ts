package cn.showclear.www.service;

import cn.showclear.www.pojo.base.User;

public interface UserService {

    /**
     * 验证登录的用户名、密码（存入一个为期7天的Cookie，方便）
     * @param user 待验证的用户信息
     */
    boolean loginByUser(User user);

    /**
     * 注册用户 并登录（存入一个为期7天的Cookie，方便）
     * @param user
     */
    boolean signUp(User user);
}
