package cn.showclear.www.service.impl;

import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.dao.base.*;
import cn.showclear.www.pojo.base.*;
import cn.showclear.www.service.AttachService;
import cn.showclear.www.service.NoteService;
import cn.showclear.www.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class NoteServiceImpl implements NoteService {
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
    private AttachService attachService;
    @Autowired
    private TagService tagService;

    /**
     * 添加一个笔记到数据库
     *
     * @param note     id属性会被无视
     * @param username
     */
    @Override
    public Note addNote(Note note, String username) throws RuntimeException {
        //验证要添加到的文件夹是否属于用户的
        int directoryId = note.getParentDirId();
        Directory directory = directoryDao.selectDirectoryById(directoryId);
        User user = userDao.selectUserByUsername(username);
        if (directory.getUserId() != user.getId()) return null;

        note.setUserId(user.getId());
        noteDao.insertNote(note);
        return note;
    }

    /**
     * 删除一个笔记(包括笔记本身、笔记所带的附件、笔记的分享（一个分享里的全部内容被删除后，分享也应该取消）、中间表的标签)
     *
     * @param deletedNoteId 删除的笔记ID
     * @param username      请求者的用户名
     */
    @Override
    public void deleteNote(int deletedNoteId, String username) {

        //验证笔记的所有权

        Note deletedNote = noteDao.selectNoteById(deletedNoteId);
        User user = userDao.selectUserByUsername(username);
        if (user.getId() != deletedNote.getUserId()) return;

        //删除笔记本的附件
        List<Attach> attaches = attachDao.selectAttachsByNoteId(deletedNoteId);
        for (Attach attach : attaches) {
            attachService.deleteAttachById(attach.getId(), username);

        }


        //删除笔记本的标签
        List<Tag> tags = tagDao.selectTagsByNote(deletedNote);
        for (Tag tag : tags) {
            tagService.deleteTag(tag.getId(), deletedNoteId, username);
        }

        //删除笔记本身
        noteDao.deleteNoteById(deletedNoteId);
    }

    /**
     * 修改一个笔记（包括笔记的内容、笔记名称、笔记位置），其中修改标签和修改上传附件就放在单独的service中完成
     *
     * @param editNote null的项表示不用修改
     * @param username 请求者的用户名
     */
    @Override
    public Note editNote(Note editNote, String username) {

        int directoryId = 0;
        User user = userDao.selectUserByUsername(username);

        if (editNote.getParentDirId() != null) {
            directoryId = editNote.getParentDirId();
            //验证要改变到的文件夹是否属于用户的
            Directory directory = directoryDao.selectDirectoryById(directoryId);
            if (directory.getUserId() != user.getId()) return null;
        }
        //验证笔记是否为用户的
        Note note = noteDao.selectNoteById(editNote.getId());
        if (note.getUserId() != user.getId()) return null;

        if (editNote.getNoteText() != null) note.setNoteText(editNote.getNoteText());
        if (editNote.getNoteName() != null) note.setNoteName(editNote.getNoteName());
        if (editNote.getParentDirId() != null) note.setParentDirId(editNote.getParentDirId());

        noteDao.updateNoteByTextAndNameAndDir(note);
        return note;
    }

    /**
     * 获取笔记内容(校验笔记是否被分享)
     *
     * @param noteId   获取的笔记ID
     * @param username 请求着的用户名
     * @return
     */
    @Override
    public Note getNote(int noteId, String username) {
        Note note = noteDao.selectNoteById(noteId);
        User user = userDao.selectUserByUsername(username);
        if (user != null && user.getId() == note.getUserId()) {//获取的目录即为用户所拥有的目录
            return note;
        } else {//查询所取得目录是否是分享的目录
            //方案2.
            User notesUser = userDao.selectUserById(note.getUserId());
            List<Integer> parents = new ArrayList<>();//这里存放该文件所有的父文件夹
            boolean shareFlag = false;
            //1.对该笔记，遍历出所有的父文件夹 //一次方级别
            List<Directory> directories = directoryDao.selectDirectoryByUsername(notesUser.getUsername());
            int parentId = note.getParentDirId();
            parents.add(parentId);

            OUT:
            while (parentId != 0) {
                for (Directory directory : directories) {
                    if (directory.getId() == parentId) {
                        parentId = directory.getParentId();
                        if (parentId != 0) {
                            parents.add(parentId);
                            break OUT;
                        }
                        break;
                    }
                }
            }

            //2.拿到用户所有的分享
            List<Share> shares = shareDao.selectSharesByUserId(notesUser.getId());
            //3.遍历用户分享
            SHAREOUT:
            for (Share share : shares) {
                if (share.getType() == CommonConstant.FLAG_NOTE) {
                    //验证笔记被分享否
                    if (note.getId() == share.getNoteOrDirId()) {
                        shareFlag = true;
                        break;
                    }
                } else {
                    for (Integer dirId : parents) {
                        //验证得笔记所在的某个目录已被分享
                        if (Objects.equals(dirId, share.getNoteOrDirId())) {
                            shareFlag = true;
                            break SHAREOUT;
                        }
                    }
                }
            }

            //已被分享 或者没有被分享
            return shareFlag ? note : null;
        }


    }


}
