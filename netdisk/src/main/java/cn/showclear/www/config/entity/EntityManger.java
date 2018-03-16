package cn.showclear.www.config.entity;

import cn.showclear.www.service.FileService;
import cn.showclear.www.service.FolderService;
import cn.showclear.www.service.ShareService;
import cn.showclear.www.service.UserService;
import org.apache.ibatis.session.SqlSessionFactory;

public class EntityManger {
    //service实例和sqlsessionfactory
    public  SqlSessionFactory sqlSessionFactory ;

    public FileService fileService;
    public FileService shipFileService;
    public FolderService folderService;
    public ShareService shareService;
    public UserService userService;
}
