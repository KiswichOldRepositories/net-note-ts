package cn.showclear.www.pojo.base;

public class Image {
    private int id;
    private String url;
    private String localPath;
    private String imageName;

    public Image() {

    }

    public Image(String url, String localPath, String imageName) {
        this.url = url;
        this.localPath = localPath;
        this.imageName = imageName;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
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

    public String getLocalPath() {
        return localPath;
    }

    public void setLocalPath(String localPath) {
        this.localPath = localPath;
    }
}
