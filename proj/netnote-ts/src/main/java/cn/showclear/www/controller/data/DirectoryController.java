package cn.showclear.www.controller.data;

import cn.com.scooper.common.resp.APIObjectJson;
import cn.com.scooper.common.resp.ResultCode;
import cn.com.scooper.common.resp.ZTreeNode;
import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.dao.base.DirectoryDao;
import cn.showclear.www.dao.base.NoteDao;
import cn.showclear.www.dao.base.UserDao;
import cn.showclear.www.pojo.base.Directory;
import cn.showclear.www.pojo.base.Note;
import cn.showclear.www.pojo.base.User;
import cn.showclear.www.service.DirectoryService;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.ContextLoaderListener;
import sun.net.www.http.HttpClient;

import javax.naming.Context;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Controller
public class DirectoryController {
    public DirectoryController() {
    }

    @Autowired
    @Qualifier("easyuiDirService")
    private DirectoryService directoryService;

    @Autowired
    @Qualifier("zTreeDirService")
    private DirectoryService zTreeDirService;

    //返回目录结构(easyui-tree)
    @ResponseBody
    @RequestMapping(value = "/v1/dir", method = RequestMethod.GET)
    public List getDirectoryByUsername(HttpSession session) {
        //默认经过了拦截器 拦截了session中username为空的情况
        String username = (String) session.getAttribute("username");
        try {
            return directoryService.showDirectories(username);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //获取目录结构（ztree）
    @ResponseBody
    @RequestMapping(value = "/v1/dir/ztree", method = RequestMethod.GET)
    public APIObjectJson getDirectoryByUsernameZtree(HttpSession session) {

        String username = (String) session.getAttribute("username");
        try {
            return new APIObjectJson(ResultCode.SUCC, zTreeDirService.showDirectories(username));
        } catch (Exception e) {
            return new APIObjectJson(ResultCode.FAIL, "用户异常");
        }
    }

    //添加目录到数据库
    @ResponseBody
    @RequestMapping(value = "/v1/dir/{pid}", method = RequestMethod.POST)
    public APIObjectJson addDirectory(HttpServletRequest request, @PathVariable int pid, String name) {
        if (StringUtils.isBlank(name)) return new APIObjectJson(ResultCode.FAIL, "文件夹名不能为空");

        String username = (String) request.getSession().getAttribute("username");
        Directory directory = null;
        try {
            directory = directoryService.addDirectory((pid - 1) / 2, name, username);
            if (directory != null) {
                return new APIObjectJson(ResultCode.SUCC, directory);
            } else return new APIObjectJson(ResultCode.FAIL, "非正常操作");
        } catch (Exception e) {
            return new APIObjectJson(ResultCode.FAIL, "非正常参数，请清理缓存后重试");
        }

    }

    //删除某个目录
    @ResponseBody
    @RequestMapping(value = "/v1/dir/{mid}", method = RequestMethod.DELETE)
    public APIObjectJson deleteDirectory(HttpServletRequest request, @PathVariable int mid) {
        try {
            String username = (String) request.getSession().getAttribute("username");
            directoryService.deleteDirectory((mid - 1) / 2, username);
            return new APIObjectJson(ResultCode.SUCC, "删除成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new APIObjectJson(ResultCode.FAIL, "删除失败");
        }

    }

    //修改目录
    @ResponseBody
    @RequestMapping(value = "/v1/dir/{mid}", method = RequestMethod.PUT)
    public APIObjectJson patchDirectory(HttpSession session, @PathVariable int mid, String name, Integer parentId) {
        Directory directory = new Directory();
        if (!StringUtils.isBlank(name)) directory.setDirName(name);
        directory.setId((mid - 1) / 2);
        if (parentId != null) directory.setParentId((parentId - 1) / 2);
        String username = (String) session.getAttribute("username");
        Directory directory1 = null;
        try {
            directory1 = directoryService.editDirectory(directory, username);
            if(directory1!=null) return new APIObjectJson(ResultCode.SUCC, directory1);
            else return new APIObjectJson(ResultCode.FAIL,"出错了，请清除缓存重试");
        } catch (Exception e) {
            e.printStackTrace();
            return new APIObjectJson(ResultCode.FAIL,"内部错误，请联系管理员协助解决");
        }


    }


    @RequestMapping(value = "/test", method = RequestMethod.GET)
    @Deprecated
    @Test
    public void getText() {
        System.out.println("测试通过");
        //这一句加载错配置文件了233333
//        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("config/ds/base/applicationContext-db.xml");
//
//        UserDao userDao = (UserDao) context.getBean("userDao");
//        User zqw111 = userDao.selectUserByUsername("zqw111");
//        System.out.println(zqw111.getPassword());

        //测试通过
        try {
            CloseableHttpClient client = HttpClients.createDefault();
            String url1 = "http://localhost/net-disk/user/login";
            HttpPost httpPost = new HttpPost(url1);
            List<NameValuePair> nvps = new ArrayList<>();
            nvps.add(new BasicNameValuePair("username", "zqw111"));
            nvps.add(new BasicNameValuePair("password", "63452434"));
            httpPost.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8));
            CloseableHttpResponse execute = client.execute(httpPost);

            String url2 = "http://localhost/net-disk/folder/showFolders";
            HttpGet httpGet = new HttpGet(url2);
            CloseableHttpResponse execute1 = client.execute(httpGet);
            String s = EntityUtils.toString(execute1.getEntity());
            System.out.println(s);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
