package cn.showclear.www.service.impl;

import cn.com.scooper.common.resp.ZTreeNode;
import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.dao.base.*;
import cn.showclear.www.pojo.base.Directory;
import cn.showclear.www.pojo.base.Note;
import cn.showclear.www.pojo.base.Share;

import cn.showclear.www.pojo.base.User;
import cn.showclear.www.pojo.common.EasyUiTreeEntiy;
import cn.showclear.www.service.ShareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("shareZtree")
public class ShareZtreeServiceImpl implements ShareService<ZTreeNode> {

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
    @Autowired
    @Qualifier("shareEasyui")
    private ShareService shareService;

    /**
     * 根据用户名返回当前用户分享的笔记集合（json）
     *
     * @param username 请求者的用户名
     * @return 笔记集合的json字符串
     */
    @Override
    public List<ZTreeNode> showShareByUsername(String username) throws Exception {
        try {
            List<Share> shares = shareDao.selectSharesByUsername(username);

            ArrayList<ZTreeNode> zTreeNodes = new ArrayList<>();
            List<Note> notes = noteDao.selectNotesByUsername(username);
            List<Directory> directories = directoryDao.selectDirectoryByUsername(username);

            for (Share share : shares) {
                zTreeNodes.add(new ZTreeNode(-share.getId(), 0, share.getUrl(), true));


                if (share.getType() == CommonConstant.FLAG_NOTE) {//分享的是单个笔记
                    Note note = null;
                    for (Note tempNote : notes) {
                        if (tempNote.getId() == share.getNoteOrDirId()) note = tempNote;
                    }

                    if (note == null) {//分享的笔记失效了
                        //删除该分享
                        shareService.deleteShare(share.getId(), username);
                    } else {//分享的笔记是有效的
                        zTreeNodes.add(new ZTreeNode(note.getId() * 2, -share.getId(), note.getNoteName(), false));
                    }

                } else {//分享的是一整个目录
                    Directory directory = null;
                    for (Directory tempDirectory : directories) {
                        if (tempDirectory.getId() == share.getNoteOrDirId()) directory = tempDirectory;
                    }

                    if (directory == null) {//这是分享目录失效的情况，即分享的目录被人为删除了
                        //删除该分享
                        shareService.deleteShare(share.getId(), username);
                    } else {//分享的笔记是有效的

                        ZTreeNode zTreeNode = new ZTreeNode(directory.getId() * 2 + 1, -share.getId(), directory.getDirName(), true);
                        zTreeNodes.add(zTreeNode);
                        parseShare2Tree(notes, directories, zTreeNodes, directory.getId());
                    }
                }
            }
            return zTreeNodes;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }

    }

    private void parseShare2Tree(List<Note> notes, List<Directory> directories, List<ZTreeNode> zTreeNodes, int pid) throws Exception {

        for (Note note : notes) {
            if (note.getParentDirId() == pid) {
                zTreeNodes.add(new ZTreeNode(note.getId() * 2, note.getParentDirId() * 2 + 1, note.getNoteName(), false));
            }
        }

        for (Directory directory : directories) {
            if (directory.getParentId() == pid) {
                zTreeNodes.add(new ZTreeNode(directory.getId() * 2 + 1, directory.getParentId() * 2 + 1, directory.getDirName(), true));
                parseShare2Tree(notes, directories, zTreeNodes, directory.getId());
            }
        }

    }

    /**
     * 根据当前分享的url来返回该分享的笔记集合
     *
     * @param url 分享的url记录
     * @return 笔记集合的json字符串
     */
    @Override

    public List<ZTreeNode> showShareByUrl(String url) throws Exception {
        try {
            Share share = shareDao.selectShareByUrl(url);
            if (share == null) return null; //分享是不存在的
            List<ZTreeNode> zTreeNodes = new ArrayList<>();
            User user = userDao.selectUserById(share.getUserId());

            ZTreeNode zTreeNode = new ZTreeNode(-share.getId(), 0, share.getUrl(), true);
            zTreeNodes.add(zTreeNode);

            if (share.getType() == CommonConstant.FLAG_NOTE) {//分享内容为单个笔记

                Note note = noteDao.selectNoteById(share.getNoteOrDirId());
                if (note == null) {//分享的笔记失效了
                    //删除该分享
                    shareService.deleteShare(share.getId(), user.getUsername());
                    return null;
                }

                zTreeNodes.add(new ZTreeNode(note.getId() * 2, -share.getId(), note.getNoteName(), false));

            } else {//分享内容为一个目录

                List<Note> notes = noteDao.selectNotesByUsername(user.getUsername());
                List<Directory> directories = directoryDao.selectDirectoryByUsername(user.getUsername());

                Directory directory = null;
                //找到分享的目录
                for (Directory tempDirectory : directories) {
                    if (tempDirectory.getId() == share.getNoteOrDirId()) directory = tempDirectory;
                }

                if (directory == null) {//分享的目录是不存在的
                    shareService.deleteShare(share.getId(), user.getUsername());
                    return null;
                }

                ZTreeNode treeNode = new ZTreeNode(directory.getId() * 2 + 1, directory.getParentId() * 2 + 1, directory.getDirName(), true);
                zTreeNodes.add(treeNode);
                parseShare2Tree(notes, directories, zTreeNodes, directory.getId());
            }

            return zTreeNodes;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }


    }

    /**
     * 删除当前分享id所对应的分享记录
     *
     * @param shareId  要删除的分享对应的Id
     * @param username 请求者的用户名
     */
    @Override
    public void deleteShare(int shareId, String username) throws Exception {
        shareService.deleteShare(shareId, username);
    }

    /**
     * 添加分享记录，包括了分享的目录或者笔记的id、分享的类型（目录或者笔记）
     *
     * @param DirectoryOdNoteId 分享的目录或者笔记的id
     * @param shareType         分享的类型（目录或者笔记）
     * @param username          请求者的用户名
     */
    @Override
    public Share addShare(int DirectoryOdNoteId, int shareType, String username) throws Exception {
        return shareService.addShare(DirectoryOdNoteId, shareType, username);
    }
}
