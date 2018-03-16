package cn.showclear.www.controller.data;

import cn.com.scooper.common.resp.APIObjectJson;
import cn.com.scooper.common.resp.ResultCode;
import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.pojo.base.User;
import cn.showclear.www.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.ContextLoaderListener;

import javax.servlet.http.HttpSession;

@Controller
public class UserController {

    @Autowired
    private UserService userService;

    //用户创建和登陆后 都要建立一个主目录
    @RequestMapping(value = "/v1/user/signup", method = RequestMethod.POST)
    @ResponseBody
    public APIObjectJson login(String username, String password, HttpSession session) {
        User user = new User(username, password);
        if (userService.loginByUser(user)) {
            session.setAttribute("username", username);
            return new APIObjectJson(ResultCode.SUCC, CommonConstant.OPTION_SUCCESS);
        } else return new APIObjectJson(ResultCode.FAIL, CommonConstant.OPTION_ERROR);
    }

    //用户注册
    @ResponseBody
    @RequestMapping(value = "/v1/user/signin", method = RequestMethod.POST)
    public APIObjectJson signIn(String username, String password, HttpSession session) {
        User user = new User(username, password);
        if (userService.signUp(user)) {
            session.setAttribute("username", username);
            return new APIObjectJson(ResultCode.SUCC, CommonConstant.OPTION_SUCCESS);
        } else return new APIObjectJson(ResultCode.FAIL, CommonConstant.OPTION_ERROR);
    }

    //检查是否在登录状态
    @ResponseBody
    @RequestMapping(value = "/v1/user/check", method = RequestMethod.GET)
    public APIObjectJson checkIsLogin(HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username != null) return new APIObjectJson(ResultCode.SUCC);
        else return new APIObjectJson(ResultCode.FAIL);
    }

    //用户登出
    @ResponseBody
    @RequestMapping(value = "/v1/user/signout", method = RequestMethod.POST)
    public APIObjectJson logout(HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (!StringUtils.isBlank(username)) {
            session.setAttribute("username", "");
            return new APIObjectJson(ResultCode.SUCC, username + "用户下线");
        } else {
            return new APIObjectJson(ResultCode.FAIL, "没有用户登录");
        }
    }

}
