package cn.showclear.www.controller.data;

import cn.showclear.www.dao.base.AttachDao;
import cn.showclear.www.dao.base.TagDao;
import cn.showclear.www.pojo.base.Attach;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.ContextLoaderListener;

import java.util.List;

@Controller
public class testController {

    @RequestMapping(value = "/v1/test/test01")
    public void testMapper(){
        AttachDao attachDao = (AttachDao) ContextLoaderListener.getCurrentWebApplicationContext().getBean("attachDao");
        List<Attach> attaches = attachDao.selectAttachsByNoteId(1);
        int a = 1;

        TagDao tagDao = (TagDao) ContextLoaderListener.getCurrentWebApplicationContext().getBean("tagDao");
        tagDao.deleteBlankTag();

    }
}
