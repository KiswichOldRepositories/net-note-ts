<%--
  Created by IntelliJ IDEA.
  User: 24886
  Date: 2017/10/29
  Time: 11:55
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
    <title>test</title>
    <link rel="stylesheet" type="text/css" href="plugin/easyui/themes/bootstrap/easyui.css">
    <link rel="stylesheet" type="text/css" href="plugin/easyui/themes/icon.css">
    <link rel="stylesheet" href="css/local.css">
    <script type="text/javascript" src="plugin/jquery/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="plugin/easyui/jquery.easyui.min.js"></script>
    <script src="plugin/jquery-form/jquery.form.min.js" integrity="sha384-tIwI8+qJdZBtYYCKwRkjxBGQVZS3gGozr3CtI+5JF/oL1JmPEHzCEnIKbDbLTCer" crossorigin="anonymous"></script>
</head>
<body>
<form action="/test/testLoad" method="post" enctype="multipart/form-data">

    文件上传：<input type="file" name="uploadFile" id="1">
    <label for="2">文件夹ID：</label>
    <input type="text" name="folderID" id="2">
    <input type="submit" value="提交">
</form>

</body>
</html>
