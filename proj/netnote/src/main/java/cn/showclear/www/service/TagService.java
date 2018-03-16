package cn.showclear.www.service;

import cn.showclear.www.pojo.base.Note;
import cn.showclear.www.pojo.base.Tag;
import cn.showclear.www.pojo.common.EasyUiTreeEntiy;
import cn.showclear.www.pojo.common.TagFromWeb;

import java.util.List;

public interface TagService<E>{

    /**
     * 先会去找当前的TAG是否存在，然后在选择新建一个tag还是使用已有的tag
     * @param tagName 想要添加的tag名称
     * @param noteId 被添加的笔记ID
     * @param username 请求的用户名
     */
    Tag addTag(String tagName, int noteId, String username);

    /**
     * 添加一串标签
     * @param tags 一串标签
     * @param username 请求的用户
     */
    Note addTags(List<Tag> tags,int noteId,String username);

    /**
     *
     * @param tagId 被删除的tagid（不是直接删除，是删除tag-note中间表里的内容）
     * @param noteId tag所在的笔记id
     * @param username 请求者的用户名
     */
    void deleteTag(int tagId,int noteId,String username);

    /**
     *
     * @param noteId 标签所在的笔记Id
     * @param username 请求者的用户名
     * @return
     */
    List<TagFromWeb> showTag(int noteId,String username);


    /**
     * 根据多个标签来查找笔记(传入的标签仅仅具有标签名)
     * @param tagNames
     * @return
     */
    List<E> searchByTags(String tagNames, String username);
}
