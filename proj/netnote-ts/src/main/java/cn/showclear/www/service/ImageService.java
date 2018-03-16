package cn.showclear.www.service;

import cn.showclear.www.pojo.common.ReturnFile;

import java.io.FileNotFoundException;
import java.io.IOException;

public interface ImageService {

    /**
     * 根据上传的img的url获得图片本身
     * @param url
     * @return
     */
    public ReturnFile getImage(String url) throws FileNotFoundException;

    /**
     * 根据上传的img获取图片的url
     * @param file
     * @return
     */
    public String returnUrlByImg(ReturnFile file) throws IOException;
}
