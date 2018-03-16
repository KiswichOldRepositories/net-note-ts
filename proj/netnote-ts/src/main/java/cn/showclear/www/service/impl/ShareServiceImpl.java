package cn.showclear.www.service.impl;

import cn.showclear.utils.CreateRandomString;
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
import org.springframework.web.context.ContextLoaderListener;

import java.util.ArrayList;
import java.util.List;

@Service("shareEasyui")
public class ShareServiceImpl implements ShareService<EasyUiTreeEntiy> {
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
    public List<EasyUiTreeEntiy> showShareByUsername(String username) throws Exception {

        try {
            List<Share> shares = shareDao.selectSharesByUsername(username);
            ArrayList<EasyUiTreeEntiy> easyUiTreeEntiys = new ArrayList<>();

            for (Share share : shares) {
                EasyUiTreeEntiy easyUiTreeEntiy = new EasyUiTreeEntiy(share.getId(), share.getUrl());
                easyUiTreeEntiys.add(easyUiTreeEntiy);


                if (share.getType() == CommonConstant.FLAG_NOTE) {//分享的是单个笔记
                    Note note = noteDao.selectNoteById(share.getNoteOrDirId());
                    if (note == null) {//分享的笔记失效了
                        //删除该分享
                        shareService.deleteShare(share.getId(), username);
                    } else {//分享的笔记是有效的
                        easyUiTreeEntiy.getChildren().add(new EasyUiTreeEntiy(note.getId() * 2, note.getNoteName()));
                    }

                } else {//分享的是一整个目录
                    Directory directory = directoryDao.selectDirectoryById(share.getNoteOrDirId());
                    if (directory == null) {//这是分享目录失效的情况，即分享的目录被人为删除了
                        //删除该分享
                        shareService.deleteShare(share.getId(), username);

                    } else {//分享的笔记是有效的
                        EasyUiTreeEntiy dirTree = new EasyUiTreeEntiy(directory.getId() * 2 + 1, directory.getDirName());
                        parseShare2Tree(dirTree, directory);
                        easyUiTreeEntiy.getChildren().add(dirTree);
                    }
                }
            }
            return easyUiTreeEntiys;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }

    }

    /**
     * 根据当前分享的url来返回该分享的笔记集合
     *
     * @param url 分享的url记录
     * @return 笔记集合的json字符串
     */
    @Override
    public List<EasyUiTreeEntiy> showShareByUrl(String url) {

        Share share = shareDao.selectShareByUrl(url);
        ArrayList<EasyUiTreeEntiy> easyUiTreeEntiys = new ArrayList<>();
        EasyUiTreeEntiy easyUiTreeEntiy = new EasyUiTreeEntiy();
        easyUiTreeEntiys.add(easyUiTreeEntiy);
        easyUiTreeEntiy.setText(share.getUrl());

        if (share.getType() == CommonConstant.FLAG_NOTE) {//分享内容为单个笔记

            Note note = noteDao.selectNoteById(share.getNoteOrDirId());
            easyUiTreeEntiy.getChildren().add(new EasyUiTreeEntiy(note.getId() * 2, note.getNoteName(), CommonConstant.FILE_ICO));

        } else {//分享内容为一个目录

            Directory directory = directoryDao.selectDirectoryById(share.getNoteOrDirId());
            EasyUiTreeEntiy dirTree = new EasyUiTreeEntiy(directory.getId() * 2 + 1, directory.getDirName(), CommonConstant.DIR_ICO);
            parseShare2Tree(dirTree, directory);
            easyUiTreeEntiy.getChildren().add(dirTree);

        }
        return easyUiTreeEntiys;
    }

    /**
     * 删除当前分享id所对应的分享记录
     *
     * @param shareId  要删除的分享对应的Id
     * @param username 请求者的用户名
     */
    @Override
    public void deleteShare(int shareId, String username) throws  Exception{
        try {
            //校验当前分享的所有权
            Share share = shareDao.selectShareById(shareId);
            User user = userDao.selectUserByUsername(username);
            if (user == null|| share==null||user.getId() != share.getUserId()) throw new Exception();
            shareDao.deleteShareById(shareId);
        }catch (Exception e){
            e.printStackTrace();
            throw  e;
        }


    }

    /**
     * 添加分享记录，包括了分享的目录或者笔记的id、分享的类型（目录或者笔记）
     *
     * @param DirectoryOdNoteId 分享的目录或者笔记的id
     * @param shareType         分享的类型（目录或者笔记）
     * @param username          请求者的用户名
     */
    @Override
    public Share addShare(int DirectoryOdNoteId, int shareType, String username) throws  Exception{

        User user = userDao.selectUserByUsername(username);
        if (shareType == CommonConstant.FLAG_NOTE) {//分享内容为文件
            //校验笔记的所有权
            Note note = noteDao.selectNoteById(DirectoryOdNoteId);
            if (user == null || note == null || user.getId() != note.getUserId()) return null;

        } else {//分享内容为目录
            //校验目录的所有权
            Directory directory = directoryDao.selectDirectoryById(DirectoryOdNoteId);
            if (directory == null || user == null || directory.getUserId() != user.getId()) return null;
        }

        try {
            //生成为一个url
            String url = null;

            while (true) {
                url = CreateRandomString.create(10);
                if (shareDao.selectShareByUrl(url) == null) break;
            }
            //写入分享数据到数据库
            Share share = new Share(url, DirectoryOdNoteId, shareType, user.getId());
            shareDao.insertShare(share);

            return share;
        }catch (Exception e){
            e.printStackTrace();
            throw  e;
        }

    }

    /**
     * 遍历directory为父节点的目录，并加入到easyUI树中
     *
     * @param easyUiTreeEntiy
     * @param directory
     */
    private void parseShare2Tree(EasyUiTreeEntiy easyUiTreeEntiy, Directory directory) {
        List<Directory> directories = directoryDao.selectDirectoriesByParentId(directory.getId());
        List<Note> notes = noteDao.selectNotesByParentId(directory.getId());

        //遍历当前父节点下的目录
        for (Directory directoryTemp : directories) {
            EasyUiTreeEntiy treeEntiy = new EasyUiTreeEntiy(directoryTemp.getId() * 2, directoryTemp.getDirName());
            easyUiTreeEntiy.getChildren().add(treeEntiy);
            parseShare2Tree(treeEntiy, directoryTemp);
        }

        //遍历当前父节点下的note
        for (Note noteTemp : notes) {
            easyUiTreeEntiy.getChildren().add(new EasyUiTreeEntiy(noteTemp.getId() * 2, noteTemp.getNoteName()));
        }
    }
}
