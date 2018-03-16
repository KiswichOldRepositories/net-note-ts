<%--
  Created by IntelliJ IDEA.
  User: 24886
  Date: 2017/10/28
  Time: 13:32
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
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="keywords" content="jquery,ui,easy,easyui,web">
    <meta name="description" content="easyui help you build your web page easily!">
    <title>CloudStroge-登录</title>
    <link rel="stylesheet" type="text/css" href="plugin/easyui/themes/bootstrap/easyui.css">
    <link rel="stylesheet" type="text/css" href="plugin/easyui/themes/icon.css">
    <link rel="stylesheet" href="css/local.css">
    <script type="text/javascript" src="plugin/jquery/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="plugin/easyui/jquery.easyui.min.js"></script>
    <script src="plugin/jquery-form/jquery.form.min.js" integrity="sha384-tIwI8+qJdZBtYYCKwRkjxBGQVZS3gGozr3CtI+5JF/oL1JmPEHzCEnIKbDbLTCer" crossorigin="anonymous"></script>

    <script type="text/javascript" src="js/CloudSTOR.js"></script>
    <script type="application/javascript" src="js/user.js?date=20171111929"></script>

</head>
<body>
<div id="cc" class="easyui-layout" style="width:300px;height:200px;">
    <div data-options="region:'center',title:'登录'" style="padding:5px;background:#eee; " class="center">

            <form action="/net-disk/user/login" method="post" id="loginForm">
                <label for="username">username:</label><input type="text" name="username" id="username">
                <br>
                <label for="password">password:</label><input type="password" name="password" id="password">
                <div id="mess"></div>
                <button id="login" type="button">登录</button>
            </form>
            <a href="/net-disk/view/signup.jsp">转去注册</a>

    </div>
</div>
</body>
</html>