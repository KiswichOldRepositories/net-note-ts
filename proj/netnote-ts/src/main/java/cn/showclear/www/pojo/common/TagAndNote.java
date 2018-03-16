package cn.showclear.www.pojo.common;

import cn.showclear.www.pojo.base.Note;
import cn.showclear.www.pojo.base.Tag;

import java.util.Date;

public class TagAndNote {
    private int tagId;
    private String tagName;

    private int noteId;
    private String noteName;
    private String noteText;
    private Date noteCreatetime;
    private Integer noteParentDirId;
    private Integer noteUserId;

    public TagAndNote() {
    }
    public TagAndNote(Note note, Tag tag) {
        this.tagId = tag.getId();
        this.tagName = tag.getName();
        this.noteId = note.getId();
        this.noteName = note.getNoteName();
        this.noteText = note.getNoteText();
        this.noteCreatetime = note.getCreatetime();
        this.noteParentDirId = note.getParentDirId();
        this.noteUserId = note.getUserId();
    }

    public int getTagId() {
        return tagId;
    }


    public void setTagId(int tagId) {
        this.tagId = tagId;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public int getNoteId() {
        return noteId;
    }

    public void setNoteId(int noteId) {
        this.noteId = noteId;
    }

    public String getNoteName() {
        return noteName;
    }

    public void setNoteName(String noteName) {
        this.noteName = noteName;
    }

    public String getNoteText() {
        return noteText;
    }

    public void setNoteText(String noteText) {
        this.noteText = noteText;
    }

    public Date getNoteCreatetime() {
        return noteCreatetime;
    }

    public void setNoteCreatetime(Date noteCreatetime) {
        this.noteCreatetime = noteCreatetime;
    }

    public Integer getNoteParentDirId() {
        return noteParentDirId;
    }

    public void setNoteParentDirId(Integer noteParentDirId) {
        this.noteParentDirId = noteParentDirId;
    }

    public Integer getNoteUserId() {
        return noteUserId;
    }

    public void setNoteUserId(Integer noteUserId) {
        this.noteUserId = noteUserId;
    }
}
