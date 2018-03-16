package cn.showclear.www.pojo.common;

import cn.showclear.www.common.constant.CommonConstant;

import java.util.ArrayList;
import java.util.List;

public class EasyUiTreeEntiy {
    //此id为笔记和目录的混合id，其中笔记为偶数，目录为单数
    private int id;
    private String text;
    private String iconCls;
    private boolean checked;
    private String state;
    private List<Object> attributes;
    private List<EasyUiTreeEntiy> children;

    public EasyUiTreeEntiy() {
        this.checked = CommonConstant.CHECK_FALSE;
        this.state = CommonConstant.STATE_OPEN;
        this.children = new ArrayList<>();
    }

    public EasyUiTreeEntiy(int id, String text) {
        this.id = id;
        this.text = text;
        this.checked = CommonConstant.CHECK_FALSE;
        this.state = CommonConstant.STATE_OPEN;
        this.children = new ArrayList<>();
    }

    public EasyUiTreeEntiy(int id, String text, String iconCls) {
        this.id = id;
        this.text = text;
        this.iconCls = iconCls;
        this.checked = CommonConstant.CHECK_FALSE;
        this.state = CommonConstant.STATE_OPEN;
        this.children = new ArrayList<>();
    }

    public EasyUiTreeEntiy(int id, String text, String state, boolean checked) {
        this.id = id;
        this.text = text;
        this.state = state;
        this.checked = checked;
        this.children = new ArrayList<>();
    }

    public String getIconCls() {
        return iconCls;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public boolean getChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    public List<Object> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<Object> attributes) {
        this.attributes = attributes;
    }

    public List<EasyUiTreeEntiy> getChildren() {
        return children;
    }

    public void setChildren(List<EasyUiTreeEntiy> children) {
        this.children = children;
    }
}
