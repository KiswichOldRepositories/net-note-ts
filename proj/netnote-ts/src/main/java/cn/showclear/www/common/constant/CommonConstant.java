/**
 *
 * Project Name: net-note-common
 * File Name: CommonConstant.java
 * Package Name: cn.showclear.www.common.constant
 * Description: 
 * Copyright: Copyright (c) 2017
 * Company: 杭州叙简科技股份有限公司
 * @version 1.4.0 
 * @author ZHENGKAI
 * @date 2017年4月28日上午9:52:19
 */
package cn.showclear.www.common.constant;

import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import java.nio.file.Path;

/**
 * 项目中的常量定义
 * 
 * @Description 
 * @version 1.4.0
 * @author ZHENGKAI
 * @date 2017年4月28日上午9:52:19
 */
public interface CommonConstant {
    // 下面开始自定义常量定义
    int FLAG_NOTE = 0;
    int FLAG_DIR = 1;

    //用于easyui的树节点中的state属性
    String STATE_CLOSED = "closed";
    String STATE_OPEN = "open";

    //用于easyui的树节点的checked属性
    boolean CHECK_TRUE = true;
    boolean CHECK_FALSE = false;

    //用于easyui的节点的图标属性
    String FILE_ICO = "icon-myfile";
    String DIR_ICO = "icon-myfolder";

    //用于返回登录/注册的结果（成功or失败）
    String OPTION_SUCCESS="success";
    String OPTION_ERROR="error";

    //用于标记分享
    int SHARE = 1;
    int UNSHARE = 0;

    //网盘的地址= "http://localhost/net-disk";
    String netDiskUrl ="http://localhost:62202/net-disk/";

    //附件在网盘中所存储的文件夹名称
    String netDiskLocation = "net-note-attach";

    //临时储存的目录
    String netNoteTempLocal = System.getProperty("user.conf") + File.separator + "temp";
    String imageLocal = System.getProperty("user.conf") + File.separator + "img";

}
