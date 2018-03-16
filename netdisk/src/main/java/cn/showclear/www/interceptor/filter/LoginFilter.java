package cn.showclear.www.interceptor.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

//登录过滤
@WebFilter(filterName = "LoginFilter",urlPatterns = {"/file/*","/folder/*}","/share/addShare","/share/deleteShare","/share/showShare","/view/*"})
public class LoginFilter implements Filter {
    public void destroy() {
    }

    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {

        HttpServletRequest request = (HttpServletRequest) req;
        if(request.getSession().getAttribute("username") !=null){
            chain.doFilter(req, resp);
        }else{
            req.getRequestDispatcher("/view/login.jsp").forward(req,resp);
        }
    }

    public void init(FilterConfig config) throws ServletException {

    }

}
