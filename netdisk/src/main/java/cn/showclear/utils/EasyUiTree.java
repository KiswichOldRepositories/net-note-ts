package cn.showclear.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * 符合easyui的树形结构json格式的实体类
 * 其中id分为奇偶数，奇数表示文件夹，偶数表示文件（数据库设计的缺陷） 对应的算法为 2*n+1 和 2*n
 * 数据返回时通过children是否为NULL来判断是文件夹还是文件
 * ##想法1：加入新的属性会不会影响easyUI的识别（文档查阅得，easyui的树准备了一个属性"attributes"给我们存放数据）
 */
public class EasyUiTree {
    public int id;
    public String text;
    public String state;
    public boolean checked;
    //图标
    public String iconCls;
    public List<EasyUiTree> children;

    public EasyUiTree() {
        checked = false;
        state = "close";
        children = new ArrayList<EasyUiTree>();
    }

    public EasyUiTree(int id, String text) {
        this.id = id;
        this.text = text;
        this.state = "close";
        checked = false;
        children = new ArrayList<EasyUiTree>();
    }
    public EasyUiTree(int id, String text,int statement) {
        this.id = id;
        this.text = text;
        if(statement == 1){
            this.state = "open";
        }else {
            this.state = "close";
        }

        checked = false;
        children = new ArrayList<EasyUiTree>();
    }
}
