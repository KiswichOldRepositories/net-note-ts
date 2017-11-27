<%--
  Created by IntelliJ IDEA.
  User: admin11
  Date: 2017/11/22
  Time: 15:49
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<base href="<%=basePath%>">
<html>
<head>
    <title>Note Share</title>
    <script src="../net-note/plugin/jquery/jquery.min.js" type="text/javascript"></script>
    <script src="../net-note/plugin/bootstrap/bootstrap.min.js" type="text/javascript"></script>
    <script src="../net-note/plugin/nicEditor/nicEdit1.js" type="text/javascript"></script>
    <script src="../net-note/plugin/nicEditor/testeditor.js" type="text/javascript"></script>
    <link rel="stylesheet" href="../net-note/plugin/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="../net-note/plugin/bootstrap/bootstrap-theme.min.css">
    <link rel="stylesheet" href="../net-note/plugin/easyui/themes/icon.css">
    <link rel="stylesheet" href="../net-note/plugin/easyui/themes/bootstrap/easyui.css">
    <script src="../net-note/plugin/easyui/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="../net-note/plugin/webuploader/webuploader.min.js" type="text/javascript"></script>
    <link rel="stylesheet" href="../net-note/plugin/webuploader/webuploader.css">

    <script src="../net-note/js/func.js" type="text/javascript"></script>
    <script src="../net-note/js/page.js" type="text/javascript"></script>
    <script src="../net-note/js/share.js" type="text/javascript"></script>
    <link rel="stylesheet" href="../net-note/css/net-note.css">
</head>
<body>
<div class="head">
    <a href="javascript:void(0)"><img src="../net-note/images/logo2.png" alt="logo" id="logo" class="logo"></a>
    <span class="nav-control">
        <ul class="nav">
            <li class="nav-tab-def"><a href="javascript:void(0)" id="about-us">关于</a></li>
            <li class="nav-tab-def"><a href="javascript:void(0)" id="2-net-disk">网盘中心</a></li>
            <li class="nav-tab-def"><a href="javascript:void(0)" id="signin">注册</a></li>
            <li class="nav-tab-def"><a href="javascript:void(0)" id="signup">登录</a></li>
        </ul>
        <input id="shareUrl" value="${shareUrl}" type="hidden"/>
        <!--这里想做一个响应式的下拉菜单（手机上用来代替导航栏）-->
        <!--<div class="dropdown" >-->
        <!--<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown"-->
        <!--aria-haspopup="true" aria-expanded="true">-->
        <!--选择频道-->
        <!--<span class="caret"></span>-->
        <!--</button>-->

        <!--<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">-->
        <!--<li>1</li>-->
        <!--<li>2</li>-->
        <!--<li>3</li>-->
        <!--<li>4</li>-->
        <!--</ul>-->
        <!--</div>-->
    </span>
</div>
<div class="content">
    <div class="container-fluid">
        <div class="row" id="content">

        </div>
    </div>
</div>

<div class="foot centor">
    <a href="" style="margin-left: 20%">关于我们</a>
    <span class="graytext">|</span>
    <a href="">服务条款</a>
    <span class="graytext">|</span>
    <a href="">使用规范</a>
    <span class="graytext">|</span>
    <a href="">客服中心</a>
</div>


</body>
</html>
