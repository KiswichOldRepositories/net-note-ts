package cn.showclear.utils.fileUtil;



import cn.showclear.www.pojo.common.LoadFile;

import java.util.List;

/**
 * 校验文件的名字是否重复（用于上传文件和修改文件名），并返回合适的文件名
 * 若重名 则在文件名后加入 "(数字)"
 * //x现在加载了service里面
 *
 */
@Deprecated
public class FileNameUtil {
    //待检查的文件集合
    private List<LoadFile> files;
    //被检查的文件名（不带后缀）
    private String fileName;
    //被检查的文件名的后缀
    private String filePostfix;
    //重名处理后的文件名
    private String newName;
    //重名编号
    int num;

    //构造器 参数传入的唯一途径
    public FileNameUtil(List<LoadFile> files, String fileName) {
        this.files = files;
        this.newName = fileName;
        //文件名分割成 文件名和后缀名 方便处理
        String[] strings = fileName.split("\\.");
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < strings.length - 1; i++) {
            stringBuilder.append(strings[i]).append(".");
        }
        stringBuilder.deleteCharAt(stringBuilder.length() - 1);

        this.fileName = stringBuilder.toString();
        this.filePostfix = strings[strings.length - 1];
    }

    //外界调用 根据构造器传入的参数 返回合适的文件名
    public String checkAndGetFileName(){
        while(!check()){
            num++;
        }
        return newName;
    }

    //赋予新的newname，并检测当前的newname是否符合要求
    private boolean check(){
        //赋予新的newname
        if(num != 0){
            newName = new StringBuilder().append(fileName).append("(").append(num).append(").").append(filePostfix).toString();
        }
        //检测当前的newname是否符合要求
        for(LoadFile file :files){
                if(file.getFileName().equals(newName)) {
                    return false;
                }
        }
        return true;
    }
}
