package cn.showclear.www.service;

import cn.showclear.www.pojo.base.Note;

public interface
NoteService {
    /**
     * 添加一个笔记到数据库
     * @param note id属性会被无视
     * @param username
     */
    Note addNote(Note note,String username) throws Exception;

    /**
     * 删除一个笔记(包括笔记本身、笔记所带的附件、笔记的分享（一个分享里的全部内容被删除后，分享也应该取消）、中间表的标签)
     * @param DeletedNoteId  删除的笔记ID
     * @param username 请求者的用户名
     */
    void deleteNote(int DeletedNoteId,String username) throws Exception;

    /**
     * 修改一个笔记（包括笔记的内容、笔记名称、笔记位置），其中修改标签和修改上传附件就放在单独的service中完成
     * @param editNote null的项表示不用修改
     * @param username 请求者的用户名
     */
    Note editNote(Note editNote,String username) throws Exception;


    /**
     * 获取笔记内容
     * @param noteId 获取的笔记ID
     * @param username 请求着的用户名
     * @return
     */
    Note getNote(int noteId,String username) throws Exception;

}
