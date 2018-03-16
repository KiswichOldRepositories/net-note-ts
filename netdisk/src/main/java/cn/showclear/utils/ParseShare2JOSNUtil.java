package cn.showclear.utils;

import cn.showclear.www.pojo.common.Folder;
import cn.showclear.www.pojo.common.LoadFile;
import cn.showclear.www.pojo.common.Share;
import com.fasterxml.jackson.databind.ObjectMapper;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


/**
 * 返回分享文件的json树
 *
 */
public class ParseShare2JOSNUtil {
    private List<Share> shares;
    private List<LoadFile> loadFiles;
    private List<Folder> folders;
    private List<EasyUiTree> easyUiTree = new ArrayList<EasyUiTree>();

    public ParseShare2JOSNUtil(List<Share> shares, List<LoadFile> loadFiles, List<Folder> folders) {
        this.shares = shares;
        this.loadFiles = loadFiles;
        this.folders = folders;
    }

    /**
     * 启动转换
     * @return
     * @throws IOException
     */
    public String parse() throws IOException {
        /*
         * 因为分享链接有多个，要针对每一个分享链接，都加入到json树
         */
        //遍历share作为父节点
        for (Share share : shares) {
            EasyUiTree tree = new EasyUiTree(share.getId(), share.getShareFlag());
            if(share.getShareType() == 0){//文件
                addFile(share.getShareFID(),tree);

            }else if (share.getShareType() == 1){//文件夹
                addFolder(share.getShareFID(),tree);
            }

            tree.iconCls = "icon-myfolder";
            this.easyUiTree.add(tree);
        }

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(easyUiTree);
        return json;
    }


    private void addFile(int fileID, EasyUiTree tree){
        for(LoadFile loadFile:loadFiles){
            if(fileID == loadFile.getId()){
                //找到该文件
                EasyUiTree uiTree = new EasyUiTree(2 * loadFile.getId(), loadFile.getFileName());
                uiTree.iconCls = "icon-myfile";
                tree.children.add(uiTree);
            }
        }
    }

    private void addFolder(int folderID, EasyUiTree tree){
        for(Folder folder:folders){//遍历找到分享的文件夹
            if(folderID == folder.getId()){
                EasyUiTree cTree = new EasyUiTree(2*folder.getId()+1,folder.getFolderName());
                parseEasyUITree(folder.getId(),cTree);
                cTree.iconCls = "icon-myfolder";
                tree.children.add(cTree);
            }
        }
    }

    //代码有重复
    //针对easyui所需要的json格式（每次递归依然遍历了所有的元素，性能有所浪费）
    private void parseEasyUITree(int parentFolderID, EasyUiTree tree) {

        //遍历 文件夹集合 ，查找父节点的子元素
        for (Folder childFolder : folders) {
            if (childFolder.getParentFolderID() == parentFolderID) {//该元素为子节点

                //id分成奇偶（文件夹奇，文件偶），传入json
                EasyUiTree easyUiTree = new EasyUiTree(2 * childFolder.getId() + 1, childFolder.getFolderName());
                easyUiTree.iconCls = "icon-myfolder";
                tree.children.add(easyUiTree);

                //该元素成为新的父节点加入递归
                parseEasyUITree(childFolder.getId(), easyUiTree);
//                //若为空文件夹 则加入一个空的对象使得easyui将其解析为文件夹(这样会在空文件夹下显示一个空的文件)
//                if(easyUiTree.children.isEmpty()) easyUiTree.children.add(new EasyUiTree(0,""));
            }
        }
        //遍历 文件集合 ，查找父节点的子元素
        for (LoadFile childFile : loadFiles) {
            if (childFile.getFloderID() == parentFolderID) {
                //id分成奇偶（文件夹奇，文件偶），传入json
                EasyUiTree easyUiTree = new EasyUiTree(2 * childFile.getId(), childFile.getFileName());
                easyUiTree.iconCls = "icon-myfile";
                tree.children.add(easyUiTree);
            }
        }
    }
}
