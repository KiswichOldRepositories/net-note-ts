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
    <title>CloudStroge-注册</title>
    <link rel="stylesheet" type="text/css" href="plugin/easyui/themes/bootstrap/easyui.css">
    <link rel="stylesheet" type="text/css" href="plugin/easyui/themes/icon.css">
    <link rel="stylesheet" href="css/local.css">
    <script type="text/javascript" src="plugin/jquery/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="plugin/easyui/jquery.easyui.min.js"></script>
    <script src="plugin/jquery-form/jquery.form.min.js" integrity="sha384-tIwI8+qJdZBtYYCKwRkjxBGQVZS3gGozr3CtI+5JF/oL1JmPEHzCEnIKbDbLTCer" crossorigin="anonymous"></script>

    <script type="text/javascript" src="js/CloudSTOR.js"></script>
    <script type="application/javascript" src="js/user.js?date=20171111929"></script>

</head>

<body id="cc" class="easyui-layout" style="width:300px;height:200px;">
<div data-options="region:'center',title:'注册'" style="padding:5px;background:#eee;">
    <form action="/user/addUser" method="post" id="signInForm" >
        <label for="username_sign">个人帐号：</label><input type="text" name="username" id="username_sign">
        <br>
        <label for="password_sign">个人密码：</label><input type="password" name="password" id="password_sign">
        <br>
        <label for="password_sign_config">确认密码：</label><input type="password"  id="password_sign_config">
        <div id="mess_sign"></div>
        <button id="signin" type="button">注册</button>
    </form>
    <a href="/net-disk/view/login.jsp">转去登录</a>
</div>
</body>
</html>