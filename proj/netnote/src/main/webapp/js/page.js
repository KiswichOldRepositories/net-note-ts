//欢迎主页面
var helloPage = "<div class=\"jumbotron\" >\n" +
    "                <div class=\"hello\">\n" +
    "                    <h1>Net Note!</h1>\n" +
    "                    <p>\n" +
    "                        This note on web with markdown text and  user-defined images.You can tag notes when you read,watch movie.\n" +
    "                        <br>\n" +
    "                        COME ON!!\n" +
    "                        <br>\n" +
    "                        Bring you a special experience\n" +
    "                    </p>\n" +
    "                    <p><button class='btn btn-primary btn-lg' id='2notePage' role='button'>Do it</button></p>\n" +
    "                </div>\n" +
    "            </div>";

//笔记的主页面
var notePage = " <div class=\"col-xs-3 tree-div \">\n" +
    "                <div class=\"text-title\" id=\"textTitle1\">\n" +
    "                    <div class=\"form-group\" style='margin-bottom:0;min-height: 50px'>\n" +
    "<div class=\"btn-group pull-right\" >\n" +
    "  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "    新建 <span class=\"caret\"></span>\n" +
    "  </button>\n" +
    "  <ul class=\"dropdown-menu\">\n" +
    "    <li><a href=\"javascript:void(0)\" id='newNote'>笔记</a></li>\n" +
    "    <li><a href=\"javascript:void(0)\" id='newDir'>目录</a></li>\n" +
    "  </ul>\n" +
    "</div>" +

    "<div class=\"btn-group pull-right\" >\n" +
    "  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "    分享 <span class=\"caret\"></span>\n" +
    "  </button>\n" +
    "  <ul class=\"dropdown-menu\">\n" +
    "    <li><a href=\"javascript:void(0)\" id='showShareBtn'>查看分享</a></li>\n" +
    "       <li role=\"separator\" class=\"divider\"></li>" +
    "    <li><a href=\"javascript:void(0)\" id='addShareBtn'>添加到分享</a></li>\n" +
    "    <li><a href=\"javascript:void(0)\" id='deleteShareBtn'>删除分享</a></li>\n" +
    "       <li role=\"separator\" class=\"divider\"></li>" +
    "    <li><a href=\"javascript:void(0)\" id='copyShareUrl'>复制分享链接</a></li>\n" +
    "  </ul>\n" +
    "</div>" +

    "<div class=\"btn-group pull-right\" >\n" +
    "  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "    编辑 <span class=\"caret\"></span>\n" +
    "  </button>\n" +
    "  <ul class=\"dropdown-menu\">\n" +
    "    <li><a href=\"javascript:void(0)\" id='editNote'>编辑</a></li>\n" +
    "    <li><a href=\"javascript:void(0)\" id='deleteNote'>删除</a></li>\n" +
    "       <li role=\"separator\" class=\"divider\"></li>" +
    "    <li><a href=\"javascript:void(0)\" id='showTree'>返回笔记目录</a></li>\n" +
    "  </ul>\n" +
    "</div>" +
    "                        <input id='tagSearchInput' type=\"text\" class=\"form-control tag-search\" style=\"float: left\"\n" +
    "                               placeholder=\"按标签查找 \" id='searchNoteInput' >\n" +
    "                        <button class=\"btn btn-default search\"  type=\"button\" style=\"float: left\" id='searchNote'>Search</button>\n" +
    "</div>\n" +
    "\n" +
    "                <!--异步加载文件树-->\n" +
    "                <div id=\"categoryChooseDiv\" title=\"请选择分类\" class=\"file-tree\"\n" +
    "                     style=\"width: 100%; min-height: 550px;min-width: 200px\">\n" +
    "                    <ul id=\"tt3\"></ul>\n" +
    "                </div>\n" +
    "            </div>" +
    "</div>\n" +
    "            <div class=\"col-xs-8\" id=\"textarea1\" >\n" +
    "\n" +
    "            </div>";

//富文本编辑器基础面板
var textArea = "     <div class=\"form-group text-title\" id=\"textTitle\" >\n" +
    "                    <button class=\"btn btn-default btn-undef\" style=\"float: left\" id='textSaveBtn'>保存</button>\n" +
    "                    <input id='newTagInput' type=\"text\" class=\" tag-input\" placeholder=\"输入标签添加 \" >\n " +
    "                   <button id='newTagBtn' class=\"btn btn-default btn-undef\" style=\"float: left;text-align: center\">添加标签</button>\n           " +

    "<div class=\"btn-group\" id='tagDiv'>\n" +
    "  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "    标签 <span class=\"caret\"></span>\n" +
    "  </button>\n" +
    "  <ul class=\"dropdown-menu\" id='tagList'>\n" +
    "  </ul>\n" +
    "</div>" +


    "<div class=\"btn-group\" id='attachDiv'>\n" +
    "  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "    附件 <span class=\"caret\"></span>\n" +
    "  </button>\n" +
    "  <ul class=\"dropdown-menu\" id='attachList'>\n" +
    "  </ul>\n" +
    "</div>" +

    "                   <br><label for='note-title' style='margin: 0 10px'>笔记标题</label><input class='note-title' id='note-title' >" +
    "                </div><div id='sample' class='centor editor'>" +
    "<textarea id='editor' name='editor' class='centor editor' style='width: 100%;height: 80%'></textarea></div>" +

    "<div id=\"uploader\" class=\"wu-example\">\n" +
    "    <!--用来存放文件信息-->\n" +
    "    <div id=\"thelist\" class=\"uploader-list\"></div>\n" +
    "    <div class=\"btns\">\n" +
    "        <span id=\"picker\">选择文件</span>\n" +
    "        <button id=\"ctlBtn\" class=\"btn btn-default\">开始上传</button>\n" +
    "    </div>\n" +
    "</div>" +
    "";

//笔记查看的基本面板
var textView = "<div class=\'text-title\'>" +
    "<span id='textTitle' style='line-height: 50px'></span>" +

    "<div class=\"btn-group pull-right\" id='tagDiv'>\n" +
    "  <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "    附件 <span class=\"caret\"></span>\n" +
    "  </button>\n" +
    "  <ul class=\"dropdown-menu\" id='attachList'>\n" +
    "  </ul>\n" +
    "</div>" +
    "</div><div class=\'text-view\' id=\'textView\'></div>" +
    "";

var signupPage = "            <div class=\"signup\">\n" +
    "                <div class=\"col-xs-7\">\n" +
    "                    <img src=\"../net-note/images/sign.png\" alt=\"\" class=\"sign-img img-responsive\">\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-5\">\n" +
    "\n" +
    "                    <form class=\"form-inline sign-form\" style=\"padding: 40px;width:400px \">\n" +
    "\n" +
    "                        <h1 style=\"text-align: center;margin-bottom: 30px\">登录</h1>\n" +
    "                        <form class=\"form-inline\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"input-group\">\n" +
    "                                    <div class=\"input-group-addon\"><label for=\"username\">username</label></div>\n" +
    "                                    <input type=\"pa\" class=\"form-control\" id=\"username\" placeholder=\"输入帐号\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"input-group\">\n" +
    "                                    <div class=\"input-group-addon\"><label for=\"password\">password</label></div>\n" +
    "                                    <input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"输入密码\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" style=\"margin-top: 20px\" id='signup_btn'>Sign Up</button>\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" style=\"margin-top: 20px\" id='2signIn'>To Sign In</button>\n" +
    "                        </form>\n" +
    "\n" +
    "                    </form>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>";

var signinPage = "<div class=\"signup\">\n" +
    "                <div class=\"col-xs-7\">\n" +
    "                    <img src=\"../net-note/images/sign.png\" alt=\"\" class=\"sign-img img-responsive\">\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-5\">\n" +
    "\n" +
    "                    <form class=\"form-inline sign-form\" style=\"padding: 40px;width:400px \">\n" +
    "\n" +
    "                        <h1 style=\"text-align: center;margin-bottom: 30px\">注册</h1>\n" +
    "                        <form class=\"form-inline\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"input-group\">\n" +
    "                                    <div class=\"input-group-addon\"><label for=\"username\">username</label></div>\n" +
    "                                    <input type=\"text\" class=\"form-control\" id=\"username\" placeholder=\"请输入帐号\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"input-group\">\n" +
    "                                    <div class=\"input-group-addon\"><label for=\"password\">password</label></div>\n" +
    "                                    <input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"请输入密码\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"input-group\">\n" +
    "                                    <div class=\"input-group-addon\"><label for=\"password\">password</label></div>\n" +
    "                                    <input type=\"password\" class=\"form-control\" id=\"password_configure\" placeholder=\"请再次输入密码\">\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" style=\"margin-top: 20px\" id='signin_btn'>Sign In</button>\n" +
    "                        </form>\n" +
    "\n" +
    "                    </form>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>";


var shareUrlPage= " <div class=\"col-xs-3 tree-div \">\n" +
    "                <div class=\"text-title\" id=\"textTitle1\">\n" +
    "                    <div class=\"form-group\" style='margin-bottom:0;min-height: 50px'>\n" +

    "</div>\n" +
    "\n" +

    "                <!--异步加载文件树-->\n" +
    "                <div id=\"categoryChooseDiv\" title=\"请选择分类\" class=\"file-tree\"\n" +
    "                     style=\"width: 100%; min-height: 550px;min-width: 200px\">\n" +
    "                    <ul id=\"tt4\"></ul>\n" +
    "                </div>\n" +
    "            </div>" +
    "</div>\n" +
    "            <div class=\"col-xs-8\" id=\"textarea1\" >\n" +
    "\n" +
    "            </div>";