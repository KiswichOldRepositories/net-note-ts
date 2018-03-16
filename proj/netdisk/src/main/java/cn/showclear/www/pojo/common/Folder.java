package cn.showclear.www.pojo.common;

import java.util.Date;

/**
 * 虚拟文件目录 不存在于本地 只存在于数据库
 */
public class Folder {
    private int id;
    private String folderName;
    private Date createTime;
    private int parentFolderID;
    private int usernameID;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFolderName() {
        return folderName;
    }

    public void setFolderName(String folderName) {
        this.folderName = folderName;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public int getParentFolderID() {
        return parentFolderID;
    }

    public void setParentFolderID(int parentFolderID) {
        this.parentFolderID = parentFolderID;
    }

    public int getUsernameID() {
        return usernameID;
    }

    public void setUsernameID(int usernameID) {
        this.usernameID = usernameID;
    }

    @Override
    public String toString() {
        return new StringBuilder("[ id = ").append(id)
                .append(" ; folderName = ").append(folderName)
                .append(" ; createTime = ").append(createTime)
                .append(" ; parentFolderId = ").append(parentFolderID)
                .append(" ; userID = ").append(usernameID)
                .append(" ]").toString();
    }
}
