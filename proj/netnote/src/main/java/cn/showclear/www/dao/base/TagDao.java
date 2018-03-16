package cn.showclear.www.dao.base;

import cn.showclear.www.pojo.base.Note;
import cn.showclear.www.pojo.base.Tag;
import cn.showclear.www.pojo.common.UsingSearchNotes;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagDao {
    Tag selectTagByName (String tagName);
    int insertTag(Tag tag);
    Tag selectTagById(int id);
    List<Tag> selectTagsByNote(Note note);
    void deleteTagByNote(Note note);
    //删除空白标签（指的是没有note引用的标签）
    void deleteBlankTag();
    //通过标签查询note
    List<Note> selectNoteByTags(UsingSearchNotes tagsAndUsername);
}
