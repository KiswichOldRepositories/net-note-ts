package cn.showclear.www.config.entity;

import java.util.Date;

/**
 * 全局实例管理 方便管理
 */
public class Entity {
    //实例
    public static EntityManger entityManger ;
    //文件保存本地路径 若为linux路径 参考 /home/KK  （末尾没有斜杠）
    public static String localPath = "E:\\testDisk1";
    //上传临时文件碎片储存路径
    public static String tempShipPath = "E:\\test";
    //文件夹创建时间（一个月新建一次文件夹）
    @Deprecated
    public static Date folderDate;

    //时间管理类
    public static TimeManager timeManager;
}
