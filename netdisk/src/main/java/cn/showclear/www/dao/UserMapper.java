package cn.showclear.www.dao;


import cn.showclear.www.pojo.common.User;

public interface UserMapper {
     User selectUserByUsername(String username);
     User selectUserById(int id);

     void insertUser(User user);
}
