package cn.showclear.www.service.impl;

import cn.showclear.www.config.entity.Entity;
import cn.showclear.www.dao.FolderMapper;
import cn.showclear.www.dao.UserMapper;

import cn.showclear.www.pojo.common.Folder;
import cn.showclear.www.pojo.common.User;
import cn.showclear.www.service.UserService;
import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;


/**
 * 有关用户的业务
 */
public class UserServiceImpl implements UserService {

    private final static Logger logger = Logger.getLogger(UserServiceImpl.class);

    /**
     * 注册用户
     */
    public boolean addUser(User user) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        try {
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            User exitedUser = userMapper.selectUserByUsername(user.getUsername());//校验重复用户名
            if (exitedUser == null) {
                //如果没有重复用户名
                userMapper.insertUser(user);
                user = userMapper.selectUserByUsername(user.getUsername());
                //创建用户目录
                Entity.entityManger.folderService.createUserFolder(user);
                sqlSession.commit();
                return true;
            } else {

            }
        } catch (Exception e) {
            logger.error("注册用户发生错误", e);
            sqlSession.rollback();
        } finally {
            sqlSession.close();
        }
        return false;
    }

    /**
     * 用户登录 之前需要用户校验
     */
    public boolean loginInUser(User user) {

        //登录校验
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        try {
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            User exitedUser = userMapper.selectUserByUsername(user.getUsername());//校验重复用户名
            sqlSession.commit();

            if (exitedUser != null && exitedUser.getPassword().equals(user.getPassword())) {//用户校验成功
                //创建用户目录
                Entity.entityManger.folderService.createUserFolder(exitedUser);
                return true;
            } else {
                return false;
            }

        } catch (Exception e) {
            //e.printStackTrace();
            logger.error("用户登录发生问题", e);
            sqlSession.rollback();
            return false;
        } finally {
            sqlSession.close();
        }
    }

    @Override
    public boolean isFolderBelong2User(String username, int folderID) {
        SqlSession sqlSession = Entity.entityManger.sqlSessionFactory.openSession();
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        FolderMapper folderMapper = sqlSession.getMapper(FolderMapper.class);
        try {
            User user = userMapper.selectUserByUsername(username);
            Folder folder = folderMapper.selectFolderById(folderID);
            sqlSession.commit();
            return user.getId() == folder.getUsernameID();
        } catch (Exception e) {
            sqlSession.rollback();
            e.printStackTrace();
        } finally {
            sqlSession.close();
        }
        return  false;
    }

}
