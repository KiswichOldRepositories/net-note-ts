package cn.showclear.www.dao.base;

import cn.showclear.www.pojo.base.Share;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShareDao {
    List<Share> selectSharesByUserId(int id);
    List<Share> selectSharesByUsername(String username);
    Share selectShareByUrl(String url);
    Share selectShareById(int id);
    void deleteShareById(int id);
    int insertShare(Share share);
}
