package cn.showclear.www.controller.data;

import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.config.entity.Entity;
import cn.showclear.www.pojo.common.LocalFile;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;

@Controller
public class CommentShareController {
    private final static Logger logger = Logger.getLogger(CommentShareController.class);

    @RequestMapping("comShare/showFolders/*")
    public void showFolders( HttpServletRequest request, HttpServletResponse response) {
        try {
            String requestURI = request.getRequestURI();
            String[] strings = requestURI.split("/");
            String shareFlag = strings[4];
            String json = Entity.entityManger.shareService.showShareByFlag(shareFlag);
            response.setContentType("application/json;charset=UTF-8");
            //System.out.println("公共的JSON : " + json);
            logger.info("公共的JSON : " + json);
            response.getWriter().print(json);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @RequestMapping("/comShare/getShows")
    public void getShows(HttpServletRequest request, HttpServletResponse response)  {
        try {
            String shareIDString = request.getParameter("shareID");
            LocalFile localFile = null;
            if (shareIDString != null) {
                int shareID = Integer.parseInt(shareIDString);
                if (shareID % 2 == CommonConstant.FILE_FLAG) {
                    localFile = Entity.entityManger.shareService.getShare(shareID / 2, CommonConstant.FILE_FLAG);
                } else {
                    localFile = Entity.entityManger.shareService.getShare((shareID - 1) / 2, CommonConstant.FOLDER_FLAG);
                }
            }

            ServletOutputStream outputStream = null;
            InputStream fileInputStream = null;
            try {
                if (localFile != null) {//业务逻辑层没有出错
                    //System.out.println("输出的文件名为" + localFile.getFileName());

                    logger.info("输出的文件名为" + localFile.getFileName());

                    response.setContentType("application/octet-stream;charset=UTF-8");
                    response.setCharacterEncoding("utf-8");
                    response.setHeader("Content-Disposition", "attachment;fileName=" +
                            //解决文件名的乱码问题
                            new String(localFile.getFileName().getBytes(), "ISO8859-1"));

                    //文件传输
                    outputStream = response.getOutputStream();
                    fileInputStream = localFile.getFileInputStream();
                    byte[] bytes = new byte[1024];
                    int len = 0;
                    while ((len = fileInputStream.read(bytes)) != -1) {
                        outputStream.write(bytes, 0, len);
                    }

                } else {//业务逻辑层出错
                    response.sendRedirect("/error");
                }
            } finally {
                //关闭流
                if (outputStream != null) outputStream.close();
                if (fileInputStream != null) fileInputStream.close();
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
