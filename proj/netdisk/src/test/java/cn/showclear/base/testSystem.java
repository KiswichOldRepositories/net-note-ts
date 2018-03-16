package cn.showclear.base;

import cn.showclear.www.pojo.common.User;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.List;

public class testSystem {
    @Test
    public void testSystem1(){
        System.out.println(System.getProperty("user.home"));
    }

    @Test
    public void testFile(){
        String parentPath = System.getProperty("user.home") + File.separator + "ttxt";
        String chilePath = "ttt.txt";
        File file = new File(parentPath);
        File file1 = new File(parentPath,chilePath);

        try {
            if(!file.exists()) file.mkdirs();

            file1.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testFiled(){
        User user = new User("ss", "ww");
        user.setId(5);



    }


}


