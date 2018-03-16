package cn.showclear.www.service;

import cn.showclear.www.pojo.base.Directory;
import cn.showclear.www.pojo.common.EasyUiTreeEntiy;

import java.util.List;

public interface DirectoryService {

    /**
     * 根据传入的username，获取该用户的笔记目录结构
     * @param username 请求的用户名
     * @return json格式的目录结构(包括了笔记)
     */
    List showDirectories(String username);

    /**
     * 删除指定目录，包括其下的目录、笔记
     * @param directoryId 请求删除的目录id
     * @param username 请求者的用户名
     * @return
     */
    void deleteDirectory(int directoryId,String username);

    /**
     * 在制定的目录下，添加一个新目录
     * @param parentDirectoryId 制定的父目录ID
     * @param newDirectoryName 请求创建的目录名
     * @param username 请求者的用户名
     */
    Directory addDirectory(int parentDirectoryId,String newDirectoryName,String username);

    /**
     * 修改目录信息，一般是父目录或者名字
     * 根据传入的目录ID找到原来的目录，经过一定的信息校验后，修改原目录的名称或者位置
     * @param directory 修改的目录
     * @param username 请求者的用户名
     */
    Directory editDirectory(Directory directory,String username);



}
