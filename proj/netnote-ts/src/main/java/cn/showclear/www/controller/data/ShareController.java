package cn.showclear.www.controller.data;

import cn.com.scooper.common.resp.APIObjectJson;
import cn.com.scooper.common.resp.ResultCode;
import cn.com.scooper.common.resp.ZTreeNode;
import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.pojo.base.Share;
import cn.showclear.www.pojo.common.EasyUiTreeEntiy;
import cn.showclear.www.service.NoteService;
import cn.showclear.www.service.ShareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
public class ShareController {
    @Autowired
    @Qualifier("shareEasyui")
    private ShareService shareService;

    @Autowired
    @Qualifier("shareZtree")
    private ShareService ztreeShareService;

    @ResponseBody
    @RequestMapping(value = "/v1/share/{dirOrNoteId}", method = RequestMethod.POST)
    public APIObjectJson addShare(@PathVariable int dirOrNoteId, HttpSession session) {
        String username = (String) session.getAttribute("username");
        Share share;
        try {
            if (dirOrNoteId % 2 == CommonConstant.FLAG_DIR) {
                share = shareService.addShare((dirOrNoteId - 1) / 2, CommonConstant.FLAG_DIR, username);
            } else {
                share = shareService.addShare((dirOrNoteId) / 2, CommonConstant.FLAG_NOTE, username);
            }

            if (share != null) return new APIObjectJson(ResultCode.SUCC, share);
            else return new APIObjectJson(ResultCode.FAIL, "不存在的节点，请清除缓存后重试");
        } catch (Exception e) {
            e.printStackTrace();
            return new APIObjectJson(ResultCode.FAIL, "传入了非法参数");
        }


    }

    @ResponseBody
    @RequestMapping(value = "/v1/share/{shareId}", method = RequestMethod.DELETE)
    public APIObjectJson deleteShare(@PathVariable int shareId, HttpSession session) {
        try {
            String username = (String) session.getAttribute("username");
            shareService.deleteShare(shareId, username);
            return new APIObjectJson(ResultCode.SUCC);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIObjectJson(ResultCode.FAIL, "删除失败");
        }

    }

    @Deprecated
    @ResponseBody
    @RequestMapping(value = "/v1/share/{shareUrl}", method = RequestMethod.GET)
    public List<EasyUiTreeEntiy> showShareByUrl(@PathVariable String shareUrl) {
        try {
            return shareService.showShareByUrl(shareUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //返回一个适配ztree的结果集
    @ResponseBody
    @RequestMapping(value = "/v1/share/ztree/{shareUrl}", method = RequestMethod.GET)
    public APIObjectJson showShareByUrlZtree(@PathVariable String shareUrl) {
        try {
            return new APIObjectJson(ResultCode.SUCC, ztreeShareService.showShareByUrl(shareUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return new APIObjectJson(ResultCode.FAIL, "返回结果出错");
        }

    }

    //返回一个分享的页面
    @RequestMapping(value = "/v1/share/page/{shareUrl}", method = RequestMethod.GET)
    public ModelAndView getSharePage(@PathVariable String shareUrl) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("shareUrl", shareUrl);
        modelAndView.setViewName("/view/share.jsp");
        return modelAndView;
    }

    //easyui版的分享树
    @ResponseBody
    @RequestMapping(value = "/v1/share", method = RequestMethod.GET)
    public List<EasyUiTreeEntiy> showShareByUsername(HttpSession session) {
        String username = (String) session.getAttribute("username");
        try {
            return shareService.showShareByUsername(username);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //ztree版的分享树
    @ResponseBody
    @RequestMapping(value = "/v1/share/ztree", method = RequestMethod.GET)
    public APIObjectJson showShareByUsernameZtree(HttpSession session) {
        String username = (String) session.getAttribute("username");
        try {
            return new APIObjectJson(ResultCode.SUCC, ztreeShareService.showShareByUsername(username));
        } catch (Exception e) {
            e.printStackTrace();
            return new APIObjectJson(ResultCode.FAIL, "内部错误，请联系管理员");
        }
    }

}
