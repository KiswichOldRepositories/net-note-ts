package cn.showclear.www.pojo.common;

import java.util.Date;

public class LoadFile {
    private int id;
    private String fileName;
    private String localURL;
    private int floderID;
    private Date createTime;
    private int fileSize;

    public LoadFile() {
    }

    public LoadFile(String fileName, String localURL, int floderID, Date createTime, int fileSize) {
        this.fileName = fileName;
        this.localURL = localURL;
        this.floderID = floderID;
        this.createTime = createTime;
        this.fileSize = fileSize;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getLocalURL() {
        return localURL;
    }

    public void setLocalURL(String localURL) {
        this.localURL = localURL;
    }

    public int getFloderID() {
        return floderID;
    }

    public void setFloderID(int floderID) {
        this.floderID = floderID;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public int getFileSize() {
        return fileSize;
    }

    public void setFileSize(int fileSize) {
        this.fileSize = fileSize;
    }

    @Override
    public String toString() {
        return new StringBuilder("[ id = ").append(id)
                .append(" ; fileName = ").append(fileName)
                .append(" ; localURL = ").append(localURL)
                .append(" ; floderID = ").append(floderID)
                .append(" ; createTime = ").append(createTime)
                .append(" ; fileSize = ").append(fileSize)
                .append(" ]").toString();
    }
}
