package cn.showclear.www.service.impl;

import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.dao.base.*;
import cn.showclear.www.pojo.base.Attach;
import cn.showclear.www.pojo.base.Directory;
import cn.showclear.www.pojo.base.Note;
import cn.showclear.www.pojo.base.User;
import cn.showclear.www.pojo.common.EasyUiTreeEntiy;
import cn.showclear.www.service.DirectoryService;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.ContextLoaderListener;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

@Service("easyuiDirService")
public class DirectoryServiceImpl implements DirectoryService {
    @Autowired
    private AttachDao attachDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private ShareDao shareDao;
    @Autowired
    private DirectoryDao directoryDao;
    @Autowired
    private NoteDao noteDao;
    @Autowired
    private TagDao tagDao;

    /**
     * 根据传入的username，获取该用户的笔记目录结构
     *
     * @param username 请求的用户名
     * @return json格式的目录结构(包括了笔记)
     */
    @Override
    public List<EasyUiTreeEntiy> showDirectories(String username) throws Exception {

        List<Directory> directories;
        List<Note> notes;
        try {
            directories = directoryDao.selectDirectoryByUsername(username);
            notes = noteDao.selectNotesByUsername(username);

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }


        //待返回的结构化的目录体
        List<EasyUiTreeEntiy> easyUiTreeEntiys = new ArrayList<>();

        //  先找到主目录
        for (Directory directory : directories) {
            if (directory.getParentId() == 0) {
                EasyUiTreeEntiy easyUiTreeEntiy = new EasyUiTreeEntiy(directory.getId() * 2 + 1, directory.getDirName(), CommonConstant.DIR_ICO);
                parseTreeList(notes, directories, directory.getId(), easyUiTreeEntiy);
                easyUiTreeEntiys.add(easyUiTreeEntiy);
            }
        }
        return easyUiTreeEntiys;


    }


    /**
     * 删除指定目录，包括其下的目录、笔记(笔记又和附件、标签相关联)
     *
     * @param directoryId 请求删除的目录id
     * @param username    请求者的用户名
     * @return
     */
    @Override
    public void deleteDirectory(int directoryId, String username) throws Exception {
        //检验目录的所属权

        Directory directory = directoryDao.selectDirectoryById(directoryId);
        User user = userDao.selectUserByUsername(username);
        if (user.getId() != directory.getUserId()) return;

        List<Directory> directories = directoryDao.selectDirectoryByUsername(username);
        List<Note> notes = noteDao.selectNotesByUsername(username);

        //准备登录到网盘
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(CommonConstant.netDiskUrl + "user/login");
        List<NameValuePair> nvps = new ArrayList<>();
        nvps.add(new BasicNameValuePair("username", user.getUsername()));
        nvps.add(new BasicNameValuePair("password", user.getPassword()));

        try {
            //登录到网盘
            httpPost.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8));
            CloseableHttpResponse execute = client.execute(httpPost);

            deleteDir(notes, directories, directoryId, client);

            directoryDao.deleteDirectoryById(directoryId);

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 在制定的目录下，添加一个新目录
     * 返回创建的目录
     *
     * @param parentDirectoryId 制定的父目录ID
     * @param newDirectoryName  请求创建的目录名
     * @param username          请求者的用户名
     */
    @Override
    public Directory addDirectory(int parentDirectoryId, String newDirectoryName, String username) throws Exception {

        //检验目录的所属权
        Directory directory = directoryDao.selectDirectoryById(parentDirectoryId);
        User user = userDao.selectUserByUsername(username);
        if (directory == null || user == null || user.getId() != directory.getUserId()) return null;

        Directory newDir = new Directory(newDirectoryName, parentDirectoryId, user.getId());
        try {
            directoryDao.insertDirectory(newDir);
            //int a = 1/0; //测试可行
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
        return newDir;
    }

    /**
     * 修改目录信息，一般是父目录或者名字
     * 根据传入的目录ID找到原来的目录，经过一定的信息校验后，修改原目录的名称或者位置
     *
     * @param directory 修改的目录
     * @param username  请求者的用户名
     */
    @Override
    public Directory editDirectory(Directory directory, String username) throws Exception{
        //检验目录的所属权
        Directory exitDirectory = directoryDao.selectDirectoryById(directory.getId());
        User user = userDao.selectUserByUsername(username);
        if (user == null || exitDirectory == null || user.getId() != exitDirectory.getUserId()) return null;
        if (exitDirectory.getParentId() == 0) return null;

        try {
            //检查是否要求改变父目录
            if (directory.getParentId() != null) {
                //检查移动到的目录的所有权
                Directory newDirectory = directoryDao.selectDirectoryById(directory.getParentId());
                if (newDirectory.getUserId() != user.getId()) return null;
                exitDirectory.setParentId(directory.getParentId());
            }
            //检查是否要求改变名称
            if (StringUtils.isNoneBlank(directory.getDirName())) exitDirectory.setDirName(directory.getDirName());
            directoryDao.editDirectoryWithNameAndParentDir(exitDirectory);

            return exitDirectory;
        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 用来递归转换成前段可使用的easyui树
     *
     * @param notes       当前用户所有的note
     * @param directories 当前用户所有的directorie
     * @param parentId    寻找这个父节点下的内容
     * @param parentTree  把结果加入到这个树节点
     */
    private void parseTreeList(List<Note> notes, List<Directory> directories, int parentId, EasyUiTreeEntiy parentTree) {

        //寻找形参目录id下的目录
        for (Directory directory : directories) {

            if (directory.getParentId() == parentId) {
                EasyUiTreeEntiy treeEntiy = new EasyUiTreeEntiy(directory.getId() * 2 + 1, directory.getDirName());
                treeEntiy.setIconCls(CommonConstant.DIR_ICO);
                parseTreeList(notes, directories, directory.getId(), treeEntiy);
                parentTree.getChildren().add(treeEntiy);
            }
        }
        //寻找形参目录id下的笔记
        for (Note note : notes) {
            if (note.getParentDirId() == parentId) {
                EasyUiTreeEntiy treeEntiy = new EasyUiTreeEntiy(note.getId() * 2, note.getNoteName());
                treeEntiy.setIconCls(CommonConstant.FILE_ICO);
                parentTree.getChildren().add(treeEntiy);

            }
        }
    }

    /**
     * 递归删除目录，对于笔记，还要删除tag和attach
     *
     * @param notes       当前用户所有的笔记
     * @param directories 当前用户所有的目录
     * @param parentId    删除这个节点下的内容
     * @param client      连接信息
     */
    private void deleteDir(List<Note> notes, List<Directory> directories, int parentId, CloseableHttpClient client) throws IOException {

        for (Note note : notes) {
            if (note.getParentDirId() == parentId) {
                //删除中间表关联的tag
                tagDao.deleteTagByNote(note);

                //删除note所有的附件（通过网盘接口）
                //1.
                List<Attach> attaches = attachDao.selectAttachsByNoteId(note.getId());

                for (Attach attach : attaches) {
                    //删除网盘上的文件
                    HttpPost httpPost = new HttpPost(CommonConstant.netDiskUrl + "folder/deleteFolderOrFile");
                    List<NameValuePair> nvps = new ArrayList<>();
                    nvps.add(new BasicNameValuePair("fID", String.valueOf(attach.getNetDiskId() * 2)));
                    httpPost.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8));
                    CloseableHttpResponse execute = client.execute(httpPost);
                    //删除本体数据库里的信息
                    attachDao.deleteAttachById(attach.getId());
                }

                //删除note本身
                noteDao.deleteNoteById(note.getId());

            }
        }

        for (Directory directory : directories) {
            if (directory.getParentId() == parentId) {
                //删除该目录下的内容
                deleteDir(notes, directories, directory.getId(), client);
                //然后删除该目录
                directoryDao.deleteDirectoryById(directory.getId());

            }
        }
    }
}
