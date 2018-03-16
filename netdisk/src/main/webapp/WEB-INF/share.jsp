<%--
  Created by IntelliJ IDEA.
  User: admin11
  Date: 2017/11/1
  Time: 9:39
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
    <title><%=request.getAttribute("shareFlag")%>的分享</title>
    <link rel="stylesheet" type="text/css" href="plugin/easyui/themes/bootstrap/easyui.css">
    <link rel="stylesheet" type="text/css" href="plugin/easyui/themes/icon.css">
    <link rel="stylesheet" href="css/local.css">
    <script type="text/javascript" src="plugin/jquery/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="plugin/easyui/jquery.easyui.min.js"></script>
    <script src="plugin/jquery-form/jquery.form.min.js" integrity="sha384-tIwI8+qJdZBtYYCKwRkjxBGQVZS3gGozr3CtI+5JF/oL1JmPEHzCEnIKbDbLTCer" crossorigin="anonymous"></script>
    <script type="text/javascript" src="js/share.js"></script>
</head>
<body>
<input type="hidden" value="<%=request.getAttribute("shareFlag")%>" id="shareFlag">
<body class="easyui-layout">
<div data-options="region:'east',title:'下载',split:true ,minWidth:300" style="width:300px;">
        <h1 style="text-align: center"><p>请选择要下载的文件</p> <p>然后点击下载按钮</p></h1>
    <%--<a id="download" href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-search'">easyui</a>--%>
    <button type="button" id="download" style="display: block;width: 200px;height: 100px;margin-left: auto;margin-right: auto;font-size: large">下载</button>
</div>

<div data-options="region:'center',title:'分享中心'" style="padding:5px;background:#eee;">
    <!--文件树 在js中ajax加载 -->
    <div id="categoryChooseDiv" title="请选择分类"
         style="width: 100%; height: 100%;">
        <ul id="tt5"></ul>
    </div>

</div>
</body>

</body>
</html>