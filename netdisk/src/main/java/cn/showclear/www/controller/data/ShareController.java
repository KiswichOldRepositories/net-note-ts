package cn.showclear.www.controller.data;

import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.config.entity.Entity;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
public class ShareController {
    private final static Logger logger = Logger.getLogger(ShareController.class);

    //加入分享 需要传入文件/文件夹ID
    @RequestMapping("/share/addShare")
    public void addShare(HttpServletRequest request, HttpServletResponse response) {
        try {
            String username = (String) request.getSession().getAttribute("username");
            String shareID = request.getParameter("shareID");
            if (shareID != null && shareID != "0") {//未选择文件的情况
                int fID = Integer.parseInt(shareID);
                if (fID % 2 == CommonConstant.FILE_FLAG) {//是单个文件
                    Entity.entityManger.shareService.addShare(username, fID / 2, CommonConstant.FILE_FLAG);
                } else {//是个文件夹
                    Entity.entityManger.shareService.addShare(username, (fID - 1) / 2, CommonConstant.FOLDER_FLAG);
                }
            }
            //先这么写着 防止页面端出现 无响应
            response.getWriter().print(1);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //删除分享
    @RequestMapping("/share/deleteShare")
    public void deleteShare(HttpServletRequest request, HttpServletResponse response) {
        try {
            String username = (String) request.getSession().getAttribute("username");
            String shareID = request.getParameter("shareID");
            if (Entity.entityManger.shareService.deleteShare(Integer.parseInt(shareID), username)) {
                //先这么写着 防止页面端出现 无响应
                response.getWriter().print(1);
            } else {
                response.sendRedirect("/error");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //获取当前用户分享的内容 展现到前台上
    @RequestMapping("/share/showShare")
    public void showShare(HttpServletRequest request, HttpServletResponse response) {
        try {
            String username = (String) request.getSession().getAttribute("username");
            //获取分享文件的URL
            String json = Entity.entityManger.shareService.showShare(username);

            if (json != null) {
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().print(json);
            } else {
                response.sendRedirect("/error");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //页面跳转
    @RequestMapping("/share/s/*")
    public void show2Page(HttpServletRequest request, HttpServletResponse response) {
        try {
            String[] split = request.getRequestURI().split("/");
            String shareFlag = split[4]; //URL标志


            String statement = Entity.entityManger.shareService.checkShare(shareFlag);
            if (statement.equals("success")) {
                request.setAttribute("shareFlag", shareFlag);
                request.getRequestDispatcher("/WEB-INF/share.jsp").forward(request, response);
            } else {
                request.getRequestDispatcher("/WEB-INF/shareError.jsp").forward(request, response);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
