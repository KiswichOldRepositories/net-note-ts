package cn.showclear.service.impl;

import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.pojo.common.EasyUiTreeEntiy;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

public class Test01 implements  Test01inter {

    String name = "22222";
    @Override
    public void printfP() {
        System.out.println(name);
    }


    @Test
    public void testImp(){
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(CommonConstant.netDiskUrl + "user/login");
        List<NameValuePair> nvps = new ArrayList<>();
        nvps.add(new BasicNameValuePair("username","zqw111"));
        nvps.add(new BasicNameValuePair("password", "63452434"));
        try {
            //登录到网盘
            httpPost.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8));
            CloseableHttpResponse execute = client.execute(httpPost);

            //1.先在主目录下找到net-note-attach这个文件夹
            HttpPost getFolderTree = new HttpPost(CommonConstant.netDiskUrl + "folder/showFolders");
            CloseableHttpResponse folderTreeResponse = client.execute(getFolderTree);
            String folderTreeJson = EntityUtils.toString(folderTreeResponse.getEntity());
            folderTreeJson = new StringBuilder(folderTreeJson).deleteCharAt(folderTreeJson.length()-1).deleteCharAt(0).toString();
            ObjectMapper objectMapper = new ObjectMapper();
            EasyUiTreeEntiy list =  objectMapper.readValue(folderTreeJson,EasyUiTreeEntiy.class);
            int a = 1;

        }catch (Exception e){
            e.printStackTrace();
        }
        }
}
