package cn.showclear.www.pojo.base;


public class Directory {

    private int id;
    private String dirName;
    private Integer parentId;
    private Integer userId;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDirName() {
        return dirName;
    }

    public void setDirName(String dirName) {
        this.dirName = dirName;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Directory() {
    }

    public Directory(String dirName, Integer parentId, Integer userId) {
        this.dirName = dirName;
        this.parentId = parentId;
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Directory{" +
                "id=" + id +
                ", dirName='" + dirName + '\'' +
                ", parentId=" + parentId +
                ", userId=" + userId +
                '}';
    }
}
