package cn.showclear.www.pojo.base;

import java.util.Date;

public class Note {
    private int id;
    private String noteName;
    private String noteText;
    private Date createtime;
    private Integer parentDirId;
    private Integer userId;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public Integer getParentDirId() {
        return parentDirId;
    }

    public void setParentDirId(Integer parentDirId) {
        this.parentDirId = parentDirId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

//    @Override
//    public String toString() {
//        return "Note{" +
//                "id=" + id +
//                ", noteName='" + noteName + '\'' +
//                ", noteText='" + noteText + '\'' +
//                ", createtime=" + createtime +
//                ", parentDirId=" + parentDirId +
//                ", userId=" + userId +
//                '}';
//    }
}
