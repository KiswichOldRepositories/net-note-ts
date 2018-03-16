package cn.showclear.www.service.impl;

import cn.showclear.utils.CreateRandomString;
import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.dao.base.ImageDao;
import cn.showclear.www.pojo.base.Image;
import cn.showclear.www.pojo.common.ReturnFile;
import cn.showclear.www.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.Date;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private TimeManager timeManager;
    @Autowired
    private ImageDao imageDao;

    /**
     * 根据上传的img的url获得图片本身
     *
     * @param url
     * @return
     */
    @Override
    public ReturnFile getImage(String url) {

        Image image = imageDao.selectImageByUrl(url);

        File file = new File(image.getLocalPath());

        //传入了错误的url
        if (image == null || image.getLocalPath() == null) {
            return null;
        }

        try {
            FileInputStream fileInputStream = new FileInputStream(file);
            return new ReturnFile(fileInputStream,image.getImageName());
        }catch (Exception e){

            e.printStackTrace();
            try {
                throw e;
            }catch (Exception e7){ }
            return null;
        }
    }

    /**
     * 根据上传的img获取图片的url
     *
     * @param returnFile
     * @return
     */
    @Override
    public String returnUrlByImg(ReturnFile returnFile) throws IOException {

        String url = null;

        //检查临时目录的情况
        File imgFolder = new File(CommonConstant.imageLocal, timeManager.getFolderName());
        if (!imgFolder.exists()) imgFolder.mkdirs();
        //储存文件
        Date createTime = timeManager.getFileName();
        File img = new File(imgFolder, String.valueOf(createTime.getTime()));
        InputStream inputStream = returnFile.getInputStream();

        //创建文件
        try {
            FileOutputStream outputStream = new FileOutputStream(img);
            if (!img.exists()) img.createNewFile();
            int len = 0;
            byte[] bytes = new byte[1024];

            while ((len = inputStream.read(bytes)) != -1) {
                outputStream.write(bytes, 0, len);
                outputStream.flush();
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        } finally {
            try {
                if (inputStream != null) inputStream.close();
            } catch (IOException ignored) {
            }
        }

        try {
            //写入到数据库

            Image image;
            //生成唯一的URL
            do {
                url = CreateRandomString.create(15);
                image = imageDao.selectImageByUrl(url);
            } while (image != null);

            image = new Image(url, img.getPath(),returnFile.getFileName());
            imageDao.inserImg(image);

        } catch (Exception e) {

            if (img.exists()) img.delete();
            throw e;
        }
        return url;
    }
}
