package cn.showclear.www.controller.data;

import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.config.entity.Entity;
import cn.showclear.www.pojo.common.LocalFile;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;

@Controller
public class FileController {
    private static Logger logger = Logger.getLogger(FileController.class);

    /**
     * 针对大文件上传的断点续传，
     * web端先把大文件分片，然后发来传输通知
     * 服务器检测传输文件信息，并寻找有无未传输完成的碎片，通知web端从第几个碎片开始传输
     * web端开始传输，完毕后发送传输完毕的信号
     * 服务器将碎片合并成一个文件，放到指定目录
     *
     * @param request
     * @param response
     * @throws UnsupportedEncodingException
     */
    @RequestMapping("/file/uploadFileWithShip")
    public void uploadFileWithShip( HttpServletRequest request, HttpServletResponse response) {
        try {
            request.setCharacterEncoding("UTF-8");
            String username = (String) request.getSession().getAttribute("username");

            if (ServletFileUpload.isMultipartContent(request)) {//确认表单形式

                if (request.getParameter("method").equals("start")) {
                    //System.out.println("开始");
                    logger.info("传输通知");
                    int folderID = (Integer.parseInt(request.getParameter("folderID")) - 1) / 2;
                    String fileName = request.getParameter("fileName");
                    //检查文件夹信息是否为用户的 是的话进行创建文件上传目录或者
                    if (!Entity.entityManger.userService.isFolderBelong2User(username, folderID)) return;//不属于此用户的话
                    //检查当前有无碎片 有的话返回是第几个 没有的话创建目录 返回0
                    int shipCount = Entity.entityManger.shipFileService.checkTempFile(username, fileName);
                    //返回当前值(i)
                    response.getWriter().print(shipCount);
                } else if (request.getParameter("method").equals("send")) {//文件正在传输
                    //System.out.println("传输");
                    //文件的传输依赖于临时目录的创建，创建临时目录必须经过请求阶段，因此把身份校验放在请求阶段是可行的
                    //而且临时目录依赖于session中的username,因此也不存在被别人进入临时目录的情况
                    FileOutputStream fileOutputStream = null;
                    InputStream inputStream = null;
                    File localFile = null;

                    //Part file = request.getPart("file");
                    //这里要换成springMVC提供的上传文件的方法
                    MultipartHttpServletRequest multiRequest=(MultipartHttpServletRequest)request;
                    MultipartFile file = multiRequest.getFile("file");
                    inputStream = file.getInputStream();

                    String fileName = request.getParameter("fileName");
                    String currentShip = request.getParameter("CurrentShip");
                    if (!Entity.entityManger.shipFileService.uploadFileShip(inputStream, username, fileName, currentShip)) {
                        response.getWriter().print(-1);//返回错误信息
                    }
                } else if (request.getParameter("method").equals("end")) {//文件传输结束 (合并文件)
                    //这里再次发送父目录ID，校验的同时，也方便了文件数据的写入
                    //System.out.println("合并");
                    logger.info("传输结束 合并文件");
                    int folderID = (Integer.parseInt(request.getParameter("folderID")) - 1) / 2;
                    FileOutputStream fileOutputStream = null;
                    //校验父目录是否为该用户的
                    if (!Entity.entityManger.userService.isFolderBelong2User(username, folderID)) {
                        response.sendRedirect("/error");
                        return;
                    }
                    String fileName = request.getParameter("fileName");
                    int count = Integer.parseInt(request.getParameter("shipCount"));
                    if (!Entity.entityManger.shipFileService.combineFileShip(username, fileName, folderID, count)) {
                        response.sendRedirect("/error");
                        return;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 下载文件 前台需要有folderTreeID ，即要下载的 前端文件树上的ID
     *
     * @param request
     * @param response
     */
    @RequestMapping("/file/downloadFile")
    public void downloadFile(HttpServletRequest request, HttpServletResponse response) {
        InputStream fileInputStream = null;
        ServletOutputStream outputStream = null;

        try {
            String username = (String) request.getSession().getAttribute("username");
            //System.out.println(username);
            logger.info(username);
            String folderTreeIDString = request.getParameter("folderTreeID");
            LocalFile file = new LocalFile();
            int folderOrFileID = 0;

            if (folderTreeIDString != null) { //防止被恶意调用
                //System.out.println("此时的 folderTreeIDString = " + folderTreeIDString);
                logger.info("此时的 folderTreeIDString = " + folderTreeIDString);
                folderOrFileID = Integer.parseInt(folderTreeIDString);
                if (folderOrFileID % 2 == CommonConstant.FILE_FLAG) {
                    //偶数 代表文件，2 * 数据库的ID = 前端传入的ID；
                    int fileID = folderOrFileID / 2;
                    file = Entity.entityManger.fileService.downloadFile(username, fileID, CommonConstant.FILE_FLAG);

                } else {
                    //奇数 代表文件夹 ，2 * 数据库的ID +1 = 前端传入的ID
                    int folderID = (folderOrFileID - 1) / 2;
                    file = Entity.entityManger.fileService.downloadFile(username, folderID, CommonConstant.FOLDER_FLAG);
                }

            } else {
                response.sendRedirect("/error");
                return;//恶意调用 直接走了
            }

            if (file == null) {
                response.sendRedirect("/error");//业务逻辑层出现问题
                return;
            }

            //加入响应中的文件下载 以及下载文件名
            response.setContentType("application/octet-stream;charset=UTF-8");
            response.setCharacterEncoding("utf-8");
            //以下方法只解决了中文乱码的问题，文件名中的符号会变成%28等
//            response.setHeader("Content-Disposition", "attachment;fileName=" +
//                    URLEncoder.encode(file.getFileName(), "utf-8")); //解决文件乱码的问题 即编码加入百分号 如%E5%85%B3%E4%BA%8E%E8%B0%83%E6%95%B4.pdf

            //使用此编码解决乱码问题
            response.setHeader("Content-Disposition", "attachment;fileName=" +
                    new String(file.getFileName().getBytes(), "ISO8859-1"));
//            response.setHeader("Content-Disposition", "attachment;fileName=" +
//                 file.getFileName());
            //将文件输出到流浏览器
            outputStream = response.getOutputStream();
            fileInputStream = file.getFileInputStream();
            byte[] bytes = new byte[1024];
            int len = 0;
            while ((len = fileInputStream.read(bytes)) != -1) {
                outputStream.write(bytes, 0, len);
            }

            if (folderOrFileID % 2 == CommonConstant.FOLDER_FLAG) {//文件夹还需删除打包的文件
                File localFolderZip = new File(Entity.localPath + username + "/" + file.getFileName());
                if (localFolderZip.exists()) {
                    if (!localFolderZip.delete()) {
                        response.sendRedirect("/error");
                    }
                }
            }
            //response.getOutputStream().write(file.getFileBytes());
            // request.getRequestDispatcher("/view/check.jsp").forward(request,response);
        } catch (Exception e) {
            logger.error("servlet出错", e);
        } finally {
            //关闭流
            try {
                if (fileInputStream != null) fileInputStream.close();
                //if (outputStream != null) outputStream.close();
            } catch (IOException e) {
                logger.error("流关闭失败", e);
            }
        }
    }

}
