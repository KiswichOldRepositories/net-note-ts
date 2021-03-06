package cn.showclear.www.controller.data;

import cn.com.scooper.common.resp.APIObjectJson;
import cn.com.scooper.common.resp.ResultCode;
import cn.showclear.www.pojo.base.Note;

import cn.showclear.www.pojo.base.Tag;
import cn.showclear.www.pojo.common.TagFromWeb;

import cn.showclear.www.service.TagService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.ContextLoaderListener;

import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
public class TagController {
    @Autowired
    @Qualifier("tagEasyui")
    private TagService tagService;

    //展示某个笔记的标签
    @ResponseBody
    @RequestMapping(value = "/v1/tag/{noteId}", method = RequestMethod.GET)
    public APIObjectJson showTag(HttpSession session, @PathVariable int noteId) {
        String username = (String) session.getAttribute("username");
        try {
            List<TagFromWeb> tagFromWebs = tagService.showTag(noteId / 2, username);
            if(tagFromWebs!=null)return new APIObjectJson(ResultCode.SUCC, tagFromWebs);
            else return new APIObjectJson(ResultCode.FAIL,"笔记不存在或者该笔记不属于您");
        }catch (Exception e){
            e.printStackTrace();
            return new APIObjectJson(ResultCode.FAIL,"添加标签出错");
        }

    }

    //给某个笔记添加一个标签
    @ResponseBody
    @RequestMapping(value = "/v1/tag/{noteId}", method = RequestMethod.POST)
    public APIObjectJson addTag(@PathVariable int noteId, HttpSession session, String tagName) {
        String username = (String) session.getAttribute("username");
        if (StringUtils.isBlank(tagName) || StringUtils.isBlank(username)) {
            return new APIObjectJson((ResultCode.FAIL), "标签不能为空");
        } else {
            try {
                Tag tag = tagService.addTag(tagName, noteId / 2, username);
                if (tag != null) return new APIObjectJson(ResultCode.SUCC, new TagFromWeb(tag.getId(), tag.getName()));
                else return new APIObjectJson(ResultCode.FAIL, "笔记不存在或者非法用户");
            } catch (Exception e) {
                e.printStackTrace();
                return new APIObjectJson(ResultCode.FAIL,"添加标签出错");
            }

        }

    }

    //emmm..好像没有必要
    @ResponseBody
    @RequestMapping(value = "/v1/tag/{noteId}", method = RequestMethod.PATCH)
    public APIObjectJson editTag(@PathVariable int noteId, HttpSession session, @RequestBody List<TagFromWeb> tagFromWebs) {
        return new APIObjectJson(ResultCode.FAIL,"此API已废弃");
    }

    //删除一个标签
    @ResponseBody
    @RequestMapping(value = "/v1/tag/{tagId}", method = RequestMethod.DELETE)
    public APIObjectJson deleteTag(@PathVariable int tagId, int noteId, HttpSession session) {
        String username = (String) session.getAttribute("username");
        try {
            tagService.deleteTag(tagId, noteId / 2, username);
            return new APIObjectJson(ResultCode.SUCC);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIObjectJson(ResultCode.FAIL,"删除出错");
        }
    }
}
