package cn.showclear.www.controller.data;

import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.config.entity.Entity;
import cn.showclear.www.pojo.common.Folder;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
public class FolderController {
    private static Logger logger = Logger.getLogger(FolderController.class);

    @RequestMapping("/folder/addFolder")
    public void addFolder(HttpServletRequest request, HttpServletResponse response) {
        try {
            int parentFolderID = (Integer.parseInt(request.getParameter("parentFolderID")) - 1) / 2;//前端ID与后端ID的转换
            String folderName = request.getParameter("folderName");
            String username = (String) request.getSession().getAttribute("username");
            //System.out.println(parentFolderID);
            logger.info(parentFolderID);
            Folder parentFolder = new Folder();
            parentFolder.setId(parentFolderID);
            if (Entity.entityManger.folderService.createFolder(parentFolder, folderName, username)) {
                //先这么写着 防止页面端出现 无响应
                response.getWriter().print(1);
            } else {
                response.sendRedirect("/error");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/folder/showFolders")
    public void showFolders(HttpServletRequest request, HttpServletResponse response) {
        try {
            //此处已经保证了登录状态
            String username = (String) request.getSession().getAttribute("username");
            String json = Entity.entityManger.folderService.getFolderByUser(username);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().print(json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/folder/deleteFolderOrFile")
    public void deleteFolderOrFile(HttpServletRequest request, HttpServletResponse response) {
        try {
            String username = (String) request.getSession().getAttribute("username");
            String fIDString = request.getParameter("fID");
            if (fIDString != null) {//前端没有出错的话
                int fID = Integer.parseInt(fIDString);
                if (fID % 2 == CommonConstant.FILE_FLAG) {//删除的是文件
                    Entity.entityManger.fileService.deleteFile(username, fID / 2);

                } else {//删除的是文件夹
                    Entity.entityManger.folderService.deleteFolder(username, (fID - 1) / 2);
                }
                //先这么写着 防止页面端出现 无响应
                response.getWriter().print(1);
            } else {
                response.sendRedirect("/error");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/folder/editFolderOrFileName")
    //修改文件或者文件夹的名称// fID newName
    public void editFolderOrFileName(HttpServletRequest request, HttpServletResponse response) {
        try {
            String username = (String) request.getSession().getAttribute("username");
            String fIDString = request.getParameter("fID");
            String newName = request.getParameter("newName");
            if (fIDString != null) {//前端没有出错的话
                int fID = Integer.parseInt(fIDString);
                if (fID % 2 == CommonConstant.FILE_FLAG) {//修改的是文件
                    Entity.entityManger.fileService.editFile(username, fID / 2, newName);

                } else {//修改的是文件夹
                    Entity.entityManger.folderService.editFolder(username, (fID - 1) / 2, newName);
                }
                //先这么写着 防止页面端出现 无响应
                response.getWriter().print(1);
            } else {
                response.sendRedirect("/error");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
