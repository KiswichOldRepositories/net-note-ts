package cn.showclear.utils;

import cn.showclear.www.dao.FileMapper;
import cn.showclear.www.dao.FolderMapper;
import cn.showclear.www.pojo.common.Folder;
import cn.showclear.www.pojo.common.LoadFile;


import java.io.File;
import java.util.List;

//递归删除文件夹使用
public class DeleteFolderUtil {
    //操作数据库而传入的mapper
    private FolderMapper folderMapper;
    private FileMapper fileMapper;

    //当前用户所拥有的全部文件夹、文件数据
    private List<Folder> folderList;
    private List<LoadFile> fileList;

    private DeleteFolderUtil() {
    }//私有化无参构造器

    public DeleteFolderUtil(FolderMapper folderMapper, FileMapper fileMapper, List<Folder> folderList, List<LoadFile> fileList) {
        this.folderMapper = folderMapper;
        this.fileMapper = fileMapper;
        this.folderList = folderList;
        this.fileList = fileList;
    }

    //所要删除的文件夹 递归操作
    public void delete(Folder deletedFolder) {
        //先删除文件夹里面的内容
        deleteREC(deletedFolder);
        //再删除文件夹本身
        folderMapper.deleteFolder(deletedFolder);
    }

    private void deleteREC(Folder deletedFolder) {
        //查找目录下的文件并删除
        for (LoadFile loadFile : fileList) {
            if (loadFile.getFloderID() == deletedFolder.getId()) {
                //删除本地文件
                File file = new File(loadFile.getLocalURL());
                if (file.exists()) file.delete();
                //删除数据库文件
                fileMapper.deleteFile(loadFile);
            }
        }

        //查找目录下的文件夹进行递归删除
        for (Folder folder : folderList) {
            if (folder.getParentFolderID() == deletedFolder.getId()) {
                //递归删除
                delete(folder);
                //删除数据库
                folderMapper.deleteFolder(folder);
            }
        }
    }
}
