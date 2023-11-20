package com.xixi.chatgptapi.domain.security.service;


import com.xixi.chatgptapi.domain.security.model.vo.JwtToken;
import org.apache.shiro.web.filter.AccessControlFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 自定义Filter，用于拦截携带Token的请求
 */
public class JwtFilter extends AccessControlFilter {
    private Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    /**
     * isAccessAllowed 判断是否携带有效的 JwtToken 所以这里直接返回一个 false,让它走 onAccessDenied 方法流程
     */
    @Override
    protected boolean isAccessAllowed(ServletRequest servletRequest, ServletResponse servletResponse, Object o) throws Exception {
        return false;
    }

    /**
     * 返回结果为true表明登录通过
     */
    @Override
    protected boolean onAccessDenied(ServletRequest servletRequest, ServletResponse servletResponse) throws Exception {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        JwtToken jwtToken = new JwtToken(request.getParameter("token"));
        try {
            // 鉴权操作
            getSubject(servletRequest, servletResponse).login(jwtToken);
            return true;
        } catch (Exception e) {
            logger.error("鉴权认证失败", e);
            onLoginFail(servletResponse);
            return false;
        }
    }

    /**
     * 鉴权认证失败时默认返回 401 状态码
     */
    private void onLoginFail(ServletResponse response) throws IOException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        httpResponse.getWriter().write("Auth Err!");
    }
}
