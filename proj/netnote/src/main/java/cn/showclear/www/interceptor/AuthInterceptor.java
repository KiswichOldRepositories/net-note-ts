/**
 *
 * Project Name: net-note
 * File Name: AuthInterceptor.java
 * Package Name: cn.showclear.www.interceptor
 * Description: 
 * Copyright: Copyright (c) 2017
 * Company: 杭州叙简科技股份有限公司
 * @version 1.0.1 
 * @author zhengkai
 * @date 2017年1月8日下午7:46:21
 */
package cn.showclear.www.interceptor;

import java.util.Properties;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * 权限认证业务
 * @Reason: TODO ADD REASON(可选). <br/>
 * @date: 2017年1月8日下午7:46:21 <br/>
 *
 * @author ZHENGKAI
 * @version 1.4.0
 */
public class AuthInterceptor extends HandlerInterceptorAdapter {

	protected static final Logger LOGGER = LoggerFactory.getLogger(AuthInterceptor.class);
	
	/** 业务定义 */

    //配置文件业务
    @Resource(name = "configProperties")
    protected Properties configProperties;
    
	
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		//权限认证业务操作
		
		if(LOGGER.isDebugEnabled()) {
			LOGGER.debug("开始权限认证");
		}
		
		return true;
	}

}
