package cn.showclear.www.controller.view;


import cn.showclear.www.config.entity.Entity;
import cn.showclear.www.pojo.common.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
public class UserController {

    @RequestMapping("/user/addUser")
    public void addUser(HttpServletRequest request, HttpServletResponse response) {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        try {
            if (Entity.entityManger.userService.addUser(new User(username, password))) {
                //注册成功 直接登录
                request.getSession().setAttribute("username", username);
                response.sendRedirect("/net-disk/view/check.jsp");
            } else {
                request.getSession().setAttribute("signMess", "注册信息有误（如用户名重复、非法字符等）");
                response.sendRedirect("/net-disk/view/signup.jsp");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/user/login")
    public void login(HttpServletRequest request, HttpServletResponse response) {
        try {
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            //登录成功
            if (Entity.entityManger.userService.loginInUser(new User(username, password))) {
                request.getSession().setAttribute("username", username);
                response.sendRedirect("/net-disk/view/check.jsp");
            } else {
                response.sendRedirect("/net-disk/error");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
