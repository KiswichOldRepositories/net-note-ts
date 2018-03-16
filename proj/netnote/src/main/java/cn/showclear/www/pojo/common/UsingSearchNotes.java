package cn.showclear.www.pojo.common;

import java.util.List;

public class UsingSearchNotes {
    private List<String> tagNamesd;
    private String username;

    public UsingSearchNotes() {
    }

    public UsingSearchNotes(List<String> tagNamesd, String username) {
        this.tagNamesd = tagNamesd;
        this.username = username;
    }

    public List<String> getTagNamesd() {
        return tagNamesd;
    }

    public void setTagNamesd(List<String> tagNamesd) {
        this.tagNamesd = tagNamesd;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
