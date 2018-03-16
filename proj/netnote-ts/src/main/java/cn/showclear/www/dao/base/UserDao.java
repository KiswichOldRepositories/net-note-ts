package cn.showclear.www.dao.base;


import cn.showclear.www.pojo.base.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao {
    User selectUserByUsername(String username);
    User selectUserById(int id);
    User selectUserByUsernameAndPassword(User user);
    int insertUser(User user);
}
