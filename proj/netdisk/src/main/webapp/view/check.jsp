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
    <title>欢迎回来 <%=session.getAttribute("username")%>
    </title>
    <link rel="stylesheet" type="text/css" href="plugin/easyui/themes/bootstrap/easyui.css">
    <link rel="stylesheet" type="text/css" href="plugin/easyui/themes/icon.css">
    <link rel="stylesheet" href="css/local.css">
    <script type="text/javascript" src="plugin/jquery/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="plugin/easyui/jquery.easyui.min.js"></script>
    <script src="plugin/jquery-form/jquery.form.min.js" integrity="sha384-tIwI8+qJdZBtYYCKwRkjxBGQVZS3gGozr3CtI+5JF/oL1JmPEHzCEnIKbDbLTCer" crossorigin="anonymous"></script>

    <script type="text/javascript" src="js/CloudSTOR.js"></script>

</head>
<body>



<!--给div指定class属性指定easy的easyui-layout样式，这样就可以通过div创建easyui的layout -->
<div class="easyui-layout" style="width:100%;height:100%;">
    <!-- 布局中如果不需要north这个面板，那么可以删掉这个div -->
    <%--<div data-options="region:'north',title:'CloudStorage',split:true" style="height:100px;"></div>--%>
    <!-- 布局中如果不需要south这个面板，那么可以删掉这个div -->
    <%--<div data-options="region:'south',title:'South Title',split:true" style="height:100px;"></div>--%>
    <!-- 布局中如果不需要east这个面板，那么可以删掉这个div -->
    <div data-options="region:'east',iconCls:'icon-reload',title:'分享链接',split:true,minWidth:200" style="width:250px;">
        <div id="categoryChooseDiv2" title="请选择分类"
             style="width: 200px; height: 500px;">
            <ul id="tt4"></ul>
        </div>

        <button id="addShareBtn" class="btn-center btn-width">添加到分享</button>
        <br><br>
        <button id="deleteShare" class="btn-center btn-width">删除分享</button>
        <br><br>
        <button id="copyURL" class="btn-center btn-width">复制分享链接</button>

    </div>
    <!-- 布局中如果不需要west这个面板，那么可以删掉这个div -->
    <div data-options="region:'west',title:'个人操作',split:true,minWidth:200" style="width:250px;">
        <div style="height: 300px">
            <form action="/net-disk/file/uploadFile" enctype="multipart/form-data" id="fileForm" method="post">
                <b class="label-center">请选择要操作的文件/文件夹</b>
                <br><br>
                <input type="file" name="uploadFile" id="file" class="btn-center">
                <%--<input class="easyui-filebox" style="width:300px" id="file" name="uploadFile">--%>
                <br>
                <!--用来提交父文件夹名的 -->
                <input type="hidden" name="folderID" id="folderID">

                <br>
                <button id="upload" type="button" class="btn-center btn-width">上传文件</button>
            </form>
            <br>
            <label for="uploadBar" class="label-center">上传进度</label>
            <div id="uploadBar" class="easyui-progressbar btn-center" style="width: 80%"></div>
            <label for="uploadBar" id="bartext" class="label-center"></label>
            <br><br>
            <button type="button" id="download" class="btn-center btn-width">下载</button>
            <br><br>
            <button type="button" id="addFolder" class="btn-center btn-width">新增文件夹</button>
            <br><br>
            <button id="editFileOrFolder" type="button" class="btn-center btn-width">修改文件/文件夹</button>
            <br><br>
            <button id="deleteFileOrFolder" type="button" class="btn-center btn-width">删除文件/文件夹</button>


        </div>

    </div>
    <!--north，south， east，west这几个面板都可以删掉，唯有这个center面板一定不能删掉，否则使用easyui-layout就会出错 -->
    <div data-options="region:'center',title:'网盘中心',minWidth:400" style="padding:5px;width:1200px;">
        <!--文件树 在js中ajax加载 -->
        <div id="categoryChooseDiv" title="请选择分类"
             style="width: 100%; height: 100%;">
            <ul id="tt3"></ul>
        </div>

    </div>
</div>


<!--另一种树 不带选中框 -->
<%--<ul id="tt" class="easyui-tree" data-options="url:'/folder/showFolders'"></ul>--%>

<!--右键菜单预留 先用按钮代替 -->
<div id="menu" class="easyui-menu" style="width:150px;">
    <div id="m-refresh">刷新</div>
    <div class="menu-sep"></div>
    <div id="m-closeall">全部关闭</div>
    <div id="m-closeother">除此之外全部关闭</div>
    <div class="menu-sep"></div>
    <div id="m-close">关闭</div>
</div>

<%--<div id="mm" class="easyui-menu" style="width:100px;display: none">--%>
<%--<div iconCls="icon-shield" onclick="revoke()">授权</div>--%>
<%--<div iconCls="icon-delete" onclick="onDelete()">删除</div>--%>
<%--<div iconCls="icon-xiaoxi" onclick="onAdds()">发送个人消息</div>--%>
<%--<div>--%>
<%--<span>其它添加方式</span>--%>
<%--<div style="width:100px;">--%>
<%--<div iconCls="icon-commbook" onclick="saveToGroup()">存通讯录</div>--%>
<%--<div iconCls="icon-qunzu" onclick="deptImport()">导入</div>--%>
<%--</div>--%>
<%--</div>--%>
<%--</div>--%>


<!--隐藏的文件下载表单 。。总觉得这样不太好 -->
<form action="/net-disk/file/downloadFile" enctype="multipart/form-data" id="downloadForm" method="post">
    <input id="folderTreeID" name="folderTreeID" type="hidden">
</form>

<!--同样隐藏的新增文件夹表单  -->
<form action="/net-disk/folder/addFolder" id="addFolderForm" method="post">
    <!--父文件ID -->
    <input type="hidden" id="parentFolderID" name="parentFolderID">
    <!--新建的文件名 -->
    <input type="hidden" id="newFolderName" name="folderName">
</form>
</body>
</html>