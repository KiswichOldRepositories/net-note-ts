package cn.showclear.www.pojo.common;

/**
 * 分享链接管理实例
 */
public class Share {
    private int id;
    private String shareFlag;
    private int shareFID;
    //0为文件 1为文件夹
    private int shareType;
    private int userID;

    public Share() {
    }

    public Share(String shareFlag, int shareFID, int shareType, int userID) {
        this.shareFlag = shareFlag;
        this.shareFID = shareFID;
        this.shareType = shareType;
        this.userID = userID;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getShareFlag() {
        return shareFlag;
    }

    public void setShareFlag(String shareFlag) {
        this.shareFlag = shareFlag;
    }

    public int getShareFID() {
        return shareFID;
    }

    public void setShareFID(int shareFID) {
        this.shareFID = shareFID;
    }

    public int getShareType() {
        return shareType;
    }

    public void setShareType(int shareType) {
        this.shareType = shareType;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    @Override
    public String toString() {
        return new StringBuilder("[ id = ").append(id)
                .append(" ; shareFlag = ").append(shareFlag)
                .append(" ; shareFID = ").append(shareFID)
                .append(" ; shareType = ").append(shareType)
                .append(" ; userID = ").append(userID)
                .append(" ]").toString();
    }
}
