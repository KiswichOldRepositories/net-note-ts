package cn.showclear.www.controller.data;

import cn.com.scooper.common.resp.APIObjectJson;
import cn.com.scooper.common.resp.ResultCode;
import cn.showclear.www.pojo.base.Attach;
import cn.showclear.www.pojo.common.AttachFromWeb;
import cn.showclear.www.pojo.common.ReturnFile;
import cn.showclear.www.service.AttachService;
import cn.showclear.www.service.DirectoryService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.List;

@Controller
public class AttachController {
    @Autowired
    private AttachService attachService;

    //上传文件（上传到网盘）
    //附件上传解读：
//    理论上net-note的附件大小应该不会很大，可以直接上传
//    然后net-note 登录到net-disk
//    登录：({url}/)
// 1.username={username},password={password}
//
//    Net-disk的附件上传要求({url}/file/uploadFileWithShip)：
//            1.先发送method=start，fileName={filename},folderID={folderid}(这里是前端的id)
//    其中method表是执行的状态，fileName用来检测有无残包，folderID用来检测文件的所属权。
//            2.发送method=send， fileName={filename},CurrentShip={当前的包数},file={文件包}
//            3.循环2
//            4.发送 method=end,folderID={filderid},shipCount={包的总数}
//
//    很显然分成一个包就好了，然后直接传到net-disk就好
//    附件位置：因为网盘登录的时候也会自动创建文件夹，所以用户的主目录是存在的。
//    思路1.通过showfolder得到目录的json字符串，然后可以得到主目录

    //2.在主目录下找有无net-note-attach这个文件夹，如果没有，发送创建目录的api
//3.再次showfolder（当时设计有点问题），得到目录json，进行解析，得到net-note-attach的id，通过这个id来上传附件。
//
//    附件id：这个直接对应网盘的文件id
    @ResponseBody
    @RequestMapping(value = "/v1/attach/{parentNoteId}", method = RequestMethod.POST)
    public APIObjectJson upLoadAttach(@PathVariable int parentNoteId, MultipartHttpServletRequest request, HttpSession session) {
        //空值校验
        //if(StringUtils.isBlank(fileName)) return new APIObjectJson(ResultCode.FAIL,"输入了错误的参数");

        MultipartFile file = request.getFile("file");
        String fileName = file.getOriginalFilename();
        String username = (String) session.getAttribute("username");
        try {
            InputStream inputStream = file.getInputStream();
            attachService.uploadAttach(new ReturnFile(inputStream, fileName), parentNoteId / 2, username);
            return new APIObjectJson(ResultCode.SUCC);
        } catch (IOException e) {
            e.printStackTrace();
            return new APIObjectJson(ResultCode.FAIL);
        }
    }

    @ResponseBody
    @RequestMapping(value = "/v1/attach/{attachId}", method = RequestMethod.GET)
    public void downloadAttach(@PathVariable int attachId, HttpSession session, HttpServletResponse response) throws IOException {
        String username = (String) session.getAttribute("username");
        ReturnFile returnFile = attachService.downloadAttach(attachId, username);
        returnFile.getFileName();
        response.setHeader("Content-Disposition", "attachment;fileName=" +
                new String(returnFile.getFileName().getBytes(), "ISO8859-1"));
        OutputStream outputStream = response.getOutputStream();
        InputStream fileInputStream = returnFile.getInputStream();
        try {
            byte[] bytes = new byte[1024];
            int len = 0;
            while ((len = fileInputStream.read(bytes)) != -1) {
                outputStream.write(bytes, 0, len);
                outputStream.flush();
            }
        } finally {
            if (fileInputStream != null) fileInputStream.close();
        }


    }

    @ResponseBody
    @RequestMapping(value = "/v1/note/{noteId}/attach", method = RequestMethod.GET)
    public APIObjectJson showAttach(@PathVariable int noteId, HttpSession session) {
        String username = (String) session.getAttribute("username");
        List<AttachFromWeb> attachFromWebs = attachService.showAttach(noteId/2, username);
        return new APIObjectJson(ResultCode.SUCC,attachFromWebs);
    }

    @ResponseBody
    @RequestMapping(value = "/v1/attach/{attachId}", method = RequestMethod.DELETE)
    public APIObjectJson deleteAttach(@PathVariable int attachId, HttpSession session) {
        try {
            String username = (String) session.getAttribute("username");
            attachService.deleteAttachById(attachId, username);
            return new APIObjectJson(ResultCode.SUCC);
        }catch (Exception e){
            e.printStackTrace();
            return new APIObjectJson(ResultCode.FAIL);
        }
    }

}
