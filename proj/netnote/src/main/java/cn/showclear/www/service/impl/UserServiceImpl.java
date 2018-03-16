package cn.showclear.www.service.impl;

import cn.showclear.www.dao.base.DirectoryDao;
import cn.showclear.www.dao.base.UserDao;
import cn.showclear.www.pojo.base.Directory;
import cn.showclear.www.pojo.base.User;
import cn.showclear.www.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.ContextLoaderListener;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;
    @Autowired
    private DirectoryDao directoryDao;

    /**
     * 验证登录的用户名、密码（存入一个为期7天的Cookie，方便）(前端完成)
     *
     * @param user 待验证的用户信息
     */
    @Override
    public boolean loginByUser(User user) {
        User selectUser = userDao.selectUserByUsernameAndPassword(user);
        if (selectUser != null) {
            checkUserDir(user.getUsername());
            return true;
        }
        return false;
    }

    /**
     * 注册用户 并登录（存入一个为期7天的Cookie，方便）
     *
     * @param user
     */
    @Override
    public boolean signUp(User user) {
        //校验用户名、密码的格式
        if (!checkUser(user)) return false;

        //用户是否存在
        User exitedUser = userDao.selectUserByUsername(user.getUsername());

        if (exitedUser != null) return false;
        //插入用户名
        userDao.insertUser(user);
        checkUser(user);
        return true;
    }

    private boolean checkUser(User user) {

        return true;
    }

    /**
     * 检查用户目录是否存在，如果不存在就创建
     *
     * @param username 用户名
     */
    private void checkUserDir(String username) {
        User user = userDao.selectUserByUsername(username);
        List<Directory> directories = directoryDao.selectDirectoryByUsername(username);
        if (user != null && directories.isEmpty()) {//创建用户目录
            Directory directory = new Directory(username, 0, user.getId());
            directoryDao.insertDirectory(directory);
        }
    }
}
