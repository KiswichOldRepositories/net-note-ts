package cn.showclear.www.service.impl;

import cn.com.scooper.common.resp.ZTreeNode;
import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.dao.base.*;
import cn.showclear.www.pojo.base.Directory;
import cn.showclear.www.pojo.base.Note;
import cn.showclear.www.pojo.common.EasyUiTreeEntiy;
import cn.showclear.www.service.DirectoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("zTreeDirService")
public class DirectoryZtreeServiceImpl implements DirectoryService {
    @Autowired
    @Qualifier("easyuiDirService")
    private DirectoryService directoryService;
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
    public List<ZTreeNode> showDirectories(String username) {
        List<Directory> directories = directoryDao.selectDirectoryByUsername(username);
        List<Note> notes = noteDao.selectNotesByUsername(username);

        //待返回的结构化的目录体
        List<ZTreeNode> zTreeNodes = new ArrayList<>();

        //ztree的简单数据格式 直接返回就好
        for (Directory directory : directories) {
            zTreeNodes.add(new ZTreeNode(directory.getId() * 2 + 1, directory.getParentId() * 2 + 1, directory.getDirName(), true));
        }

        for (Note note : notes) {
            zTreeNodes.add(new ZTreeNode(note.getId() * 2, note.getParentDirId() * 2 + 1, note.getNoteName(), false));
        }

        return zTreeNodes;
    }

    /**
     * 删除指定目录，包括其下的目录、笔记
     *
     * @param directoryId 请求删除的目录id
     * @param username    请求者的用户名
     * @return
     */
    @Override
    public void deleteDirectory(int directoryId, String username) {
        directoryService.deleteDirectory(directoryId, username);
    }

    /**
     * 在制定的目录下，添加一个新目录
     *
     * @param parentDirectoryId 制定的父目录ID
     * @param newDirectoryName  请求创建的目录名
     * @param username          请求者的用户名
     */
    @Override
    public Directory addDirectory(int parentDirectoryId, String newDirectoryName, String username) {
        return directoryService.addDirectory(parentDirectoryId, newDirectoryName, username);
    }

    /**
     * 修改目录信息，一般是父目录或者名字
     * 根据传入的目录ID找到原来的目录，经过一定的信息校验后，修改原目录的名称或者位置
     *
     * @param directory 修改的目录
     * @param username  请求者的用户名
     */
    @Override
    public Directory editDirectory(Directory directory, String username) {
        return directoryService.editDirectory(directory, username);
    }
}
