package cn.showclear.www.pojo.common;

/**
 * 用来展示用户的笔记的标签使用,前端会接到这个类对应的json树
 */
public class TagFromWeb {
    private int id;
    private String tagName;

    public TagFromWeb() {
    }

    public TagFromWeb(int id, String tagName) {
        this.id = id;
        this.tagName = tagName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }
}
