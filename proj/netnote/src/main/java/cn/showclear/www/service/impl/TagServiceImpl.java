package cn.showclear.www.service.impl;

import cn.showclear.www.dao.base.*;
import cn.showclear.www.pojo.base.Note;
import cn.showclear.www.pojo.base.Tag;
import cn.showclear.www.pojo.base.User;
import cn.showclear.www.pojo.common.EasyUiTreeEntiy;
import cn.showclear.www.pojo.common.TagAndNote;
import cn.showclear.www.pojo.common.TagFromWeb;
import cn.showclear.www.pojo.common.UsingSearchNotes;
import cn.showclear.www.service.TagService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.ContextLoaderListener;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service("tagEasyui")
public class TagServiceImpl implements TagService<EasyUiTreeEntiy> {

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
     * 先会去找当前的TAG是否存在，然后在选择新建一个tag还是使用已有的tag
     *
     * @param tagName  想要添加的tag名称
     * @param noteId   被添加的笔记ID
     * @param username 请求的用户名
     */
    @Override
    public Tag addTag(String tagName, int noteId, String username) {
        //检查note的所有权
        Note note = noteDao.selectNoteById(noteId);
        User user = userDao.selectUserByUsername(username);
        if (note != null && user != null && note.getUserId() != user.getId()) return null;


        //处理tag表，是新建一个tag，还是使用原来的tag
        Tag tag = tagDao.selectTagByName(tagName);
        if (tag == null) {
            tag = new Tag(tagName);
            tagDao.insertTag(tag);
        }

        //在中间表中加入两表的映射关系
        noteDao.addTag2Note(new TagAndNote(note, tag));

        return tag;
    }

    /**
     * 添加一串标签
     *
     * @param tags     一串标签
     * @param username 请求的用户
     */
    @Override
    public Note addTags(List<Tag> tags, int noteId, String username) {
        //检查note的所有权
        Note note = noteDao.selectNoteById(noteId);
        User user = userDao.selectUserByUsername(username);
        if (note.getUserId() != user.getId()) return null;

        //这段不得行
        for (Tag newtag : tags) {
            //处理tag表，是新建一个tag，还是使用原来的tag
            Tag tag = tagDao.selectTagByName(newtag.getName());
            if (tag == null) {//新建一个表，并把映射关系加入到中间表
                tagDao.insertTag(newtag);
                noteDao.addTag2Note(new TagAndNote(note, newtag));
            } else {
                //在中间表中加入两表的映射关系
                noteDao.addTag2Note(new TagAndNote(note, tag));
            }

        }

        return note;
    }

    /**
     * @param tagId    被删除的tagid（不是直接删除，是删除tag-note中间表里的内容）
     * @param noteId   tag所在的笔记id
     * @param username 请求者的用户名
     */
    @Override
    public void deleteTag(int tagId, int noteId, String username) {
        try {
            //检查note的所有权
            Note note = noteDao.selectNoteById(noteId);
            User user = userDao.selectUserByUsername(username);
            if (note.getUserId() != user.getId()) return;

            //删除tag
            Tag tag = tagDao.selectTagById(tagId);
            noteDao.deleteTagFromNote(new TagAndNote(note, tag));
        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 展现tag
     *
     * @param noteId   标签所在的笔记Id
     * @param username 请求者的用户名
     * @return 前段所需要的json对应的类
     */
    @Override
    public List<TagFromWeb> showTag(int noteId, String username) {
        //检查note的所有权
        Note note = noteDao.selectNoteById(noteId);
        User user = userDao.selectUserByUsername(username);
        if (note.getUserId() != user.getId()) return null;

        List<Tag> tags = tagDao.selectTagsByNote(note);

        //将Tag转换成前端需要的格式
        List<TagFromWeb> tagFromWebs = new ArrayList<>();
        for (Tag tag : tags) {
            tagFromWebs.add(new TagFromWeb(tag.getId(), tag.getName()));
        }
        return tagFromWebs;
    }

    /**
     * 根据多个标签来查找笔记
     *
     * @param tagNames
     * @return
     */
    @Override
    public List<EasyUiTreeEntiy> searchByTags(String tagNames, String username) {

        String[] split = tagNames.split(";");

        List<String> tagNameList = new ArrayList<>();
        //检测空值
        for (String s : split) {
            if (!StringUtils.isBlank(s)) tagNameList.add(s);
        }
        if (tagNameList.isEmpty()) return null;
        List<Note> notes = tagDao.selectNoteByTags(new UsingSearchNotes(tagNameList, username));

        //这样查出来的note会有重复

        //封装到easyui所能识别的树里面
        ArrayList<EasyUiTreeEntiy> easyUiTreeEntiys = new ArrayList<>();
        for (Note note : notes) {
            EasyUiTreeEntiy easyUiTreeEntiy = new EasyUiTreeEntiy(note.getId() * 2, note.getNoteName());
            //多传入一个pid供前端使用
            HashMap<Object, Object> map = new HashMap<>();
            map.put("pid", note.getParentDirId());
            ArrayList<Object> attr = new ArrayList<>();
            attr.add(map);
            easyUiTreeEntiy.setAttributes(attr);

            easyUiTreeEntiys.add(easyUiTreeEntiy);
        }
        return easyUiTreeEntiys;
    }
}
