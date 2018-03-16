package cn.showclear.www.controller.data;

import cn.com.scooper.common.resp.APIObjectJson;
import cn.com.scooper.common.resp.ResultCode;
import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.pojo.base.Note;
import cn.showclear.www.pojo.common.EasyUiTreeEntiy;
import cn.showclear.www.pojo.common.NoteFromWeb;
import cn.showclear.www.service.NoteService;
import cn.showclear.www.service.TagService;
import org.apache.commons.lang3.StringUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.ContextLoaderListener;

import javax.servlet.http.HttpSession;
import javax.xml.transform.Result;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Controller
public class NoteController {
    @Autowired
    private NoteService noteService;
    @Autowired
    @Qualifier("tagEasyui")
    private TagService tagService;

    @Autowired
    @Qualifier("zTreeTag")
    private TagService zTreeTagService;

    //提交笔记
    @ResponseBody
    @RequestMapping(value = "/v1/note/{pid}", method = RequestMethod.POST)
    public APIObjectJson addNote(HttpSession session, String noteName, String noteText, @PathVariable int pid) {

        if (!StringUtils.isNoneBlank(noteName) || !StringUtils.isNoneBlank(noteText) || (pid == 0 || pid % 2 == CommonConstant.FLAG_NOTE))
            return new APIObjectJson(500, "存在错误的参数");
        Note note = new Note();
        note.setCreatetime(new Date());
        note.setParentDirId((pid - 1) / 2);
        note.setNoteName(noteName);

        note.setNoteText(noteText);

        String username = (String) session.getAttribute("username");

        note = noteService.addNote(note, username);
        return new APIObjectJson(ResultCode.SUCC, note);
    }

    //删除笔记
    @ResponseBody
    @RequestMapping(value = "/v1/note/{mid}", method = RequestMethod.DELETE)
    public APIObjectJson deleteNote(@PathVariable int mid, HttpSession session) {

        try {
            String username = (String) session.getAttribute("username");
            noteService.deleteNote(mid / 2, username);
            return new APIObjectJson(ResultCode.SUCC, "删除成功");

        } catch (Exception e) {
            e.printStackTrace();
            return new APIObjectJson(ResultCode.FAIL, "删除失败");
        }
    }

    //修改笔记（目录、内容、标题）
    //其中传入的三个参数可以任选
    @ResponseBody
    @RequestMapping(value = "/v1/note/{mid}", method = RequestMethod.PUT)
    public APIObjectJson editNote(@PathVariable int mid, HttpSession session, String noteName, String text, Integer parentId) {
        String username = (String) session.getAttribute("username");
        Note note = new Note();
        note.setId(mid / 2);
        if (parentId != null) note.setParentDirId((parentId - 1) / 2);
        if (StringUtils.isNoneBlank(text)) note.setNoteText(text);
        if (StringUtils.isNoneBlank(noteName)) note.setNoteName(noteName);

        note = noteService.editNote(note, username);
        return new APIObjectJson(ResultCode.SUCC, note);
    }

    //获取笔记
    @ResponseBody
    @RequestMapping(value = "/v1/note/{mid}", method = RequestMethod.GET)
    public APIObjectJson getNote(@PathVariable int mid, HttpSession session) {
        if (mid % 2 == CommonConstant.FLAG_NOTE) {
            String username = (String) session.getAttribute("username");
            Note note = noteService.getNote(mid / 2, username);
            if (note != null) return new APIObjectJson(ResultCode.SUCC, note);

        }
        return new APIObjectJson(ResultCode.FAIL, "出现错误");
    }

    //笔记搜索
    @ResponseBody
    @RequestMapping(value = "/v1/note", method = RequestMethod.GET)
    public List<EasyUiTreeEntiy> getNoteByTags(HttpSession session, String tags) {
        String username = (String) session.getAttribute("username");

        return tagService.searchByTags(tags, username);
    }

    @ResponseBody
    @RequestMapping(value = "/v1/note/ztree" ,method = RequestMethod.GET)
    public APIObjectJson getNoteWithZtreeByTags(HttpSession session,String tags){
        String username = (String) session.getAttribute("username");

        return new APIObjectJson(ResultCode.SUCC ,zTreeTagService.searchByTags(tags,username));
    }

    @Test
    public void testString() {
        String string = "sss;www;eee;rrr";
        String[] split = string.split(";");
        System.out.println(Arrays.toString(split));

    }

}
