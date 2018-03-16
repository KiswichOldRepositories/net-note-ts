package cn.showclear.www.service.impl;

import cn.showclear.www.common.constant.CommonConstant;
import cn.showclear.www.dao.base.*;
import cn.showclear.www.pojo.base.*;
import cn.showclear.www.pojo.common.AttachFromWeb;
import cn.showclear.www.pojo.common.EasyUiTreeEntiy;
import cn.showclear.www.pojo.common.ReturnFile;
import cn.showclear.www.service.AttachService;
import com.fasterxml.jackson.databind.ObjectMapper;
import freemarker.cache.StrongCacheStorage;
import org.apache.http.Consts;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.ContextLoaderListener;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class AttachServiceImpl implements AttachService {

    @Autowired
    private AttachDao attachDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private ShareDao shareDao;
    @Autowired
    private DirectoryDao directoryDao;
    @Autowired
    private NoteDao noteDao;

    /**
     * 展示某个笔记所拥有的附件
     *
     * @param noteId
     * @param username 请求者的用户名
     * @return json格式的附件信息
     */
    @Override
    public List<AttachFromWeb> showAttach(int noteId, String username) {
        List<Attach> attaches = attachDao.selectAttachsByNoteId(noteId);

        //包装成web前端所需要的格式
        ArrayList<AttachFromWeb> attachFromWebs = new ArrayList<>();
        for (Attach attach : attaches) {
            attachFromWebs.add(new AttachFromWeb(attach.getId(), attach.getSize(), attach.getFileName()));
        }

        return attachFromWebs;
    }

    /**
     * 下载某个附件
     * 先辨认该附件是否被分享，被分享的话则无需校验用户名，没被分享的话需要校验用户名
     *
     * @param attachId 需要下载的附件ID
     * @param username 请求者的用户名（可能为空）
     */
    @Override
    public ReturnFile downloadAttach(int attachId, String username) {

        int shareFlag = CommonConstant.UNSHARE; //标志位
        User user = userDao.selectUserByUsername(username);
        String password = null;

        //获取附件的所有者
        Attach attach = attachDao.selectAttachById(attachId);
        User attachUser = userDao.selectUserById(attach.getUserId());
        //遍历该用户的分享 查看是否有这个文件存在
        List<Share> shares = shareDao.selectSharesByUserId(attachUser.getId());
        for (Share share : shares) {
            if (share.getType() == CommonConstant.FLAG_NOTE) {//分享是个笔记
                if (share.getNoteOrDirId().equals(attach.getNoteId())) {//该附件所在的笔记已被分享
                    shareFlag = CommonConstant.SHARE;

                }
            } else {//分享是个目录
                ArrayList<Note> notes = new ArrayList<>();
                getNotesByDirId(share.getNoteOrDirId(), notes);

                for (Note note : notes) {
                    if (note.getId() == attach.getNoteId()) {
                        shareFlag = CommonConstant.SHARE;
                    }
                }
                //.......
            }
        }

        if (shareFlag == CommonConstant.UNSHARE) {//附件所在的note没有被分享，需要校验用户名
            if (user.getId() != attach.getUserId()) return null;
            password = user.getPassword();
        }else{
            //记录username password
            username = attachUser.getUsername();
            password = attachUser.getPassword();
        }


        //准备登录到网盘
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(CommonConstant.netDiskUrl + "user/login");
        List<NameValuePair> nvps = new ArrayList<>();
        nvps.add(new BasicNameValuePair("username", username));
        nvps.add(new BasicNameValuePair("password", password));
        try {
            //登录到网盘
            httpPost.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8));
            CloseableHttpResponse execute = client.execute(httpPost);
//
            nvps.clear();
            nvps.add(new BasicNameValuePair("folderTreeID", String.valueOf(attach.getNetDiskId() * 2)));
            HttpPost download = new HttpPost(CommonConstant.netDiskUrl + "file/downloadFile");
            download.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8));
            CloseableHttpResponse downloadFile = client.execute(download);

//            HttpGet httpGet = new HttpGet(CommonConstant.netDiskUrl + "file/downloadFile");
////            httpGet.addHeader("folderTreeID",String.valueOf(attach.getNetDiskId() * 2));


//            CloseableHttpResponse downloadFile = client.execute(httpGet);



            HttpEntity entity = downloadFile.getEntity();
            InputStream content = entity.getContent();

            //可能会断掉 理论上应该先下载到本地 然后删除 先试试
            return new ReturnFile(content, attach.getFileName());


        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 上传附件到某个笔记,打个标记，由于原来的网盘API设计的不好，导致这里的信息交互变的十分复杂，网盘需要重构
     *
     * @param returnFile 上传流和文件名
     * @param noteId     上传到的笔记ID
     * @param username   请求者的用户名
     */
    @Override
    public void uploadAttach(ReturnFile returnFile, int noteId, String username) {

        //检查笔记的所有权
        User user = userDao.selectUserByUsername(username);
        Note note = noteDao.selectNoteById(noteId);
        if (note.getUserId() != user.getId()) return;

        //上传到网盘
        //准备登录到网盘
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(CommonConstant.netDiskUrl + "user/login");
        List<NameValuePair> nvps = new ArrayList<>();
        nvps.add(new BasicNameValuePair("username", user.getUsername()));
        nvps.add(new BasicNameValuePair("password", user.getPassword()));

        File file = null;

        try {
            //登录到网盘
            httpPost.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8));
            CloseableHttpResponse execute = client.execute(httpPost);

            //1.先在主目录下找到net-note-attach这个文件夹
            HttpPost getFolderTree = new HttpPost(CommonConstant.netDiskUrl + "folder/showFolders");
            CloseableHttpResponse folderTreeResponse = client.execute(getFolderTree);
            String folderTreeJson = EntityUtils.toString(folderTreeResponse.getEntity());
            //将json串的头尾的[]去掉，因为在net-disk中，为满足前台需要而把单个tree对象加在了集合中
            folderTreeJson = new StringBuilder(folderTreeJson).deleteCharAt(folderTreeJson.length() - 1).deleteCharAt(0).toString();
            ObjectMapper objectMapper = new ObjectMapper();
            EasyUiTreeEntiy treeEntiy = objectMapper.readValue(folderTreeJson, EasyUiTreeEntiy.class);


            int folderId = 0;
            //查看文件夹是否存在
            for (EasyUiTreeEntiy tempTree : treeEntiy.getChildren()) {
                if (tempTree.getText().equals(CommonConstant.netDiskLocation)) {//这个文件已经存在
                    folderId = tempTree.getId();//这是前台页面上的ID
                }
            }

            if (folderId == 0) {//网盘中没有这个文件夹 则需要新建这个文件夹
                HttpPost newFolder = new HttpPost(CommonConstant.netDiskUrl + "folder/addFolder");
                StringBody parentFolderID = new StringBody(String.valueOf(treeEntiy.getId()), ContentType.create("text/plain", Consts.UTF_8));
                StringBody folderName = new StringBody(CommonConstant.netDiskLocation, ContentType.create("text/plain", Consts.UTF_8));

                HttpEntity httpEntity = MultipartEntityBuilder.create()
                        .addPart("parentFolderID", parentFolderID)
                        .addPart("folderName", folderName)
                        .build();

                newFolder.setEntity(httpEntity);
                client.execute(newFolder);

                //再次查询目录（主要想获得folderId，查询复杂的原因还是之前的api设计有问题）
                folderTreeResponse = client.execute(getFolderTree);
                folderTreeJson = EntityUtils.toString(folderTreeResponse.getEntity());
                //将json串的头尾的[]去掉，因为在net-disk中，为满足前台需要而把单个tree对象加在了集合中
                folderTreeJson = new StringBuilder(folderTreeJson).deleteCharAt(folderTreeJson.length() - 1).deleteCharAt(0).toString();
                treeEntiy = objectMapper.readValue(folderTreeJson, EasyUiTreeEntiy.class);

                for (EasyUiTreeEntiy tempTree : treeEntiy.getChildren()) {
                    if (tempTree.getText().equals(CommonConstant.netDiskLocation)) {//再次寻找
                        folderId = tempTree.getId();//这是前台页面上的ID
                    }
                }
            }
            //
//            File file = new File(CommonConstant.netNoteTempLocal,username + File.separator + returnFile.getFileName());
            String localPath = checkTempLocal(username);
            file = new File(localPath, returnFile.getFileName());
            if (!file.exists()) file.createNewFile();

            InputStream inputStream = returnFile.getInputStream();
            OutputStream outputStream = new FileOutputStream(file);
            int len = 0;
            byte[] bytes = new byte[1024];
            int size = 0;
            try {
                while ((len = inputStream.read(bytes)) != -1) {
                    outputStream.write(bytes, 0, len);
                    outputStream.flush();
                    size += len;
                }
            } finally {
                outputStream.close();
                inputStream.close();
            }

            //表单的准备
            FileBody fileBody = new FileBody(file);
            StringBody folderID = new StringBody(String.valueOf(folderId), ContentType.create("text/plain", Consts.UTF_8));
            StringBody start = new StringBody("start", ContentType.create("text/plain", Consts.UTF_8));

            StringBody send = new StringBody("send", ContentType.create("text/plain", Consts.UTF_8));
            //使用文件名+时间戳的方式，可以避免重名
            String diskFileName = returnFile.getFileName() + new Date().getTime();

            StringBody fileName = new StringBody(diskFileName, ContentType.create("text/plain", Consts.UTF_8));
            //这里的0表示当前是第0片
            StringBody CurrentShip = new StringBody(String.valueOf(0), ContentType.create("text/plain", Consts.UTF_8));

            StringBody end = new StringBody("end", ContentType.create("text/plain", Consts.UTF_8));
            //这里的1表示总共有1片
            StringBody shipCount = new StringBody(String.valueOf(1), ContentType.create("text/plain", Consts.UTF_8));

            HttpPost uploadFile = new HttpPost(CommonConstant.netDiskUrl + "file/uploadFileWithShip");

            HttpEntity startEntity = MultipartEntityBuilder.create()
                    .addPart("method", start)
                    .addPart("fileName", fileName)
                    .addPart("folderID", folderID)
                    .build();

            HttpEntity sendEntity = MultipartEntityBuilder.create()
                    .addPart("method", send)
                    .addPart("fileName", fileName)
                    .addPart("file", fileBody)
                    .addPart("CurrentShip", CurrentShip)
                    .build();

            HttpEntity endEntity = MultipartEntityBuilder.create()
                    .addPart("method", end)
                    .addPart("folderID", folderID)
                    .addPart("shipCount", shipCount)
                    .addPart("fileName", fileName)
                    .build();

            //发送上传,由于原来net-disk的简单上传api已经失效，只能模拟断点续传的步骤来完成

            uploadFile.setEntity(startEntity);
            client.execute(uploadFile);
            uploadFile.setEntity(sendEntity);
            client.execute(uploadFile);
            uploadFile.setEntity(endEntity);
            client.execute(uploadFile);


            //写入到数据库(还需处理文件同名的问题)//这里有问题，必须要前面上传成功了，才能写入数据库
            //标记

            //再次查询目录（主要想获得刚上传的FileId，查询复杂的原因还是之前的api设计有问题）
            int fileId = 0;
            folderTreeResponse = client.execute(getFolderTree);
            folderTreeJson = EntityUtils.toString(folderTreeResponse.getEntity());
            //将json串的头尾的[]去掉，因为在net-disk中，为满足前台需要而把单个tree对象加在了集合中
            folderTreeJson = new StringBuilder(folderTreeJson).deleteCharAt(folderTreeJson.length() - 1).deleteCharAt(0).toString();
            treeEntiy = objectMapper.readValue(folderTreeJson, EasyUiTreeEntiy.class);

            //找到之前上传的文件
            for (EasyUiTreeEntiy entiy : treeEntiy.getChildren()) {
                if (entiy.getText().equals(CommonConstant.netDiskLocation)) {//找到存储的文件夹
                    for (EasyUiTreeEntiy netNoteTree : entiy.getChildren()) {
                        if (netNoteTree.getText().equals(diskFileName)) {//找到刚刚上传的附件
                            fileId = netNoteTree.getId() / 2;
                        }
                    }
                }
            }
            //现在数据齐了...可以写到数据库里了 ,如果fileid为0，说明没有在目录找到这个文件，也就是说上传失败了

            if (fileId != 0) attachDao.insertAttach(new Attach(returnFile.getFileName(), size, noteId, user.getId(), fileId));


        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (file.exists()) file.delete();
        }
    }

    /**
     * 删除某个附件
     *
     * @param attachId 附件的id
     * @param username 请求者的用户名
     */
    @Override
    public void deleteAttachById(int attachId, String username) {

        //校验附件的所有者
        Attach attach = attachDao.selectAttachById(attachId);
        User user = userDao.selectUserByUsername(username);
        if (user.getId() != attach.getUserId()) return;

        //请求网盘删除该附件

        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(CommonConstant.netDiskUrl + "user/login");
        List<NameValuePair> nvps = new ArrayList<>();
        nvps.add(new BasicNameValuePair("username", user.getUsername()));
        nvps.add(new BasicNameValuePair("password", user.getPassword()));

        File file = null;

        try {
            //登录到网盘
            httpPost.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8));
            CloseableHttpResponse execute = client.execute(httpPost);

            HttpPost deleteFile = new HttpPost(CommonConstant.netDiskUrl + "folder/deleteFolderOrFile");
            StringBody fileID = new StringBody(String.valueOf(attach.getNetDiskId() * 2), ContentType.create("text/plain", Consts.UTF_8));

            HttpEntity endEntity = MultipartEntityBuilder.create()
                    .addPart("fID", fileID)
                    .build();
            nvps.clear();

//            nvps.add(new BasicNameValuePair("fID", String.valueOf(attach.getNetDiskId() * 2)));
            deleteFile.setEntity(endEntity);
            CloseableHttpResponse deleteExecute = client.execute(deleteFile);

            //删除该附件在数据库中的数据
            attachDao.deleteAttachById(attachId);


        } catch (Exception e) {
            e.printStackTrace();
        }


    }


    private void getNotesByDirId(int directoryId, List<Note> notes) {
        //加入目录下的每一个笔记
        List<Note> selectNotes = noteDao.selectNotesByParentId(directoryId);
        notes.addAll(selectNotes);

        //遍历每一个目录 加入笔记
        List<Directory> directories = directoryDao.selectDirectoriesByParentId(directoryId);
        for (Directory directory : directories) {
            getNotesByDirId(directory.getId(), notes);
        }
    }

    /**
     * 检查该用户的临时目录是否已经被创建，若没有被创建，则创建，返回临时目录的地址
     *
     * @param username
     * @return
     */
    private String checkTempLocal(String username) {
        String localPath = CommonConstant.netNoteTempLocal + File.separator + username;
        File file = new File(localPath);
        if (!file.exists()) file.mkdirs();
        return localPath;
    }
}
