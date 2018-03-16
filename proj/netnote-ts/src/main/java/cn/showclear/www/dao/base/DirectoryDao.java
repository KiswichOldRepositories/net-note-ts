package cn.showclear.www.dao.base;

import cn.showclear.www.pojo.base.Directory;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DirectoryDao {
    List<Directory> selectDirectoryByUsername(String username);
    Directory selectDirectoryById(int id);
    void deleteDirectoryById(int id);
    int insertDirectory(Directory directory);
    void editDirectoryWithNameAndParentDir(Directory directory);
    List<Directory> selectDirectoriesByParentId(int parentId);
}
