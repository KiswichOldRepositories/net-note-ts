package cn.showclear.www.pojo.base;

import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Results;

/**
 * 附件实体类
 */
public class Attach {
    private int id;
    private String fileName;
    private int size;
    private Integer noteId;
    private Integer userId;
    private Integer netDiskId;

    public Attach() {
    }

    public Attach(String fileName, int size, Integer noteId, Integer userId, Integer netDiskId) {
        this.fileName = fileName;
        this.size = size;
        this.noteId = noteId;
        this.userId = userId;
        this.netDiskId = netDiskId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getNoteId() {
        return noteId;
    }

    public void setNoteId(Integer noteId) {
        this.noteId = noteId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getNetDiskId() {
        return netDiskId;
    }


    public void setNetDiskId(Integer netDiskId) {
        this.netDiskId = netDiskId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    @Override
    public String toString() {
        return "Attach{" +
                "id=" + id +
                ", noteId=" + noteId +
                ", userId=" + userId +
                ", netDiskId=" + netDiskId +
                '}';
    }
}
