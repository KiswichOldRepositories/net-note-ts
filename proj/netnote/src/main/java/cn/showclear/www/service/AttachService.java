package cn.showclear.www.service;

import cn.showclear.www.pojo.common.AttachFromWeb;
import cn.showclear.www.pojo.common.ReturnFile;

import java.io.InputStream;
import java.util.List;

public interface AttachService {

    /**
     * 展示某个笔记所拥有的附件
     * @param username 请求者的用户名
     * @return json格式的附件信息
     */
    List<AttachFromWeb> showAttach(int noteId, String username);

    /**
     * 下载某个附件（用户第一次下载或者上传时，会登陆到网盘，20分钟session过期）
     * 先辨认该附件是否被分享，被分享的话则无需校验用户名，没被分享的话需要校验用户名
     * @param attachId  需要下载的附件ID
     * @param username 请求者的用户名（可能为空）
     */
    ReturnFile downloadAttach(int attachId, String username);

    /**
     * 上传附件到某个笔记
     * @param returnFile 上传文件名与流
     * @param noteId 上传到的笔记ID
     * @param username 请求者的用户名
     */
    void uploadAttach(ReturnFile returnFile,int noteId,String username);

    /**
     * 删除某个附件
     * @param attachId   附件的id
     * @param username  请求者的用户名
     */
    void deleteAttachById(int attachId,String username);

}
