import org.junit.Test;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

@Component
public class TestSth {
    /**
     * 测试失败
     */
    @Test
    public void testItroto(){
        String[] str = {"111","222","333","444","555"};
        List<String> strings = Arrays.asList(str);

        for(Iterator<String> iterator = strings.iterator();iterator.hasNext();){
            System.out.println(iterator.next());
        }
    }

    @Autowired private BeanFactory beanFactory;

    /**
     * 测试spring的默认bean
     */
    @Test
    public void testSpringBean(){
        System.setProperty("user.conf",System.getProperty("user.home")+ "\\scooper\\net-note");
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("/config/applicationContext.xml");
        System.out.println(beanFactory);
        System.out.println(applicationContext.getBean("environment"));
        System.out.println(applicationContext.getBean("messageSource"));
//        System.out.println(applicationContext.getBean("&factoryBean "));
//        System.out.println(applicationContext.getBean("applicationListener"));
    }
    /**
     * 测试在子类重写父类方法的前提下，父类方法调用此方法默认是调用谁的
     * 默认调用子类，而且调不出父类。。。
     *
     */
    @Test
    public void testExtend(){
        Parent parent = new Child();
        parent.saying();
    }
}


class Parent{
    public void saying(){
        word();
        this.word();
    }

    public void word(){
        System.out.println("I'm parent");
    }
}

class Child extends Parent{
    @Override
    public void word() {
        System.out.println("I'm child");
        super.word();
    }
}