package cn.showclear.www.dao;



import cn.showclear.www.pojo.common.LoadFile;

import java.util.List;

public interface FileMapper {
    List<LoadFile> selectFilesByUsename(String username);
    List<LoadFile> selectFoldersByFolderID(int folderID);
    void insertFile(LoadFile loadFile);
    LoadFile selectFileByID(int id);
    void updataFileName(LoadFile file);
    void deleteFile(LoadFile file);
}
