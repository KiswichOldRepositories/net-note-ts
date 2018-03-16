package cn.showclear.utils;


import cn.showclear.www.pojo.common.Folder;
import cn.showclear.www.pojo.common.LoadFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;


import java.io.IOException;
import java.util.Iterator;
import java.util.List;

/**
 * 将文件夹、文件转成json 用作显示
 */
public class ParseFolders2JSONUtil {
    private static Logger logger = Logger.getLogger(ParseFolders2JSONUtil.class);

    //方法所生成的文件树的头结点
    private FileTree file;
    private EasyUiTree easyUiTree;
    //方法公用迭代器
    private Iterator<Folder> folderIterator;
    private Iterator<LoadFile> loadFileIterator;
    //方法公用元素集合（用于每个递归中的循环）
    private List<Folder> CommentFolders;
    private List<LoadFile> CommentLoadFiles;

    public String parse2JSON(List<Folder> foldersA, List<LoadFile> loadFilesA) {
        //添加公用元素（）
        folderIterator = foldersA.iterator();
        loadFileIterator = loadFilesA.iterator();
        CommentFolders = foldersA;
        CommentLoadFiles = loadFilesA;
        //jackson
        String json = null;//
        ObjectMapper objectMapper = new ObjectMapper();

        //遍历寻找父元素
        Folder parents = null;
        for (Folder folder : foldersA) {
            if (folder.getParentFolderID() == 0) {
                parents = folder;
                break;
            }
        }
        try {
            //添加为父节点
            easyUiTree = new EasyUiTree(parents.getId() * 2 + 1, parents.getFolderName());
            //显示为文件夹
            easyUiTree.iconCls = "icon-myfolder";

            //递归生成文件树
            parseEasyUITree(parents.getId(), easyUiTree);
//            //若为空文件夹 则加入一个空的对象使得easyui将其解析为文件夹(这样会在空文件夹下显示一个空的文件，有时间研究下tree的源码)
//            if(easyUiTree.children.isEmpty()) easyUiTree.children.add(new EasyUiTree(0,"",1));

            //文件树转json
            json = objectMapper.writeValueAsString(easyUiTree);

            //easyui格式要求 ，最外层为数组
            json = new StringBuilder(json).insert(0,"[").append("]").toString();
            //System.out.println(json);
            logger.info(json);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return json;
    }

    //针对easyui所需要的json格式（每次递归依然遍历了所有的元素，性能有所浪费）
    public void parseEasyUITree(int parentFolderID, EasyUiTree tree) {

        //遍历 文件夹集合 ，查找父节点的子元素
        for (Folder childFolder : CommentFolders) {
            if (childFolder.getParentFolderID() == parentFolderID) {//该元素为子节点

                //id分成奇偶（文件夹奇，文件偶），传入json
                EasyUiTree easyUiTree = new EasyUiTree(2 * childFolder.getId() + 1, childFolder.getFolderName());
                easyUiTree.iconCls = "icon-myfolder";
                tree.children.add(easyUiTree);

                //该元素成为新的父节点加入递归
                parseEasyUITree(childFolder.getId(), easyUiTree);
//                //若为空文件夹 则加入一个空的对象使得easyui将其解析为文件夹(这样会在空文件夹下显示一个空
//                 if(easyUiTree.children.isEmpty()) easyUiTree.children.add(new EasyUiTree(0,""));
            }
        }
        //遍历 文件集合 ，查找父节点的子元素
        for (LoadFile childFile : CommentLoadFiles) {
            if (childFile.getFloderID() == parentFolderID) {
                //id分成奇偶（文件夹奇，文件偶），传入json
                EasyUiTree easyUiTree = new EasyUiTree(2 * childFile.getId(), childFile.getFileName());
                easyUiTree.iconCls = "icon-myfile";
                tree.children.add(easyUiTree);
            }
        }
    }


    //方法低效 普通的遍历不能删除使用了的节点
    @Deprecated //生成的json数据格式不符合easy-ui的数据标准
    public void parseFileTree(int parentFolderID, FileTree tree) {

        //遍历 文件夹集合 ，查找父节点的子元素
        for (Folder childFolder : CommentFolders) {
            if (childFolder.getParentFolderID() == parentFolderID) {
                //该元素为子节点
                FileTree newParentFolder = new FileTree(childFolder);
                tree.others.add(newParentFolder);
                //该元素成为新的父节点加入递归
                parseFileTree(childFolder.getId(), newParentFolder);
            }
        }
        //遍历 文件集合 ，查找父节点的子元素
        for (LoadFile childFile : CommentLoadFiles) {
            if (childFile.getFloderID() == parentFolderID) {
                tree.others.add(childFile);
            }
        }

    }


    //方法错误 原因：迭代器单向
    //想用迭代式实现递归 - -。
    @Deprecated
    public void parseLast(int parentFolderID, FileTree tree) {

        //递归生成文件夹

        while (true) {
            //应该有更简洁的循环方式
            Folder folder = null;
            LoadFile loadFile = null;
            if (folderIterator.hasNext()) folder = folderIterator.next();
            if (loadFileIterator.hasNext()) loadFile = loadFileIterator.next();
            if (folder == null && loadFile == null) break;

            //迭代folder的父元素ID与 传入的元素ID相等 ，即该元素为传入元素的子元素
            if (folder != null && folder.getParentFolderID() == parentFolderID) {
                //删除迭代器中的该元素
                folderIterator.remove();
                //创建头结点为该元素的文件树
                FileTree childTree = new FileTree(folder);
                //在父文件树中加入该元素
                tree.others.add(childTree);
                //递归 寻找该元素的子节点
                parseLast(folder.getId(), childTree);

            }
            //文件所在该文件夹下
            if (loadFile != null && loadFile.getFloderID() == parentFolderID) {
                //删除迭代器中的该元素
                loadFileIterator.remove();
                //加入该元素
                tree.others.add(folder);
            }
        }
    }
}
