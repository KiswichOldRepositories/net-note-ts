package cn.showclear.www.controller.data;

import cn.com.scooper.common.resp.APIObjectJson;
import cn.com.scooper.common.resp.ResultCode;
import cn.showclear.www.pojo.common.ReturnFile;
import cn.showclear.www.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.FileNotFoundException;
import java.io.InputStream;

/**
 * 图片上传的控制器
 * 负责根据上传的图片生成http链接并返回
 * 和 根据url返回图片数据
 */
@Controller
public class ImageController {
    @Autowired
    private ImageService imageService;
    //下载图片
    @ResponseBody
    @RequestMapping(value = "/v1/img/{imgUrl}",method = RequestMethod.GET)
    public void downloadImage(HttpServletResponse response, @PathVariable String imgUrl) throws FileNotFoundException {
        ReturnFile image = imageService.getImage(imgUrl);
        InputStream inputStream = image.getInputStream();
        ServletOutputStream outputStream=null;
        int len = 0;
        byte[] bytes = new byte[1024];

        try {
            outputStream= response.getOutputStream();
            while((len = inputStream.read(bytes))!=-1){
                outputStream.write(bytes,0,len);
                outputStream.flush();
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            try {
                if(inputStream!=null) inputStream.close();
            }catch (Exception ignored){}
            try {
                if(outputStream!=null)outputStream.close();
            }catch (Exception ignored){ }
        }
    }

    //上传图片
    @ResponseBody
    @RequestMapping(value = "/v1/img" ,method = RequestMethod.POST)
    public APIObjectJson uploadImage(MultipartHttpServletRequest request, String filename){
        MultipartFile file = request.getFile("img");
        try {
            ReturnFile returnFile = new ReturnFile(file.getInputStream(), filename);
            String url = ((ImageService)ContextLoaderListener.getCurrentWebApplicationContext().getBean("imageServiceImpl")).returnUrlByImg(returnFile);
            return new APIObjectJson(ResultCode.SUCC,url);
        }catch (Exception e){
            e.printStackTrace();
            return new APIObjectJson(ResultCode.FAIL,"上传图片失败");
        }

    }


}
