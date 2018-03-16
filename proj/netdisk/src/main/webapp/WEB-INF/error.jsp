<%--
  Created by IntelliJ IDEA.
  User: 24886
  Date: 2017/11/5
  Time: 12:21
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<base href="<%=basePath%>">
<html>
<head>
    <meta charset="UTF-8">
    <title>迷路啦</title>
</head>
<body>
<%--<div style="width: 80%;display: block;margin-left: auto;margin-right: auto;background-color: #00ee00">--%>
    <img src="../img/true.png" alt="404" style="height: 90%;width: auto;display: block;margin-right: auto;margin-left: auto">
<a href="/login.jsp" style="display: block;margin-right: auto;margin-left: auto">返回登录</a>
<%--</div>--%>
</body>
</html>
