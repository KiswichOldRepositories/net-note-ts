package cn.showclear.www.config.entity;

import java.util.Calendar;
import java.util.Date;

//时间类 用于管理文件夹的创建(用来解决文件夹名称的线程安全问题)
public class TimeManager {

    public TimeManager(){
        calendar = Calendar.getInstance();
    }

    private Calendar calendar;

    public Calendar getCalendar() {
        return calendar;
    }

    //获取一个 年+月 的文件名
    public synchronized String getFolderName(){
        Calendar instance = Calendar.getInstance();
        int month = instance.get(Calendar.MONTH);
        int year = instance.get(Calendar.YEAR);

        //更新日历
        if(month!=calendar.get(Calendar.MONTH)){
            calendar = instance;
        }

        //输出文件名
        return String.valueOf(year) + month;
    }

    //获取文件名（即返回Date,(存入数据库还要复用)）
    public Date getFileName(){
        Calendar calendar1 = Calendar.getInstance();
        return calendar1.getTime();
    }
}
