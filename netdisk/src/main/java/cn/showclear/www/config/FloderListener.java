package cn.showclear.www.config;




import cn.showclear.www.config.entity.Entity;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.File;

/**
 * 启动时，若没有主目录，则创建
 */
public class FloderListener implements ServletContextListener {
    public void contextInitialized(ServletContextEvent sce) {
        File file = new File(Entity.localPath);
        if(!file.exists() && !file.isDirectory()){
            file.mkdirs();
        }
        file = new File(Entity.tempShipPath);
        if(!file.exists() && !file.isDirectory()){
            file.mkdirs();
        }
    }

    public void contextDestroyed(ServletContextEvent sce) {

    }
}
