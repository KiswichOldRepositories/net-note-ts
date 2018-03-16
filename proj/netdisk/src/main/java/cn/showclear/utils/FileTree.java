package cn.showclear.utils;

import java.util.ArrayList;
import java.util.List;

@Deprecated
public class FileTree {
        public Object own;
        public  List others;
        public FileTree(Object own){
            this.own = own;
            this.others = new ArrayList();
        }
        public FileTree(){
            this.others = new ArrayList();
        }
}
