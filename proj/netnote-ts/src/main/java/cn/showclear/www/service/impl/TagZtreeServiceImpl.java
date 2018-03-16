package cn.showclear.www.service.impl;

import cn.com.scooper.common.resp.ZTreeNode;
import cn.showclear.www.dao.base.TagDao;
import cn.showclear.www.pojo.base.Note;
import cn.showclear.www.pojo.base.Tag;
import cn.showclear.www.pojo.common.EasyUiTreeEntiy;
import cn.showclear.www.pojo.common.TagFromWeb;
import cn.showclear.www.pojo.common.UsingSearchNotes;
import cn.showclear.www.service.TagService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service("zTreeTag")
public class TagZtreeServiceImpl implements TagService<ZTreeNode>{


    @Autowired
    @Qualifier("tagEasyui")
    private TagService tagService;

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
    public Tag addTag(String tagName, int noteId, String username) throws Exception {
        return tagService.addTag(tagName,noteId,username);
    }

    /**
     * 添加一串标签
     *
     * @param tags     一串标签
     * @param noteId
     * @param username 请求的用户
     */
    @Override
    public Note addTags(List<Tag> tags, int noteId, String username) throws Exception {
        return tagService.addTags(tags,noteId,username);
    }

    /**
     * @param tagId    被删除的tagid（不是直接删除，是删除tag-note中间表里的内容）
     * @param noteId   tag所在的笔记id
     * @param username 请求者的用户名
     */
    @Override
    public void deleteTag(int tagId, int noteId, String username) throws Exception {
        tagService.deleteTag(tagId,noteId,username);
    }

    /**
     * @param noteId   标签所在的笔记Id
     * @param username 请求者的用户名
     * @return
     */
    @Override
    public List<TagFromWeb> showTag(int noteId, String username) throws Exception {
        return tagService.showTag(noteId,username);
    }

    /**
     * 根据多个标签来查找笔记(传入的标签仅仅具有标签名)
     *
     * @param tagNames
     * @param username
     * @return
     */
    @Override
    public List<ZTreeNode> searchByTags(String tagNames, String username) throws Exception{

        try {
            String[] split = tagNames.split(";");

            List<String> tagNameList = new ArrayList<>();
            //检测空值
            for (String s : split) {
                if (!StringUtils.isBlank(s)) tagNameList.add(s);
            }
            if (tagNameList.isEmpty()) return null;
            List<Note> notes = tagDao.selectNoteByTags(new UsingSearchNotes(tagNameList, username));

            //这样查出来的note会有重复

            //封装到ztree所能识别的树里面
            ArrayList<ZTreeNode> zTreeNodes = new ArrayList<>();

            for (Note note : notes) {

                ZTreeNode zTreeNode = new ZTreeNode(note.getId() * 2, note.getParentDirId() * 2 + 1, note.getNoteName(), false);
                //多传入一个pid供前端使用
                zTreeNodes.add(zTreeNode);
            }
            return zTreeNodes;

        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }

    }
}
