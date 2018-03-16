define(["require", "exports", "Webuploader", "scooper.ajax", "../manager/classManager.js", "../constant.js", "nicEdit"], function (require, exports, WebUploader, scooper_ajax_1, classManager_js_1, constant_js_1) {
    "use strict";
    exports.__esModule = true;
    var web = WebUploader;
    /**
     *右边编辑页面的状态
     */
    var RightStatus;
    (function (RightStatus) {
        RightStatus[RightStatus["noPage"] = 0] = "noPage";
        RightStatus[RightStatus["editPage"] = 1] = "editPage";
        RightStatus[RightStatus["newPage"] = 2] = "newPage";
        RightStatus[RightStatus["viewPage"] = 3] = "viewPage";
    })(RightStatus || (RightStatus = {}));
    /**
     * 左边树的状态
     */
    var LeftStatus;
    (function (LeftStatus) {
        LeftStatus[LeftStatus["noteTree"] = 0] = "noteTree";
        LeftStatus[LeftStatus["shareTree"] = 1] = "shareTree";
        LeftStatus[LeftStatus["SearchTree"] = 2] = "SearchTree";
    })(LeftStatus || (LeftStatus = {}));
    var NotePage = /** @class */ (function () {
        /**
         * 这个select一般是 "#content"
         * @param {string} select
         */
        function NotePage(select) {
            var _this = this;
            //笔记本主页面
            this.notePage = ("<div class=\"col-xs-3 tree-div \">\n                            <div class=\"text-title\" id=\"textTitle1\">\n                               <div class=\"form-group\" style='margin-bottom:0;min-height: 50px'>\n                                    <div class=\"btn-group pull-right\" >\n                                        <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                                            \u65B0\u5EFA <span class=\"caret\"></span>\n                                        </button>\n                                       <ul class=\"dropdown-menu\">\n                                         <li><a href=\"javascript:void(0)\" id='newNote'>\u7B14\u8BB0</a></li>\n                                         <li><a href=\"javascript:void(0)\" id='newDir'>\u76EE\u5F55</a></li>\n                                       </ul>\n                                    </div>\n\n                                     <div class=\"btn-group pull-right\" >\n                                       <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                                         \u5206\u4EAB <span class=\"caret\"></span>\n                                       </button>\n                                       <ul class=\"dropdown-menu\">\n                                         <li><a href=\"javascript:void(0)\" id='showShareBtn'>\u67E5\u770B\u5206\u4EAB</a></li>\n                                            <li role=\"separator\" class=\"divider\"></li>\n                                         <li><a href=\"javascript:void(0)\" id='addShareBtn'>\u6DFB\u52A0\u5230\u5206\u4EAB</a></li>\n                                         <li><a href=\"javascript:void(0)\" id='deleteShareBtn'>\u5220\u9664\u5206\u4EAB</a></li>\n                                            <li role=\"separator\" class=\"divider\"></li>\n                                         <li><a href=\"javascript:void(0)\" id='copyShareUrl'>\u590D\u5236\u5206\u4EAB\u94FE\u63A5</a></li>\n                                       </ul>\n                                     </div>\n\n                                     <div class=\"btn-group pull-right\" >\n                                       <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                                         \u7F16\u8F91 <span class=\"caret\"></span>\n                                       </button>\n                                       <ul class=\"dropdown-menu\">\n                                         <li><a href=\"javascript:void(0)\" id='editNote'>\u7F16\u8F91</a></li>\n                                         <li><a href=\"javascript:void(0)\" id='deleteNote'>\u5220\u9664</a></li>\n                                            <li role=\"separator\" class=\"divider\"></li>\n                                         <li><a href=\"javascript:void(0)\" id='showTree'>\u8FD4\u56DE\u7B14\u8BB0\u76EE\u5F55</a></li>\n                                       </ul>\n                                     </div>\n                                     <input id='tagSearchInput' type=\"text\" class=\"form-control tag-search\" style=\"float: left\"\n                                            placeholder=\"\u6309\u6807\u7B7E\u67E5\u627E \" id='searchNoteInput' >\n                                     <button class=\"btn btn-default search\"  type=\"button\" style=\"float: left\" id='searchNote'>Search</button>\n                                </div>\n \n                                <div>\n                                    <ul id=\"noteTree\" class=\"ztree\"></ul>        \n                                </div>\n                              </div>\n                          </div>");
            this.text = ("<div class=\"col-xs-8\" id=\"textarea1\"></div>");
            //笔记本编辑基础页面
            this.textArea = ("<div class=\"form-group text-title\" id=\"textTitle\" >\n                            <button class=\"btn btn-default btn-undef\" style=\"float: left\" id='textSaveBtn'>\u4FDD\u5B58</button>\n                            <input id='newTagInput' type=\"text\" class=\" tag-input\" placeholder=\"\u8F93\u5165\u6807\u7B7E\u6DFB\u52A0 \" >\n                            <button id='newTagBtn' class=\"btn btn-default btn-undef\" style=\"float: left;text-align: center\">\u6DFB\u52A0\u6807\u7B7E</button>\n\n                            <div class=\"btn-group\" id='tagDiv'>\n                              <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                                \u6807\u7B7E <span class=\"caret\"></span>\n                              </button>\n                              <ul class=\"dropdown-menu\" id='tagList'>\n                              </ul>\n                            </div>\n\n                            <div class=\"btn-group\" id='attachDiv'>\n                              <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                                \u9644\u4EF6 <span class=\"caret\"></span>\n                              </button>\n                              <ul class=\"dropdown-menu\" id='attachList'>\n                              </ul>\n                            </div>\n\n                            <br><label for='note-title' style='margin: 0 10px'>\u7B14\u8BB0\u6807\u9898</label><input class='note-title' id='note-title' >\n                        </div>\n                        <div id='sample' class='centor editor'>\n                            <textarea id='editor' name='editor' class='centor editor' style='width: 100%;height: 80%'></textarea>\n                        </div>\n                        <div id=\"uploader\" class=\"wu-example\">\n                             <!--\u7528\u6765\u5B58\u653E\u6587\u4EF6\u4FE1\u606F-->\n                             <div id=\"thelist\" class=\"uploader-list\">\n                             </div>\n                             <div class=\"btns\">\n                                 <span id=\"picker\">\u9009\u62E9\u6587\u4EF6</span>\n                                 <button id=\"ctlBtn\" class=\"btn btn-default\">\u5F00\u59CB\u4E0A\u4F20</button>\n                             </div>\n                        </div>");
            //笔记查看页面
            this.textView = ("<div class='text-title'>\n                            <span id='textTitle' style='line-height: 50px'></span>\n\n                            <div class=\"btn-group pull-right\" id='tagDiv'>\n                                <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n\n                                    \u9644\u4EF6 <span class=\"caret\"></span>\n                                </button>\n                                <ul class=\"dropdown-menu\" id='attachList'>\n                                </ul>\n                            </div>\n                        </div>\n                        <div class='text-view' id='textView'>\n                        </div>");
            this.ajax = new scooper_ajax_1.Ajax("");
            /**
             * 绑定笔记基础页面的事件
             */
            this.build = function () {
                $(_this.select).append(_this.notePage);
                // this.$notePage.c
                $(_this.select).append(_this.text);
                //改变状态
                _this.rightStatus = RightStatus.noPage;
                _this.bindInitEvent();
                _this.freshTree(constant_js_1.Constant.urlHead + "dir/ztree");
            };
            /**
             * 擦除右边的显示界面
             */
            this.clean = function () {
                $("#textarea1").empty();
                //this.$text.empty();
            };
            /**
             * 擦除整个页面
             */
            this.close = function () {
                _this.$select.empty();
                _this.rightStatus = RightStatus.noPage;
                _this.leftStatus = LeftStatus.noteTree;
            };
            /**
             * 在页面上添加标签
             */
            this.addTag2List = function (tagId, tagName) {
                $("#tagList").append("<li><a href=\"javascript:void(0)\" name='" + tagName + "' id='" + tagId + "'>" + tagName + "<span class=\"glyphicon glyphicon-remove pull-right\"></span></a></li>");
            };
            /**
             * 在页面上加入附件(下载)
             */
            this.addAttach2List = function (nodeId, fileName) {
                $("#attachList").append("<li><a href=\"javascript:void(0)\" id='" + nodeId + "'>" + fileName + "<span class=\"glyphicon glyphicon-arrow-down pull-right\"></a></li>");
            };
            /**
             * 页面上加入附件（删除）
             */
            this.addAttach2ListDelete = function (nodeId, fileName) {
                $("#attachList").append("<li><a href=\"javascript:void(0)\" id='" + nodeId + "'>" + fileName + "<span class=\"glyphicon glyphicon-remove pull-right\"></a></li>");
            };
            /**
             * 根据所选的节点找到最上层的节点
             */
            this.findTopNode = function () {
                var zTreeObj = $.fn.zTree.getZTreeObj("noteTree");
                var selectedNode = zTreeObj.getSelectedNodes()[0];
                if (selectedNode !== undefined) {
                    var parentNode = selectedNode.getParentNode();
                    while (parentNode !== null) {
                        selectedNode = parentNode;
                        parentNode = selectedNode.getParentNode();
                    }
                    return selectedNode;
                }
                else {
                    return null;
                }
            };
            /**
             * 笔记编辑页面 （擦除原窗口 加入该窗口 绑定按钮事件）
             */
            this.editNote = function (note) {
                _this.clean();
                $("#textarea1").append(_this.textArea);
                nicEditors.allTextAreas();
                //样式调整
                $(".nicEdit-main").addClass("text-area");
                $(".nicEdit-main").css("overflow-y", "auto");
                //标记
                //获取笔记数据
                classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "note/" + note.mid, "_method=GET")
                    .then(function (result) {
                    //填充数据
                    $("#note-title").val(result.data.noteName);
                    nicEditors.findEditor("editor").setContent(result.data.noteText);
                    //填充标签
                    classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "tag/" + note.mid, "_method=GET")
                        .then(function (result) {
                        result.data.forEach(function (element) {
                            _this.addTag2List(element.tagName, element.id);
                        });
                    });
                    //填充附件
                    classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "note/" + note.mid + "/attach", "_method=GET")
                        .then(function (result) {
                        result.data.forEach(function (element) {
                            _this.addAttach2ListDelete(element.id, element.filename);
                        });
                    });
                    //改变状态
                    _this.rightStatus = RightStatus.editPage;
                    _this.editNoteInf = note;
                    //绑定事件
                    _this.bindEditEvent();
                });
            };
            /**
             * 笔记新建页面 （擦除原窗口 加入该窗口 绑定按钮事件）
             */
            this.newNote = function (note) {
                _this.clean();
                // this.$textArea.appendTo(this.$text);
                $("#textarea1").append(_this.textArea);
                nicEditors.allTextAreas();
                //标记
                //对页面做一些处理
                $("#newTagBtn").remove();
                $("#newTagInput").attr("placeholder", "请输入标签，多个标签用空格隔开")
                    .css("width", "50%");
                $("#attachDiv").remove();
                $("#tagDiv").remove();
                $("#ctlBtn").remove();
                //改变状态
                _this.rightStatus = RightStatus.newPage;
                _this.editNoteInf = note;
                //绑定事件
                _this.bindNewEnent();
            };
            /**
             * 笔记查看页面（擦除原窗口 加入该窗口 绑定按钮事件）
             */
            this.viewNote = function (note) {
                _this.clean();
                $("#textarea1").append(_this.textView);
                //还需填充
                classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "note/" + note.mid)
                    .then(function (result) {
                    $("#textTitle").html(result.data.noteName);
                    $("#textView").html(result.data.noteText);
                    //接着填充附件下载
                    classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "note/" + note.mid + "/attach")
                        .then(function (result) {
                        //填充附件下载栏
                        result.data.forEach(function (element) {
                            _this.addAttach2List(element.id, element.filename);
                        });
                    });
                    //改变状态
                    _this.rightStatus = RightStatus.viewPage;
                    //绑定事件
                    _this.bindViewEvent();
                    console.log(111);
                });
            };
            /**
             * 保存笔记(新)
             * callback:最后会调用的回调函数
             */
            this.saveNewNote = function (callback) {
                var newNoteId;
                classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "note/" + _this.editNoteInf.pid, "noteName=" + encodeURIComponent($("#note-title").val()) + "&noteText=" + encodeURIComponent(nicEditors.findEditor("editor").getContent()), function () {
                }, function () {
                }, "post")
                    .then(function (result) {
                    _this.editNoteInf = {
                        mid: result.data.id * 2,
                        pid: result.data.parentDirId * 2 + 1
                    };
                    newNoteId = result.data.id * 2; //id转换
                    //在目录树中添加笔记
                    var zTreeObj = $.fn.zTree.getZTreeObj("noteTree");
                    zTreeObj.addNodes(zTreeObj.getNodeByParam("id", String(_this.editNoteInf.pid)), {
                        id: result.data.id * 2,
                        pId: result.data.parentDirId * 2 + 1,
                        name: result.data.noteName,
                        isParent: false
                    });
                    //将每一个标签上传到后台
                    var split = $("#newTagInput").val().split(" ");
                    $.each(split, function (index, element) {
                        classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "tag/" + String(newNoteId), "tagName=" + encodeURIComponent(element), function () {
                        }, function () {
                        }, "post")
                            .then(function (result) {
                        });
                    });
                    //将之前的附件全部上传、、标记(目前会失败 因此先try-catch)
                    try {
                        var files = _this.uploader.getFiles();
                        _this.uploader.option("server", "http://localhost/net-note/v1/attach/" + result.data.id * 2);
                        for (var i = 0; i < files.length; i++) {
                            _this.uploader.upload(files[i]);
                        }
                        $(".uploader-list").append("<h4>正在上传</h4>");
                    }
                    catch (e) {
                    }
                    callback();
                });
            };
            /**
             * 保存笔记（编辑）
             * callback:最后会调用的回调函数
             */
            this.saveEditNote = function (callback) {
                classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "note/" + String(_this.editNoteInf.mid), "text=" + encodeURIComponent(nicEditors.findEditor("editor").getContent())
                    + "&noteName=" + encodeURIComponent($("#note-title").val()) + "&_method=PUT", function () {
                }, function () {
                }, "post")
                    .then(function (result) {
                    //标记 保存完之后做什么
                    _this.editNoteInf = {
                        mid: result.data.id * 2,
                        pid: result.data.parentDirId * 2 + 1
                    };
                    //更新树
                    var zTreeObj = $.fn.zTree.getZTreeObj("noteTree");
                    var param = zTreeObj.getNodeByParam("id", result.data.id * 2);
                    param.name = result.data.noteName;
                    callback();
                })["catch"](function () {
                });
            };
            /**
             * 判断是否在编辑/新建状态 并确实是否要保存
             */
            this.isOnWorking = function () {
                switch (_this.rightStatus) {
                    case RightStatus.editPage:
                        if (window.confirm("正在编辑，是否要保存？")) {
                            //标记
                            //写一个通用的保存方法
                            _this.saveEditNote();
                        }
                        break;
                    case RightStatus.newPage:
                        if (window.confirm("正在新建，是否要保存？")) {
                            //标记
                            _this.saveNewNote();
                        }
                        break;
                    default:
                        break;
                }
            };
            /**
             * 刷新树 传入与服务器交互的url
             */
            this.freshTree = function (url) {
                var setting = {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pid",
                            rootPId: 0
                        }
                    }, async: {
                        enable: false
                    },
                    callback: {
                        onDblClick: _this.bindTreeDoubleClick,
                        asyncSuccess: function (data) {
                            console.log(data);
                        }
                    }
                };
                classManager_js_1.ClassManager.ajax.request(url).then(function (result) {
                    $.fn.zTree.init($("#noteTree"), setting, result.data);
                });
            };
            /**
             * 通用的刷新树(parma是一个map)
             */
            this.freshTreeUs = function (url, parma) {
                var parmaString = "";
                for (var index in parma) {
                    if (index !== "_method") {
                        if (parmaString.trim() === "")
                            parmaString = index + "=" + encodeURIComponent(parma[index]);
                        else
                            parmaString = parmaString + "&" + index + "=" + encodeURIComponent(parma[index]);
                    }
                    else {
                        if (parmaString.trim() === "")
                            parmaString = index + "=" + parma[index];
                        else
                            parmaString = parmaString + "&" + index + "=" + parma[index];
                    }
                }
                //经检验 得到的应该string达标
                var setting = {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pid",
                            rootPId: 0
                        }
                    }, async: {
                        enable: false
                    },
                    callback: {
                        onDblClick: _this.bindTreeDoubleClick,
                        asyncSuccess: function (data) {
                            console.log(data);
                        }
                    }
                };
                classManager_js_1.ClassManager.ajax.request(url, parmaString).then(function (result) {
                    $.fn.zTree.init($("#noteTree"), setting, result.data);
                });
            };
            //主界面事件集
            /**
             * 1.树的双击事件
             */
            this.bindTreeDoubleClick = function (event, treeId, treeNode) {
                // console.log(event);
                // console.log(treeId);
                console.log(treeNode);
                if (treeNode.id % 2 == 1) {
                }
                else if (treeNode.id % 2 == 0) {
                    //判断是否处于编辑状态
                    _this.isOnWorking();
                    //记录笔记的信息
                    _this.editNoteInf = {
                        mid: treeNode.id,
                        pid: treeNode.pid
                    };
                    console.log(_this);
                    //触发浏览一个笔记的事件
                    if (_this.leftStatus == LeftStatus.noteTree || _this.leftStatus == LeftStatus.shareTree) {
                        _this.viewNote({
                            mid: treeNode.id,
                            pid: treeNode.getParentNode().id
                        });
                    }
                    else {
                        _this.viewNote({
                            mid: treeNode.id,
                            pid: 0
                        });
                    }
                }
            };
            /**
             * 2.新建按钮事件（是否保存？->新建笔记界面）
             */
            this.bindNewNote = function () {
                //标记
                //先判断是否在编辑状态
                $("#newNote").on("click", function () {
                    //判断是否在选择状态
                    var selectedNode = $.fn.zTree.getZTreeObj("noteTree").getSelectedNodes()[0];
                    if (selectedNode !== undefined) {
                        //选中文件夹
                        if (selectedNode.id % 2 == 0)
                            selectedNode = selectedNode.getParentNode();
                        //判断是否处于编辑状态
                        _this.isOnWorking();
                        _this.newNote({
                            mid: 0,
                            pid: selectedNode.id
                        });
                        //更新状态
                        _this.editNoteInf.mid = 0;
                        _this.editNoteInf.pid = selectedNode.id;
                        _this.rightStatus = RightStatus.newPage;
                    }
                });
                //若在 则提示是否需要保存
                //然后打开一个新的编辑页面
            };
            /**
             * 2.5 新建目录按钮事件
             */
            this.bindNewDir = function () {
                $("#newDir").on("click", function () {
                    var prompt = window.prompt("请输入要新建的目录名");
                    if (prompt !== "") {
                        var treeObj_1 = $.fn.zTree.getZTreeObj("noteTree");
                        var selectedNode_1 = treeObj_1.getSelectedNodes()[0];
                        if (selectedNode_1.id % 2 == 0)
                            selectedNode_1 = selectedNode_1.getParentNode(); //当选中的是笔记时 使用他的父节点
                        classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "dir/" + selectedNode_1.id, "name=" + encodeURIComponent(prompt), function () {
                        }, function () {
                        }, "post")
                            .then(function (result) {
                            //键入该节点,使其正好在目录最下面
                            var index = 0;
                            var children = selectedNode_1.children;
                            if (children === undefined) {
                                treeObj_1.addNodes(selectedNode_1, {
                                    id: result.data.id * 2 + 1,
                                    pId: result.data.parentId * 2 + 1,
                                    name: result.data.dirName,
                                    isParent: true
                                });
                            }
                            else {
                                children.forEach(function (element) {
                                    if (element.isParent == true) {
                                        index = treeObj_1.getNodeIndex(element) + 1;
                                        return;
                                    }
                                });
                                treeObj_1.addNodes(selectedNode_1, index, {
                                    id: result.data.id * 2 + 1,
                                    pId: result.data.parentId * 2 + 1,
                                    name: result.data.dirName,
                                    isParent: true
                                });
                            }
                        });
                    }
                });
            };
            /**
             * 3.编辑按钮事件（是否保存?->编辑笔记界面 || 编辑目录名）
             */
            this.bindEditNote = function () {
                //标记
                //先判断是编辑目录还是笔记
                $("#editNote").on("click", function () {
                    var selectedNode = $.fn.zTree.getZTreeObj("noteTree").getSelectedNodes()[0]; //在多选情况下，只看第一个节点
                    if (selectedNode !== undefined) {
                        if (selectedNode.id % 2 == 1) {
                            var dirName_1 = window.prompt("请输入修改后的文件夹名", selectedNode.name);
                            if (dirName_1 !== selectedNode.name && dirName_1.trim() !== "") {
                                classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "/dir/" + selectedNode.id, "name=" + encodeURIComponent(dirName_1) + "&_method=PUT", function () {
                                }, function () {
                                }, "post")
                                    .then(function (result) {
                                    //更新完目录名后要做的事（更新树）,标记 下面的方法可能无效
                                    selectedNode.name = dirName_1;
                                });
                            }
                        }
                        else if (selectedNode.id % 2 == 0) {
                            //判断是否在编辑状态 并做出相应处理
                            _this.isOnWorking();
                            //编辑笔记
                            _this.editNote({
                                mid: selectedNode.id,
                                pid: selectedNode.getParentNode().id
                            });
                        }
                    }
                });
                //若在则保存
                //然后打开点击笔记的编辑页面
            };
            /**
             * 4.删除按钮事件（确认删除?->删除）
             */
            this.bindDelete = function () {
                //判断该笔记是否在打开状态
                $("#deleteNote").on("click", function () {
                    var treeObj = $.fn.zTree.getZTreeObj("noteTree");
                    var selectedNode = treeObj.getSelectedNodes()[0];
                    if (selectedNode.id % 2 == 0) {
                        if (window.confirm("是否要删除该笔记： " + selectedNode.name)) {
                            classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "note/" + selectedNode.id, "_method=DELETE", function () {
                            }, function () {
                            }, "post")
                                .then(function (result) {
                                //删除之后要干的事情 删除树的节点
                                treeObj.removeNode(selectedNode, false);
                            });
                        }
                    }
                    else {
                        if (window.confirm("是否要删除该目录： " + selectedNode.name)) {
                            classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "dir/" + selectedNode.id, "_method=DELETE", function () {
                            }, function () {
                            }, "post")
                                .then(function (result) {
                                //删除之后要干的事，删除目录节点
                                treeObj.removeNode(selectedNode, false);
                            });
                        }
                    }
                    if (_this.rightStatus == RightStatus.editPage || _this.rightStatus == RightStatus.viewPage && _this.editNoteInf.mid == selectedNode.id) {
                        //如果打开的笔记 在所删除的内容里面，应该关闭该笔记回到空白页面 nopage
                        //标记
                    }
                });
                //在则提示 不在则删除
            };
            /**
             * 5.回笔记中心按钮事件（刷新树为笔记树）
             */
            this.bindGoBack = function () {
                //标记
                //刷新树
                $("#showTree").on("click", function () {
                    $("#noteTree").empty();
                    _this.freshTree(constant_js_1.Constant.urlHead + "dir/ztree");
                });
                _this.leftStatus = LeftStatus.noteTree;
            };
            /**
             * 6.搜索事件（刷新树为搜索笔记树）
             */
            this.bindSearch = function () {
                //标记
                //根据结果刷新树
                $("#searchNote").on("click", function () {
                    //判断空值
                    if ($("#tagSearchInput").val().trim() !== "") {
                        var tagsWithSapce = $("#tagSearchInput").val();
                        var split = tagsWithSapce.split(" ");
                        var tags = split.join(";");
                        //提交搜索
                        //根据搜索的结果刷新树
                        _this.freshTreeUs(constant_js_1.Constant.urlHead + "/note/ztree", {
                            tags: tags,
                            _method: "GET"
                        });
                        _this.leftStatus = LeftStatus.SearchTree;
                    }
                });
            };
            /**
             * 7.添加分享按钮事件
             */
            this.bindAddShare = function () {
                //提交服务器
                $("#addShareBtn").on("click", function () {
                    //在笔记树的情况下，此按钮有效
                    if (_this.leftStatus === LeftStatus.noteTree) {
                        var selectedNode = $.fn.zTree.getZTreeObj("noteTree").getSelectedNodes()[0];
                        //检查是否选中
                        if (selectedNode !== undefined) {
                            classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "share/" + selectedNode.id, {}, function () {
                            }, function () {
                            }, "post")
                                .then(function (result) {
                                //刷新树 也可以不管
                            });
                        }
                    }
                });
            };
            /**
             * 8.查看分享按钮事件
             */
            this.bindShowShare = function () {
                //标记
                $("#showShareBtn").on("click", function () {
                    //提交 刷新树
                    _this.freshTreeUs(constant_js_1.Constant.urlHead + "share/ztree", {
                        _method: "GET"
                    });
                    _this.leftStatus = LeftStatus.shareTree;
                });
            };
            /**
             * 9.删除分享按钮事件
             */
            this.bindDeleteShare = function () {
                $("#deleteShareBtn").on("click", function () {
                    if (_this.leftStatus === LeftStatus.shareTree) {
                        //找到最上层节点
                        var zTreeObj_1 = $.fn.zTree.getZTreeObj("noteTree");
                        var selectedNode_2 = _this.findTopNode();
                        if (selectedNode_2 !== null) {
                            if (window.confirm("即将删除分享，请确认")) {
                                //发送删除
                                classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "share/" + (-selectedNode_2.id), "_method=DELETE", function () {
                                }, function () {
                                }, "post")
                                    .then(function (result) {
                                    //删除树节点
                                    zTreeObj_1.removeNode(selectedNode_2, false);
                                });
                            }
                        }
                    }
                });
            };
            //编辑界面事件集
            /**
             * 1.保存按钮事件（对于新建的笔记 先上传笔记，然后上传附件和添加标签；对于编辑的笔记，保存内容即可）
             */
            this.bindSaveNote = function () {
                //标记
                $("#textSaveBtn").on("click", function () {
                    //判断是新建的笔记还是编辑的笔记
                    if (_this.rightStatus === RightStatus.newPage) {
                        //新建的 先上传笔记，然后上传附件和添加标签
                        _this.saveNewNote(function () {
                            //最后跳转
                            _this.viewNote({
                                mid: _this.editNoteInf.mid,
                                pid: _this.editNoteInf.pid
                            });
                        });
                    }
                    else if (_this.rightStatus === RightStatus.editPage) {
                        //编辑的 直接保存内容（附件和标签在过程中就保存了）
                        _this.saveEditNote(function () {
                            //最后跳转
                            _this.viewNote({
                                mid: _this.editNoteInf.mid,
                                pid: _this.editNoteInf.pid
                            });
                        });
                    }
                });
            };
            /**
             * 2.新建标签按钮事件
             */
            this.bindNewTag = function () {
                //标记
                $("#newTagBtn").on("click", function () {
                    //上传到服务器
                    classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "tag/" + String(_this.editNoteInf.mid), "tagName=" + encodeURIComponent($("#newTagInput").val()) + "&_method=POST", function () {
                    }, function () {
                    }, "post")
                        .then(function (result) {
                        //添加到标签栏
                        _this.addTag2List(result.data.id, result.data.tagName);
                    });
                });
            };
            /**
             * 2.5删除标签事件
             */
            this.bindDeleteTag = function () {
                //委托
                $("#tagList").on("click", function (eventObject) {
                    var $tag = $(eventObject.target);
                    //删除标签
                    classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "tag/" + $tag.attr("id"), "_method=DELETE", function () {
                    }, function () {
                    }, "post")
                        .then(function (result) {
                        //删除标签
                        $("#" + $tag.attr("id")).remove();
                    });
                });
            };
            /**
             * 3.绑定上传按钮事件
             */
            this.bindUpload = function () {
                //标记
                //这是webupload的上传插件
                //按钮渲染
                _this.uploader = WebUploader.create({
                    // swf文件路径
                    swf: '../plugin/webuploader/Uploader.swf',
                    // 文件接收服务端。
                    server: 'http://localhost/net-note/v1/attach/' + _this.editNoteInf.mid,
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
                    var files = _this.uploader.getFiles();
                    for (var i = 0; i < files.length; i++) {
                        _this.uploader.upload(files[i]);
                    }
                    $(".uploader-list").append("<h4>正在上传</h4>");
                });
                //文件添加列表（用户体验）
                _this.uploader.on('fileQueued', function (file) {
                    if (file.size > 30000000)
                        alert("上传文件过大！单个文件不能超过30M");
                    else {
                        $(".uploader-list").append("<div id=\"" + file.id + "\" class=\"item\">\n                    <h5 class=\"info\">" + file.name + "\n                    &nbsp<span class=\"state\">\u7B49\u5F85\u4E0A\u4F20...</span></h5>\n                    </div>");
                    }
                });
                //显示进度条
                _this.uploader.on("uploadProgress", function (file, percentage) {
                    console.log(file.name + " " + percentage);
                });
                //上传成功显示
                _this.uploader.on('uploadSuccess', function () {
                    _this.uploader.reset();
                    $(".uploader-list").empty()
                        .append("<h4>上传成功！</h4>");
                    setTimeout(" $(\".uploader-list\").empty()", 1500);
                    classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "note/" + _this.editNoteInf.mid + "/attach", "_method=GET", function () {
                    }, function () {
                    }, "post")
                        .then(function (result) {
                        $("#attachList").empty();
                        result.data.forEach(function (element) {
                            _this.addAttach2List(element.id, element.filename);
                        });
                    });
                });
                //上传失败显示
                _this.uploader.on("uploadError", function () {
                    _this.uploader.reset();
                    $(".uploader-list").empty()
                        .append("<h3>上传出错！！</h3>");
                    setTimeout(" $(\".uploader-list\").empty()", 1500);
                });
            };
            /**
             * 4.绑定删除附件按钮就
             */
            this.bindDeleteAttach = function () {
                //委托
                $("#attachList").on("click", function (eventObject) {
                    var $attach = $(eventObject.target);
                    if ($attach.attr("id") !== "attachList") {
                        classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "attach/" + $attach.attr("id"), "_method=DELETE", function () {
                        }, function () {
                        }, "post")
                            .then(function (result) {
                            $("#" + $attach.attr("id")).remove();
                        });
                    }
                });
            };
            //查看界面事件集
            /**
             * 1.附件下载按钮事件
             */
            this.bindDownload = function () {
                //标记
                //利用事件委托，委托到附件列表的上一级
                $("#attachList").on("click", function (eventObject) {
                    if ($(eventObject.target).attr("id") !== "attachList") {
                        window.location.href = "./v1/attach/" + $(eventObject.target).attr("id");
                    }
                });
            };
            //另外还有一个初始化页面的事件
            this.bindInitEvent = function () {
                //搜索
                _this.bindSearch();
                //编辑
                _this.bindEditNote();
                _this.bindDelete();
                _this.bindGoBack();
                //分享
                _this.bindShowShare();
                _this.bindAddShare();
                _this.bindDeleteShare();
                _this.bindCopyShare();
                //新建
                _this.bindNewNote();
                _this.bindNewDir();
            };
            //页面一共有查看、编辑、新建 三种界面
            this.bindViewEvent = function () {
                //附件下载
                _this.bindDownload();
            };
            this.bindEditEvent = function () {
                //保存
                _this.bindSaveNote();
                //添加标签
                _this.bindNewTag();
                //删除标签
                _this.bindDeleteTag();
                //删除附件
                _this.bindDeleteAttach();
                //上传附件
                _this.bindUpload();
            };
            this.bindNewEnent = function () {
                //大保存
                _this.bindSaveNote();
                //上传附件
                _this.bindUpload();
            };
            this.$select = $(select);
            this.select = select;
            this.editNoteInf = {
                mid: 1,
                pid: 1
            };
        }
        /**
         * 10.黏贴分享链接事件
         */
        NotePage.prototype.bindCopyShare = function () {
            var _this = this;
            //标记
            //找到最上层节点
            $("#copyShareUrl").on("click", function () {
                if (_this.leftStatus === LeftStatus.shareTree) {
                    var zTreeObj = $.fn.zTree.getZTreeObj("noteTree");
                    var selectedNode = _this.findTopNode();
                    var shareUrl = window.location.href + "/v1/share/page/" + selectedNode.name;
                    //拼接字符串 弹出输入框复制
                    window.prompt("请CTRL + C 复制后 ENTER 退出", shareUrl);
                }
            });
        };
        return NotePage;
    }());
    exports.NotePage = NotePage;
});
//# sourceMappingURL=notePage.js.map