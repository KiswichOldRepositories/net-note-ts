package cn.showclear.www.service;

import cn.showclear.www.pojo.base.Share;
import cn.showclear.www.pojo.common.EasyUiTreeEntiy;

import java.util.List;

public interface ShareService<T> {

    /**
     * 根据用户名返回当前用户分享的笔记集合（json）
     * @param username 请求者的用户名
     * @return 笔记集合的json字符串
     */
    List<T> showShareByUsername(String username) throws Exception;

    /**
     * 根据当前分享的url来返回该分享的笔记集合
     * @param url 分享的url记录
     * @return 笔记集合的json字符串
     */
    List<T> showShareByUrl(String url) throws Exception;

    /**
     * 删除当前分享id所对应的分享记录
     * @param shareId 要删除的分享对应的Id
     * @param username 请求者的用户名
     */
    void deleteShare(int shareId,String username) throws Exception;

    /**
     * 添加分享记录，包括了分享的目录或者笔记的id、分享的类型（目录或者笔记）
     * @param DirectoryOdNoteId 分享的目录或者笔记的id
     * @param shareType 分享的类型（目录或者笔记）
     * @param username 请求者的用户名
     */
    Share addShare(int DirectoryOdNoteId, int shareType, String username) throws Exception;
}
