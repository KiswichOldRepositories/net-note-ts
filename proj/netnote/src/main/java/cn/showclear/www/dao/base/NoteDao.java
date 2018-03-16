package cn.showclear.www.dao.base;

import cn.showclear.www.pojo.base.Note;
import cn.showclear.www.pojo.common.TagAndNote;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteDao {
    List<Note> selectNotesByUsername(String username);
    int insertNote(Note note);
    Note selectNoteById(int id);
    void updateNoteByTextAndNameAndDir(Note note);
    void addTag2Note(TagAndNote tagAndNote);
    void deleteTagFromNote(TagAndNote tagAndNote);
    void deleteNoteById(int id);
    List<Note> selectNotesByParentId(int parentId);
}
