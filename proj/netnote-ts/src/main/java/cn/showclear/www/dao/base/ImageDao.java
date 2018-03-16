package cn.showclear.www.dao.base;

import cn.showclear.www.pojo.base.Image;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageDao {
    int inserImg(Image image);
    Image selectImageByUrl(String url);
}
