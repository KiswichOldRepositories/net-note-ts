var Func = {
        /**
         * 加入用户标识，移除注册登录
         * @param username
         */
        addUserLink: function (username) {
            $("#signup").remove();
            $("#signin").remove();
            $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signout\">退出登录</a></li>");
            $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\ id='signText'>欢迎回来  " + username + "</a></li>");
            //退出登录的逻辑
            $("#signout").on("click", function () {
                $.ajax({
                    url: "/net-note/v1/user/signout",
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        if (data.code === 0) {
                            Func.showHelloPage();
                            Func.removeUserLink();
                        } else {
                            window.alert("账号或密码错误");
                        }
                    }
                });
            });
        },
        /**
         * 移除用户标识，回到注册登录状态
         */
        removeUserLink: function () {
            $("#signText").remove();
            $("#signout").remove();
            $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signin\">注册</a></li>");
            $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signup\">登录</a></li>");

            $("#signup").on("click", function () {
                Func.showSignup();
            });
            $("#signin").on("click", function () {
                Func.showSignin();
            });
        },
        /**
         * 回到初始页面
         */
        showHelloPage: function () {
            $("#content").empty();
            $("#content").append(helloPage);

            //页面元素的事件绑定
            $("#2notePage").on("click", function () {
                Func.showSignup();
            });
        },
        showNotePage: function () {


        },
        getCookie: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        },
        setCookie: function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toGMTString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },
        // 删除cookie
        deleteCookie: function (name) {
            Func.setCookie(name, "", -1);
        },
        signup: function (username, password, success) {
            var form = new FormData();
            form.append("username", username);
            form.append("password", password);
            $.ajax({
                url: "/net-note/v1/user/signup",
                type: "POST",
                cache: false,
                data: form,
                processData: false,
                contentType: false,
                success: function (data) {
                    success(data);
                }
            });
        }
        ,
//在开始时尝试着登录（用cookie）
        signupInStart: function () {
            var username = Func.getCookie("book");
            var password = Func.getCookie("cake");
            Func.signup(username, password, function (data) {
                if (data.code === 0) {
                    Func.showNotePage();
                    $("#signup").remove();
                    $("#signin").remove();
                    $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signout\">退出登录</a></li>");
                    $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id='signText'>欢迎回来  " + username + "</a></li>");
                    Func.logout();
                } else {
                    $("#content").empty();
                    $("#content").append(helloPage);
                    //页面元素的事件绑定
                    $("#2notePage").on("click", function () {
                        Func.showSignup();
                    });
                }
            });
        }
        ,
        /**
         * 渲染tag标签列表，不与服务器进行交互
         * @param tagName
         */
        addTagList: function (tag) {
            $("#tagList").append("<li><a href=\"javascript:void(0)\" name='" + tag.id + "' id='" + tag.tagName + "'>" + tag.tagName + "<span class=\"glyphicon glyphicon-remove pull-right\"></span>\n</a>" +
                "</li>\n");


        }
        ,
        addAttachList: function (attach) {
            $("#attachList").append("<li><a href=\"javascript:void(0)\" id='" + attach.id + "'>" + attach.filename + "<span class=\"glyphicon glyphicon-arrow-down pull-right\"></a></li>\n");
        }
        ,
        /**
         * 绑定上传按钮事件
         */
        uploadEventBind: function () {
            //按钮渲染
            uploader = WebUploader.create({
                // swf文件路径
                swf: '../plugin/webuploader/Uploader.swf',
                // 文件接收服务端。
                server: 'http://localhost/net-note/v1/attach/' + noteId,
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: '#picker',
                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                resize: false
            });
            //按钮样式调整
            //$(".webuploader-element-invisible").css("width","0");
            $(".btns").css("margin-top", "30px");

            //批量上传
            $("#ctlBtn").on("click", function () {
                var files = uploader.getFiles();
                for (var i = 0; i < files.length; i++) {
                    uploader.upload(files[i]);
                }
                $(".uploader-list").append("<h4>正在上传</h4>");
            });

            //文件添加列表（用户体验）
            uploader.on('fileQueued', function (file) {
                if(file.size>30000000) alert("上传文件过大！单个文件不能超过30M");
                else{
                    $(".uploader-list").append('<div id="' + file.id + '" class="item">' +
                        '<h5 class="info">' + file.name +
                        '&nbsp<span class="state">等待上传...</span></h5>' +
                        '</div>');
                }
            });
            //显示进度条
            uploader.on("uploadProgress",function (file,percentage) {
                console.log(file.name + " " + percentage);

            });



            //上传成功显示
            uploader.on('uploadSuccess', function () {
                uploader.reset();
                $(".uploader-list").empty()
                    .append("<h4>上传成功！</h4>");

                setTimeout(" $(\".uploader-list\").empty()", 1500);

                Func.addAttach(noteId);
            });
            //上传失败显示
            uploader.on("uploadError",function () {
                uploader.reset();

                $(".uploader-list").empty()
                    .append("<h3>上传出错！！</h3>");

                setTimeout(" $(\".uploader-list\").empty()", 1500);
            });

        }
        ,
//展示笔记界面（笔记主页面）
        showNotePage: function () {
            $("#content").empty();
            $("#content").append(notePage);
            //测试加载树
            // textTree();
            // //加载树
            Func.freshTree();

            $("#tt3").tree({
                //树的双击事件,用来打开笔记或者折叠（打开）目录 查看笔记 显示笔记
                onDblClick: function (node) {
                    //这里请求异步加载在线笔记预览
                    //alert(node.text);
                    //0.检查是否为文件夹的点击，若是，则展开/合拢文件夹，若不是则->1
                    if (node.id % 2 === 1) {
                        $("#tt3").tree("toggle", node.target);
                        console.log(node);
                    } else {
                        //打开笔记的时候就开始记录
                        var parentNodo = $("#tt3").tree("getParent", node.target);
                        //这里也是对搜索的结果作出的妥协
                        if (parentNodo !== null && parentNodo !== undefined) {
                            pid = parentNodo.id
                        } else {
                            pid = node.attributes[0].pid;
                        }

                        //1.检查是否在编辑状态 若是 则选择是否保存 ；若保存 则提交保存; ->2
                        //console.log(nicEditors.findEditor("editor"));
                        if (Func.confirmIsOnEdit()) {//已经打开了编辑器
                            if (confirm("即将离开编辑器，确认保存吗？")) {
                                Func.postNote();
                            }
                        }
                        //获取笔记内容
                        $.ajax({
                            url: "/net-note/v1/note/" + node.id,
                            type: "GET",
                            cache: false,
                            processData: false,
                            contentType: false,
                            success: function (data) {
                                if (data.code === 0) {
                                    Func.showNotePage();
                                    $("#textarea1").append(textView);
                                    //添加显示内容
                                    $("#textView").append(data.data.noteText);
                                    $("#textTitle").append(data.data.noteName);

                                    Func.addAttach(node.id);

                                } else {
                                    window.alert("您的笔记正在路上");
                                }
                            }
                        });
                    }

                },
                onClick: function (node) {

                },
                onLoadSuccess:function (node, data) {
                    $("#tt3").tree("select",data[0].target);
                }
            });

            //新建笔记页面
            $("#newNote").on("click", function () {
                if (Func.confirmIsOnEdit()) {//如果正在编辑
                    Func.saveNote($("#note-title").val(), nicEditors.findEditor("editor").getContent());//
                    /////////////////////////////这里有问题
                }
                var node = $("#tt3").tree("getSelected");
                if (node === null) {
                    window.alert("请选中要新建的目录");
                } else {
                    noteId = 0;//当前清零
                    //表示这是一个新的笔记

                    //要选中的父目录id做出选择，若当前选中的是文件夹，则直接使用，若是笔记，则使用笔记的父目录
                    pid = node.id % 2 === 0 ? $("#tt3").tree("getParent", node.target).id : node.id;

                    Func.showEditPage();

                    //对与新建的笔记做出一些处理，即移除一些按钮
                    //新建笔记页面不能存在添加标签和文件上传 这些都应该在点击保存后自动完成
                    $("#newTagBtn").remove();
                    $("#newTagInput").attr("placeholder", "请输入标签，多个标签用空格隔开")
                        .css("width", "50%");
                    $("#attachDiv").remove();
                    $("#tagDiv").remove();
                    $("#ctlBtn").remove();


                }

            });

            //编辑笔记按钮
            $("#editNote").on("click", function () {
                var node = $("#tt3").tree("getSelected");
                if (node.id % 2 === 0) {//编辑笔记

                    if (Func.confirmIsOnEdit()) {//如果正在编辑
                        Func.saveNote($("#note-title").val(), nicEditors.findEditor("editor").getContent());
                    }

                    //1、请求到当前选中（或者打开的）的笔记
                    var formData = new FormData();
                    $.ajax({
                        url: "/net-note/v1/note/" + node.id,
                        type: "GET",
                        cache: false,
                        // data: formData,
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            if (data.code === 0) {
                                //3.重新记录noteid与pid
                                var tree = $("#tt3").tree("getParent", node.target);
                                //下面的判断其实可以在服务器返回统一的pid就可以实现了
                                if (tree !== null && tree !== undefined) {//不是搜索出来的结果
                                    noteId = node.id;
                                    pid = $("#tt3").tree("getParent", node.target).id;
                                } else {//搜索出来的结果
                                    noteId = node.id;
                                    pid = node.attributes[0].pid;
                                }
                                //然后跳转到编辑界面
                                Func.showEditPage();
                                //2、打开编辑器页面，将标题和内容写到页面里面
                                Func.addViewTextAndTitle(data.data.noteName, data.data.noteText);

                            } else {
                                window.alert("数据错误");
                            }
                        }
                    });
                } else {//编辑目录名
                    var dirName = prompt("请输入新的目录名", node.text);
                    if (dirName === null || dirName === "" || dirName === node.text) {
                    } else {

                        var editDirForm = new FormData();
                        editDirForm.append("name", dirName);
                        editDirForm.append("_method", "PUT");

                        $.ajax({
                            url: "/net-note/v1/dir/" + node.id,
                            type: "POST",
                            cache: false,
                            // data:{
                            //     name:dirName,
                            //     _method:"PUT"
                            // },
                            data: "name=" + encodeURIComponent(dirName) + "&_method=PUT",//只有这样springmvc才能收到数据
                            // data: JSON.stringify({
                            //     name:dirName,
                            //     _method:"PUT"
                            // }),
                            processData: false,
                            // contentType: false,
                            contentType: "application/x-www-form-urlencoded",
                            success: function (data) {
                                if (data.code === 0) {
                                    Func.freshTree();

                                    $("#tt3").tree("select",node.target);
                                } else {
                                    window.alert("目录结构发生不可预知的变化");
                                }
                            }
                        });
                    }
                }
            });

            //删除笔记、目录界面
            $("#deleteNote").on("click", function () {

                var node = $("#tt3").tree("getSelected");

                if (node.id % 2 === 0) {//删除笔记
                    $.ajax({
                        url: "/net-note/v1/note/" + node.id,
                        type: "POST",
                        cache: false,
                        data: "&_method=DELETE",
                        processData: false,
                        contentType: "application/x-www-form-urlencoded",
                        success: function (data) {
                            if (data.code === 0) {

                                Func.showNotePage();
                            } else {
                                window.alert("笔记不存在或者笔记数据错误");
                            }
                        }
                    });
                } else {//删除目录

                    $.ajax({
                        url: "/net-note/v1/dir/" + node.id,
                        type: "POST",
                        cache: false,
                        data: "&_method=DELETE",
                        processData: false,
                        contentType: "application/x-www-form-urlencoded",
                        success: function (data) {
                            if (data.code === 0) {

                                Func.showNotePage();
                            } else {
                                window.alert("目录不存在或者目录数据错误");
                            }
                        }
                    });
                }
            });

            //展示笔记主页面（树）
            $("#showTree").on("click", function () {
                Func.freshTree();
            });

            //新建目录界面
            $("#newDir").on("click", function () {
                var node = $("#tt3").tree("getSelected");
                if (node == null) {
                    alert("请选中一个文件或者目录");
                    return;
                }
                if (node.id % 2 === 0) {//选中的是个文件
                    node = $("#tt3").tree("getParent", node.target);
                }
                var dirName = prompt("请输入要创建的目录名", "");
                if (dirName === null || dirName.trim() === "") return;
                $.ajax({
                    url: "/net-note/v1/dir/" + node.id,
                    type: "POST",
                    cache: false,
                    data: "name=" + encodeURIComponent(dirName) + "&_method=POST",
                    processData: false,
                    contentType: "application/x-www-form-urlencoded",
                    success: function (data) {
                        if (data.code === 0) {
                            Func.freshTree();
                            $("#tt3").tree("select",node.target);
                        } else {
                            window.alert("目录不存在或者目录数据错误");
                        }
                    }
                });

            });

            //根据tag搜索笔记
            $("#searchNote").on("click", function () {
                //获取输入框的标签
                var tagString = $("#tagSearchInput").val();
                var split = tagString.split(" ");
                tagString = "";

                for (var i = 0; i < split.length; i++) {
                    tagString = tagString + split[i] + ";";
                }

                $('#tt3').tree({
                    url: "/net-note/v1/note?tags=" + tagString,
                    lines: true,
                    async: false,
                    method: "GET",
                    contentType: "application/x-www-form-urlencoded",

                    onLoadSuccess: function (node, data) {
                        var t = $(this);
                        if (data) {
                            $(data).each(function (index, d) {
                                if (this.state === 'closed') {
                                    t.tree('expandAll');
                                }
                            });
                        }
                        $("#tt3").tree("select",data[0].target);
                    }
                });

            });

            //添加分享按钮事件
            $("#addShareBtn").on("click", function () {
                var node = $("#tt3").tree("getSelected");


                $.ajax({
                    url: "/net-note/v1/share/" + node.id,
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: "application/x-www-form-urlencoded",
                    success: function (data) {
                        if (data.code === 0) {
                            //freshTree();
                            Func.freshShareTree();
                        } else {
                            window.alert("分享不存在或者分享数据错误");
                        }
                    }
                });

            });

            //查看分享按钮事件
            $("#showShareBtn").on("click", function () {
                Func.freshShareTree();
                // $("#addShareBtn").parentNode.addClass("disabled");
            });

            //删除分享按钮 事件绑定
            $("#deleteShareBtn").on("click", function () {
                var node = $("#tt3").tree("getSelected");
                var pNode = $("#tt3").tree("getParent", node.target);
                while (pNode !== null) {//把node选到最顶层
                    node = pNode;
                    pNode = $("#tt3").tree("getParent", node.target);
                }
                $.ajax({
                    url: "/net-note/v1/share/" + node.id,
                    type: "POST",
                    cache: false,
                    data: "_method=DELETE",
                    processData: false,
                    contentType: "application/x-www-form-urlencoded",
                    success: function (data) {
                        if (data.code === 0) {
                            //freshTree();
                            Func.freshShareTree();
                        } else {
                            window.alert("分享不存在或者分享数据错误");
                        }
                    }
                });
            });

            //将分享链接粘贴到剪切板
            $("#copyShareUrl").on("click", function () {
                var node = $("#tt3").tree("getSelected");
                //如果没有选择的情况
                if (node === null) return;
                //选到顶层节点，那里有URL的信息
                var parent = $("#tt3").tree("getParent", node.target);
                while (parent !== null) {
                    node = parent;
                    parent = $("#tt3").tree("getParent", node.target);
                }

                var URL = window.location.href + "v1/share/page/" + node.text;
                prompt("请按下CTRL+C复制，并按ENTER退出", URL);
            });
        }
        ,
        logout: function () {
            //退出登录的逻辑 绑定
            $("#signout").on("click", function () {
                $.ajax({
                    url: "/net-note/v1/user/signout",
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        if (data.code === 0) {
                            //showNotePage();
                            $("#signText").remove();
                            $("#signout").remove();
                            $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signin\">注册</a></li>");
                            $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signup\">登录</a></li>");

                            $("#signup").on("click", function () {
                                Func.showSignup();
                            });
                            $("#signin").on("click", function () {
                                Func.showSignin();
                            });
                            Func.showHelloPage();

                            Func.deleteCookie("book");
                            Func.deleteCookie("cake");
                        } else {
                            window.alert("账号或密码错误");
                        }
                    }
                });
            });
        }
        ,
//回到主页面
        showHelloPage: function () {
            $("#content").empty();
            $("#content").append(helloPage);

            //页面元素的事件绑定
            $("#2notePage").on("click", function () {
                Func.showSignup();
            });
        }
        ,
//登录注册(的页面)
        showSignup: function () {
            $("#content").empty();
            $("#content").append(signupPage);

            $("#signup_btn").on("click", function () {
                var username = $("#username").val();
                var password = $("#password").val();

                Func.signup(username, password, function (data) {
                    if (data.code === 0) {
                        Func.showNotePage();
                        $("#signup").remove();
                        $("#signin").remove();
                        $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signout\">退出登录</a></li>");
                        $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id='signText'>欢迎回来  " + username + "</a></li>");
                        Func.logout();
                        Func.setCookie("book", username, 7);
                        Func.setCookie("cake", password, 7);
                    } else {
                        window.alert("账号或密码错误");
                    }
                });
            });

            $("#2signIn").on("click",function () {


            });
        }
        ,
        freshTree: function () {
            $('#tt3').tree({
                url: '/net-note/v1/dir',
                lines: true,
                async: false,
                method: "GET",

                onLoadSuccess: function (node, data) {
                    var t = $(this);
                    if (data) {
                        $(data).each(function (index, d) {
                            if (this.state === 'closed') {
                                t.tree('expandAll');
                            }
                        });
                    }
                    $("#tt3").tree("select",data[0].target);
                    // if (firstFlag === 0) {
                    //     treeSelectID = data[0].id;
                    //     firstFlag = 1;
                    // }
                    // //选中之前的节点
                    // var newNode = $('#tt3').tree('find', treeSelectID);
                    // console.log(newNode);
                    // $('#tt3').tree('select', newNode.target);
                }
            });
        }
        ,
        freshShareTree: function () {
            $('#tt3').tree({
                url: "/net-note/v1/share",
                lines: true,
                async: false,
                method: "GET",
                contentType: "application/x-www-form-urlencoded",

                onLoadSuccess: function (node, data) {
                    var t = $(this);
                    if (data) {
                        $(data).each(function (index, d) {
                            if (this.state === 'closed') {
                                t.tree('expandAll');
                            }
                        });
                    }
                }
            });
        }
        ,
//确认是否在编辑状态：true在，false不在
        confirmIsOnEdit: function () {
            return (nicEditors.findEditor("editor") !== undefined);
        }
        ,
//笔记的编辑页面
        showEditPage: function () {
            $("#textarea1").empty();
            $("#textarea1").append(textArea);
            nicEditor2 = new nicEditor;
            nicEditor2.panelInstance("editor");
            $(".nicEdit-main").addClass("text-area");
            $(".nicEdit-main").css("overflow-y", "auto");

            //绑定上传按钮事件
            Func.uploadEventBind();

            //判断是新建还是编辑
            if (noteId !== 0) {
                //这里获取标签再填充
                $.ajax({
                    url: "/net-note/v1/tag/" + $("#tt3").tree("getSelected").id,
                    type: "GET",
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        if (data.code === 0) {
                            //处理数据 填充到标签栏
                            tags = data.data; //tags为标签
                            var tagString = "";
                            for (var i = 0; i < tags.length; i++) {
                                Func.addTagList(tags[i]);
                            }
                            $("#tagList").val(tagString);


                            //绑定删除标签事件
                            $("#tagList").on("click", function (evt) {
                                var tagId = $(evt.target).attr("name");
                                console.log(tagId);
                                if (window.confirm("确认要删除标签 \" " + $(evt.target).attr("id") + "\"")) {
                                    $.ajax({
                                        url: "/net-note/v1/tag/" + tagId,
                                        type: "POST",
                                        cache: false,
                                        data: "noteId=" + noteId + "&_method=DELETE",
                                        processData: false,
                                        success: function (data) {
                                            if (data.code === 0) {
                                                $(evt.target).remove();
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
                            window.alert("标签不存在");
                        }
                    }
                });
            }


            //绑定事件（保存、添加标签）（保存 保存笔记）
            $("#textSaveBtn").on("click", function () {
                var title = "noteName=" + encodeURIComponent($("#note-title").val());

                //上传笔记
                if (noteId === 0) {//这是新建的笔记
                    //1。提交笔记本身
                    console.log(nicEditors.findEditor("editor").getContent());
                    console.log();
                    var text = "noteText=" + encodeURIComponent(nicEditors.findEditor("editor").getContent(),"ISO-8859-1");
                    // var formData = new FormData();
                    // formData.append("noteText",nicEditors.findEditor("editor").getContent());
                    // formData.append("noteName",$("#note-title").val());
                    console.log(text);
                    $.ajax({
                        url: "/net-note/v1/note/" + pid,
                        type: "POST",
                        cache: false,
                        data: text+ "&" + title +"&_method=POST",
                        processData: false,
                        contentType: "application/x-www-form-urlencoded",
                        success: function (data) {
                            if (data.code === 0) {
                                //showNotePage();
                                //2上传标签
                                var tagInput = $("#newTagInput").val();
                                var split = tagInput.split(" ");

                                for (var i = 0; i < split.length; i++) {
                                    $.ajax({
                                        url: "/net-note/v1/tag/" + data.data.id * 2,
                                        type: "POST",
                                        cache: false,
                                        data: "tagName=" + encodeURIComponent(split[i]),
                                        processData: false,
                                        contentType: "application/x-www-form-urlencoded",
                                        success: function (data) {
                                            if (data.code === 0) {
                                                Func.addTagList(data.data);
                                                Func.freshTree();
                                            } else {
                                                window.alert("标签添加出错了");
                                            }
                                        }
                                    });
                                }

                                //3上传附件 server: 'http://localhost/net-note/v1/attach/' + noteId,
                                uploader.option("server", "http://localhost/net-note/v1/attach/" + data.data.id * 2);

                                var files = uploader.getFiles();
                                for (var j = 0; i < files.length; i++) {
                                    uploader.upload(files[i]);
                                }


                            } else {
                                window.alert("笔记不存在或者笔记数据错误");
                            }
                            Func.showNotePage();
                        }
                    });

                } else {//这是正在修改的内容
                    //1.处理标签并提交
                    //2.提交笔记
                    Func.postNote();
                }
            });

            //绑定新建标签事件
            $("#newTagBtn").on("click", function () {
                var tagName = $("#newTagInput").val();
                if(tagName!==null && tagName.trim()!==""){
                    $.ajax({
                        url: "/net-note/v1/tag/" + noteId,
                        type: "POST",
                        cache: false,
                        data: "tagName=" + encodeURIComponent(tagName),
                        processData: false,
                        contentType: "application/x-www-form-urlencoded",
                        success: function (data) {
                            if (data.code === 0) {
                                console.log(data.data);
                                Func.addTagList(data.data);

                            } else {
                                window.alert(data.message);
                            }
                        }
                    });
                }else{
                    window.alert("标签不能为空");
                }


            });
        }
        ,
//添加显示内容（编辑器页面）
        addViewTextAndTitle: function (noteTitle, noteText) {
            $("#note-title").val(noteTitle);
            nicEditors.findEditor("editor").setContent(noteText);
        }
        ,
//提交笔记
        saveNote: function (noteTitle, noteText) {
            //当前正处于编辑状态
            if (confirm("即将离开编辑器，确认保存吗？")) {
                var formData = new FormData();
                var sendData;
                var sengdId;
                if (noteId === 0) {//这是一个新建的笔记，使用目录的id提交
                    sengdId = pid;
                    formData.append("_method", "POST");
                } else {//这是一个正在编辑的笔记，使用
                    sengdId = noteId;
                    formData.append("_method", "PATCH");
                }
                formData.append("noteName", noteTitle);
                formData.append("noteText", noteText);

                //上传笔记
                $.ajax({
                    url: "/net-note/v1/note/" + sengdId,
                    type: "POST",
                    cache: false,
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        if (data.code === 0) {
                            Func.showNotePage();
                        } else {
                            window.alert("网络错误");
                        }
                    }
                });
            }
        }
        ,
//注册页面
        showSignin: function () {
            $("#content").empty();
            $("#content").append(signinPage);

            $("#signin_btn").on("click", function () {

                var username = $("#username").val();
                var password = $("#password").val();
                var password_config = $("#password_configure").val();
                if (password !== password_config) {
                    window.alert("请输入一致的密码");
                    return;
                }
                var form = new FormData();
                form.append("username", username);
                form.append("password", password);
                $.ajax({
                    url: "/net-note/v1/user/signin",
                    type: "POST",
                    cache: false,
                    data: form,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        if (data.code === 0) {
                            Func.setCookie("book",username,7);
                            Func.setCookie("cake",password);

                            Func.signupInStart();
                        } else {
                            window.alert("帐号已经存在");
                        }
                    }
                });
            });
        }
        ,
        postNote: function () {
            var title = "noteName=" + $("#note-title").val();
            var text = "text=" + encodeURIComponent(nicEditors.findEditor("editor").getContent());
            $.ajax({
                url: "/net-note/v1/note/" + noteId,
                type: "POST",
                cache: false,
                data: title + "&" + text + "&_method=PUT",
                processData: false,
                contentType: "application/x-www-form-urlencoded",
                success: function (data) {
                    if (data.code === 0) {
                        Func.freshTree();
                    } else {
                        window.alert("笔记不存在或者笔记数据错误");
                    }
                }
            });

        }
        ,
        addAttach:function (nodeId) {
            $.ajax({
                url: "/net-note/v1/note/" + nodeId + "/attach",
                type: "GET",
                cache: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.code === 0) {
                        $("#attachList").empty();
                        var attachs = data.data;
                        for (var i = 0; i < attachs.length; i++) {
                            Func.addAttachList(attachs[i]);
                        }
                    }
                    //在这里绑定下载事件 (利用冒泡机制捕获子元素的点击事件)
                    $("#attachList").on("click", function (evt) {
                        //console.log($(evt.target).attr("id"));
                        //下载事件
                        window.location = "./v1/attach/" + $(evt.target).attr("id");
                    });
                }
            });
        }

    }
;