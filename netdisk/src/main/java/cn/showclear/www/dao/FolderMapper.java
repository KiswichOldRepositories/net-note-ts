package cn.showclear.www.dao;


import cn.showclear.www.pojo.common.Folder;
import cn.showclear.www.pojo.common.User;

import java.util.List;

public interface FolderMapper {
    List<Folder> findFoldersByUser(User user);
    Folder selectFolderById(int id);

    void createFolder(Folder folder);
    void editFolder(Folder folder);
    void deleteFolder(Folder folder);
    List<Folder> selectFoldersByParentsId(int parentID);
}
