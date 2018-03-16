package cn.showclear.utils;

import java.io.File;

/**
 * 删除文件夹的工具，即递归删除文件夹和文件夹下的所有文件
 */
public class DeleteFolder {

    //外层处理
    public static void  delete(File file){
        if(!file.exists() ) return;
        if(file.isFile()){
            file.delete();
        }else if(file.isDirectory()){
            deleteSRC(file);
            file.delete();
        }
    }

    public static void delete(String path){
        delete(new File(path));
    }

    //递归删除整个目录
    private static void deleteSRC(File path){
        if (!path.exists())
            return;
        if (path.isFile()) {
            path.delete();
            return;
        }
        File[] files = path.listFiles();
        for (int i = 0; i < files.length; i++) {
            deleteSRC(files[i]);
        }
        path.delete();
    }
}
