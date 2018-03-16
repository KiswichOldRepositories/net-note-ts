package cn.showclear.www.pojo.base;

public class Share {
    private int id;
    private String url;
    private Integer noteOrDirId;
    private int type;
    private int userId;

    public Share() {
    }

    public Share(String url, Integer noteOrDirId, int type, int userId) {
        this.url = url;
        this.noteOrDirId = noteOrDirId;
        this.type = type;
        this.userId = userId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getNoteOrDirId() {
        return noteOrDirId;
    }

    public void setNoteOrDirId(Integer noteOrDirId) {
        this.noteOrDirId = noteOrDirId;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Share{" +
                "id=" + id +
                ", url='" + url + '\'' +
                ", noteOrDirId=" + noteOrDirId +
                ", type=" + type +
                '}';
    }
}
