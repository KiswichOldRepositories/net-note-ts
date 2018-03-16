package cn.showclear.www.pojo.common;

public class AttachFromWeb {
    private int id;
    private int size;
    private String filename;

    public AttachFromWeb(int id, int size, String filename) {
        this.id = id;
        this.size = size;
        this.filename = filename;
    }


    public AttachFromWeb() {
    }

    public int getId() {

        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }
}
