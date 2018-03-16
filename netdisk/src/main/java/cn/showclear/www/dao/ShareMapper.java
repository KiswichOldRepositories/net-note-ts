package cn.showclear.www.dao;



import cn.showclear.www.pojo.common.Folder;
import cn.showclear.www.pojo.common.LoadFile;
import cn.showclear.www.pojo.common.Share;

import java.util.List;

public interface ShareMapper {
    List<Share> selectShareByURL(String url);
    void insertShare(Share share);
    List<Share> selectShareByUsername(String username);
    List<LoadFile> selectShareFileByUsername(String username);
    List<Folder> selectShareFolderByUsername(String username);
    Share selectShareById(int id);
    void deleteShareByID(int shareID);
}
