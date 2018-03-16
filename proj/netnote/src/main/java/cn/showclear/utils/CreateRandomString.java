package cn.showclear.utils;


import org.junit.Test;

import java.util.Random;

/**
 * 返回所请求长度的随机字符串（大小写字母+数字）
 * 用于生成分享链接的标志
 */
public class CreateRandomString {
    private  static String base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static int size = base.length();

    //传入要声称的字符串的长度
    public static String create(int length) {
        Random random = new Random();
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
           stringBuilder.append(base.charAt(random.nextInt(size))) ;
        }
        return stringBuilder.toString();
    }

    @Test
    public void testString() {
        System.out.println(create(10));
    }

}
