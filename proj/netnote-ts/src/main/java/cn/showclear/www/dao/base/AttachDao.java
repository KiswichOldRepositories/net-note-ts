package cn.showclear.www.dao.base;

import cn.showclear.www.pojo.base.Attach;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachDao {
    List<Attach> selectAttachsByNoteId(int noteId);
    void deleteAttachById(int id);
    Attach selectAttachById(int id);
    int insertAttach(Attach attach);
}
