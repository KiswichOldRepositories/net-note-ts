package cn.showclear.utils.folderUtil;



import cn.showclear.www.pojo.common.Folder;

import java.util.List;

/**
 * 校验文件夹的名字是否重复（用于新建文件夹和修改文件夹），并返回合适的文件夹名称 ：文件名加"（数字）"
 * //现在已经写在了serivice里面
 */
@Deprecated
public class folderNameUtil {
    //待检查的文件夹列表
    private List<Folder> folders;
    //传入的被检查的文件夹名
    private String folderName;
    //准备返回的合适的文件夹名
    private String newName;
    //重名编号
    private int num;

    //构造器 参数传入的唯一途径
    public folderNameUtil(List<Folder> folders, String folderName) {
        this.folders = folders;
        this.folderName = folderName;
        newName = folderName;
    }

    //用户调用的方法 ，根据构造器传入的参数，返回合适的文件夹名
    public String checkAndGetFolderName(){
        while(!check()){
            num++;
        }
        return  newName;
    }

    //生成新的文件夹名称，并检查是否重名
    private boolean check(){
        if(num!=0){
            newName = new StringBuilder().append(folderName).append("(").append(num).append(")").toString();
        }
        for(Folder folder : folders){
                if (folder.getFolderName().equals(newName)) {
                    return false;
                }
        }
        return true;
    }
}
