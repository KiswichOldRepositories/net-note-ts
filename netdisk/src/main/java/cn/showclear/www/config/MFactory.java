package cn.showclear.www.config;


import cn.showclear.www.config.entity.Entity;
import cn.showclear.www.config.entity.EntityManger;
import cn.showclear.www.config.entity.TimeManager;
import cn.showclear.www.service.impl.*;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.apache.log4j.Logger;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.util.Date;

/**
 * 实体类的初始化
 */
public class MFactory implements ServletContextListener {

    private static Logger logger = Logger.getLogger(MFactory.class);


    //创建sqlSessionFactory
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        try {
            //创建service实体类 和sessionFactor
            Entity.entityManger = new EntityManger();
            Entity.entityManger.sqlSessionFactory = new SqlSessionFactoryBuilder().build(Resources.getResourceAsStream("mybatis/mybatisContext.xml"));
            Entity.entityManger.fileService = new FileServiceImpl();
            Entity.entityManger.shipFileService = new ShipFileSerivceImpl();//支持断点续传的

            Entity.entityManger.folderService = new FolderServiceImpl();
            Entity.entityManger.shareService = new ShareServiceImpl();
            Entity.entityManger.userService = new UserServiceImpl();
            Entity.folderDate = new Date();
            Entity.timeManager = new TimeManager();
            logger.info("/////////////////////////////////////////////初始化成功////////////////////////////////////////////////");
        } catch (Exception e) {
            logger.error("/////////////////////////////////////////////初始化失败////////////////////////////////////////////////",e);
        }
    }

    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        logger.info("/////////////////////////////////////////////实例关闭////////////////////////////////////////////////");
    }
}
