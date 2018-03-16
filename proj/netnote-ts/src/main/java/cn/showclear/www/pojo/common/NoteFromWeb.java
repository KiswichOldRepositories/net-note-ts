package cn.showclear.www.pojo.common;

import cn.showclear.www.pojo.base.Note;
import cn.showclear.www.pojo.base.Tag;

import java.util.List;

/**
 * 封装从前端post上来的note数据
 */
public class NoteFromWeb {
    private Note note;
    private List<Tag> tagList;


    public NoteFromWeb() {

    }

    public Note getNote() {
        return note;
    }

    public void setNote(Note note) {
        this.note = note;
    }

    public List<Tag> getTagList() {
        return tagList;
    }

    public void setTagList(List<Tag> tagList) {
        this.tagList = tagList;
    }
}
