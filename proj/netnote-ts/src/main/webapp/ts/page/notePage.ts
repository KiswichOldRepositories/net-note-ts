import "nicEdit";
import WebUploader = require("Webuploader");

let web = WebUploader;

/**
 * 页面用来展示笔记本的主页面
 */
import {Ajax, AjaxResult} from "scooper.ajax";
import {ClassManager} from "../manager/classManager.js";
import {Constant} from "../constant.js";


/**
 *右边编辑页面的状态
 */
enum RightStatus {
    noPage = 0,
    editPage,
    newPage,
    viewPage
}

/**
 * 左边树的状态
 */
enum LeftStatus {
    noteTree = 0,
    shareTree,
    SearchTree
}

interface editedNote {
    mid: number,
    pid: number
}


export class NotePage {
    public $select: JQuery;
    //笔记本主页面
    public notePage: string = (`<div class=\"col-xs-3 tree-div \">
                            <div class=\"text-title\" id=\"textTitle1\">
                               <div class=\"form-group\" style='margin-bottom:0;min-height: 50px'>
                                    <div class=\"btn-group pull-right\" >
                                        <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                                            新建 <span class=\"caret\"></span>
                                        </button>
                                       <ul class=\"dropdown-menu\">
                                         <li><a href=\"javascript:void(0)\" id='newNote'>笔记</a></li>
                                         <li><a href=\"javascript:void(0)\" id='newDir'>目录</a></li>
                                       </ul>
                                    </div>

                                     <div class=\"btn-group pull-right\" >
                                       <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                                         分享 <span class=\"caret\"></span>
                                       </button>
                                       <ul class=\"dropdown-menu\">
                                         <li><a href=\"javascript:void(0)\" id='showShareBtn'>查看分享</a></li>
                                            <li role=\"separator\" class=\"divider\"></li>
                                         <li><a href=\"javascript:void(0)\" id='addShareBtn'>添加到分享</a></li>
                                         <li><a href=\"javascript:void(0)\" id='deleteShareBtn'>删除分享</a></li>
                                            <li role=\"separator\" class=\"divider\"></li>
                                         <li><a href=\"javascript:void(0)\" id='copyShareUrl'>复制分享链接</a></li>
                                       </ul>
                                     </div>

                                     <div class=\"btn-group pull-right\" >
                                       <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                                         编辑 <span class=\"caret\"></span>
                                       </button>
                                       <ul class=\"dropdown-menu\">
                                         <li><a href=\"javascript:void(0)\" id='editNote'>编辑</a></li>
                                         <li><a href=\"javascript:void(0)\" id='deleteNote'>删除</a></li>
                                            <li role=\"separator\" class=\"divider\"></li>
                                         <li><a href=\"javascript:void(0)\" id='showTree'>返回笔记目录</a></li>
                                       </ul>
                                     </div>
                                     <input id='tagSearchInput' type=\"text\" class=\"form-control tag-search\" style=\"float: left\"
                                            placeholder=\"按标签查找 \" id='searchNoteInput' >
                                     <button class=\"btn btn-default search\"  type=\"button\" style=\"float: left\" id='searchNote'>Search</button>
                                </div>
 
                                <div>
                                    <ul id="noteTree" class="ztree"></ul>        
                                </div>
                              </div>
                          </div>`);
    public text = (`<div class=\"col-xs-8\" id=\"textarea1\"></div>`);
    //笔记本编辑基础页面
    public textArea: string = (`<div class=\"form-group text-title\" id=\"textTitle\" >
                            <button class=\"btn btn-default btn-undef\" style=\"float: left\" id='textSaveBtn'>保存</button>
                            <input id='newTagInput' type=\"text\" class=\" tag-input\" placeholder=\"输入标签添加 \" >
                            <button id='newTagBtn' class=\"btn btn-default btn-undef\" style=\"float: left;text-align: center\">添加标签</button>

                            <div class=\"btn-group\" id='tagDiv'>
                              <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                                标签 <span class=\"caret\"></span>
                              </button>
                              <ul class=\"dropdown-menu\" id='tagList'>
                              </ul>
                            </div>

                            <div class=\"btn-group\" id='attachDiv'>
                              <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                                附件 <span class=\"caret\"></span>
                              </button>
                              <ul class=\"dropdown-menu\" id='attachList'>
                              </ul>
                            </div>

                            <br><label for='note-title' style='margin: 0 10px'>笔记标题</label><input class='note-title' id='note-title' >
                        </div>
                        <div id='sample' class='centor editor'>
                            <textarea id='editor' name='editor' class='centor editor' style='width: 100%;height: 80%'></textarea>
                        </div>
                        <div id=\"uploader\" class=\"wu-example\">
                             <!--用来存放文件信息-->
                             <div id=\"thelist\" class=\"uploader-list\">
                             </div>
                             <div class=\"btns\">
                                 <span id=\"picker\">选择文件</span>
                                 <button id=\"ctlBtn\" class=\"btn btn-default\">开始上传</button>
                             </div>
                        </div>`);
    //笔记查看页面
    public textView: string = (`<div class=\'text-title\'>
                            <span id='textTitle' style='line-height: 50px'></span>

                            <div class=\"btn-group pull-right\" id='tagDiv'>
                                <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n
                                    附件 <span class=\"caret\"></span>
                                </button>
                                <ul class=\"dropdown-menu\" id='attachList'>
                                </ul>
                            </div>
                        </div>
                        <div class=\'text-view\' id=\'textView\'>
                        </div>`);

    public select: string;

    /**
     * 右边状态表示位
     * @type {number} {0:初始状态,1:编辑页面,2:新建页面,3:查看页面}
     */
    private rightStatus: RightStatus;

    /**
     * 左边状态表示位
     * @type {number} {0:目录树，1：分享树，2：标签搜索树}
     */
    private leftStatus: LeftStatus;

    private editNoteInf: editedNote;

    private uploader: webUploaderEntry;

    /**
     * 这个select一般是 "#content"
     * @param {string} select
     */
    constructor(select: string) {
        this.$select = $(select);
        this.select = select;
        this.editNoteInf = {
            mid: 1,
            pid: 1
        };
    }

    private ajax = new Ajax("");

    /**
     * 绑定笔记基础页面的事件
     */
    public build = (): void => {
        $(this.select).append(this.notePage);
        // this.$notePage.c
        $(this.select).append(this.text);

        //改变状态
        this.rightStatus = RightStatus.noPage;
        this.bindInitEvent();
        this.freshTree(Constant.urlHead + "dir/ztree");
    };

    /**
     * 擦除右边的显示界面
     */
    private clean = (): void => {
        $("#textarea1").empty();
        //this.$text.empty();
    };

    /**
     * 擦除整个页面
     */
    private close = (): void => {
        this.$select.empty();
        this.rightStatus = RightStatus.noPage;
        this.leftStatus = LeftStatus.noteTree;
    };


    /**
     * 在页面上添加标签
     */
    public addTag2List = (tagId: number, tagName: string) => {
        $("#tagList").append(`<li><a href=\"javascript:void(0)\" name='${tagName}' id='${tagId}'>${tagName}<span class=\"glyphicon glyphicon-remove pull-right\"></span></a></li>`)
    };

    /**
     * 在页面上加入附件(下载)
     */
    public addAttach2List = (nodeId: number, fileName: string): void => {
        $("#attachList").append(`<li><a href=\"javascript:void(0)\" id='${nodeId}'>${fileName}<span class=\"glyphicon glyphicon-arrow-down pull-right\"></a></li>`);
    };

    /**
     * 页面上加入附件（删除）
     */
    public addAttach2ListDelete = (nodeId: number, fileName: string): void => {
        $("#attachList").append(`<li><a href=\"javascript:void(0)\" id='${nodeId}'>${fileName}<span class=\"glyphicon glyphicon-remove pull-right\"></a></li>`);
    };

    /**
     * 根据所选的节点找到最上层的节点
     */
    public findTopNode = (): any => {
        let zTreeObj = $.fn.zTree.getZTreeObj("noteTree");
        let selectedNode = zTreeObj.getSelectedNodes()[0];
        if (selectedNode !== undefined) {
            let parentNode = selectedNode.getParentNode();
            while (parentNode !== null) {
                selectedNode = parentNode;
                parentNode = selectedNode.getParentNode();
            }
            return selectedNode;
        } else {
            return null;
        }

    };

    /**
     * 笔记编辑页面 （擦除原窗口 加入该窗口 绑定按钮事件）
     */
    public editNote = (note: editedNote): void => {
        this.clean();
        $("#textarea1").append(this.textArea);
        nicEditors.allTextAreas();
        //样式调整
        $(".nicEdit-main").addClass("text-area");
        $(".nicEdit-main").css("overflow-y", "auto");

        //标记
        //获取笔记数据
        ClassManager.ajax.request(Constant.urlHead + "note/" + note.mid, "_method=GET")
            .then((result: AjaxResult) => {
                //填充数据
                $("#note-title").val(result.data.noteName);
                nicEditors.findEditor("editor").setContent(result.data.noteText);

                //填充标签
                ClassManager.ajax.request(Constant.urlHead + "tag/" + note.mid, "_method=GET")
                    .then((result: AjaxResult) => {
                        result.data.forEach((element: any) => {
                            this.addTag2List(element.tagName, element.id);
                        });
                    });

                //填充附件
                ClassManager.ajax.request(Constant.urlHead + "note/" + note.mid + "/attach", "_method=GET")
                    .then((result: AjaxResult) => {
                        result.data.forEach((element: any) => {
                            this.addAttach2ListDelete(element.id, element.filename);
                        });

                    });
                //改变状态
                this.rightStatus = RightStatus.editPage;
                this.editNoteInf = note;

                //绑定事件
                this.bindEditEvent();
            });


    };

    /**
     * 笔记新建页面 （擦除原窗口 加入该窗口 绑定按钮事件）
     */
    public newNote = (note: editedNote): void => {
        this.clean();
        // this.$textArea.appendTo(this.$text);
        $("#textarea1").append(this.textArea);
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
        this.rightStatus = RightStatus.newPage;
        this.editNoteInf = note;
        //绑定事件
        this.bindNewEnent();
    };

    /**
     * 笔记查看页面（擦除原窗口 加入该窗口 绑定按钮事件）
     */
    public viewNote = (note: editedNote): void => {
        this.clean();
        $("#textarea1").append(this.textView);

        //还需填充
        ClassManager.ajax.request(Constant.urlHead + "note/" + note.mid)
            .then((result: AjaxResult) => {
                $("#textTitle").html(result.data.noteName);
                $("#textView").html(result.data.noteText);
                //接着填充附件下载
                ClassManager.ajax.request(Constant.urlHead + "note/" + note.mid + "/attach")
                    .then((result: AjaxResult) => {
                        //填充附件下载栏
                        result.data.forEach((element: any) => {
                            this.addAttach2List(element.id, element.filename);
                        });
                    });

                //改变状态
                this.rightStatus = RightStatus.viewPage;
                //绑定事件
                this.bindViewEvent();
                console.log(111);
            });

    };

    /**
     * 保存笔记(新)
     * callback:最后会调用的回调函数
     */
    private saveNewNote = (callback?: Function): any => {
        let newNoteId: number;
        ClassManager.ajax.request(Constant.urlHead + "note/" + this.editNoteInf.pid,
            "noteName=" + encodeURIComponent($("#note-title").val()) + "&noteText=" + encodeURIComponent(nicEditors.findEditor("editor").getContent())
            , () => {
            }, () => {
            }, "post")
            .then((result: AjaxResult) => {
                this.editNoteInf = {
                    mid: result.data.id * 2,
                    pid: result.data.parentDirId * 2 + 1
                };
                newNoteId = result.data.id * 2;//id转换
                //在目录树中添加笔记
                let zTreeObj = $.fn.zTree.getZTreeObj("noteTree");
                zTreeObj.addNodes(zTreeObj.getNodeByParam("id", String(this.editNoteInf.pid)), {
                    id: result.data.id * 2,
                    pId: result.data.parentDirId * 2 + 1,
                    name: result.data.noteName,
                    isParent: false
                });

                //将每一个标签上传到后台
                let split: string[] = $("#newTagInput").val().split(" ");
                $.each(split, (index: number, element: string) => {
                    ClassManager.ajax.request(Constant.urlHead + "tag/" + String(newNoteId), "tagName=" + encodeURIComponent(element)
                        , () => {
                        }, () => {
                        }, "post")
                        .then((result: AjaxResult) => {
                        });
                });

                //将之前的附件全部上传、、标记(目前会失败 因此先try-catch)
                try {
                    var files = this.uploader.getFiles();
                    this.uploader.option("server", "http://localhost/net-note/v1/attach/" + result.data.id * 2);
                    for (var i = 0; i < files.length; i++) {
                        this.uploader.upload(files[i]);
                    }
                    $(".uploader-list").append("<h4>正在上传</h4>");
                } catch (e) {
                }
                callback();
            });

    };

    /**
     * 保存笔记（编辑）
     * callback:最后会调用的回调函数
     */
    private saveEditNote = (callback?: Function): any => {
        ClassManager.ajax.request(Constant.urlHead + "note/" + String(this.editNoteInf.mid), "text=" + encodeURIComponent(nicEditors.findEditor("editor").getContent())
            + "&noteName=" + encodeURIComponent($("#note-title").val()) + "&_method=PUT"
            , () => {
            }, () => {
            }, "post")
            .then((result: AjaxResult) => {
                //标记 保存完之后做什么
                this.editNoteInf = {
                    mid: result.data.id * 2,
                    pid: result.data.parentDirId * 2 + 1
                };
                //更新树
                let zTreeObj = $.fn.zTree.getZTreeObj("noteTree");
                let param = zTreeObj.getNodeByParam("id", result.data.id * 2);
                param.name = result.data.noteName;
                callback();
            }).catch(() => {
        });
    };

    /**
     * 判断是否在编辑/新建状态 并确实是否要保存
     */
    private isOnWorking = (): void => {
        switch (this.rightStatus) {
            case RightStatus.editPage:
                if (window.confirm("正在编辑，是否要保存？")) {
                    //标记
                    //写一个通用的保存方法
                    this.saveEditNote();
                }
                break;
            case RightStatus.newPage:
                if (window.confirm("正在新建，是否要保存？")) {
                    //标记
                    this.saveNewNote();
                }
                break;
            default:
                break;
        }
    };

    /**
     * 刷新树 传入与服务器交互的url
     */
    public freshTree = (url: string): void => {

        let setting = {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            }, async: {
                enable: false,
            }
            , callback: {
                onDblClick: this.bindTreeDoubleClick,
                asyncSuccess: (data: any) => {
                    console.log(data);
                },//异步加载成功的fun
            }
        };
        ClassManager.ajax.request(url).then((result: AjaxResult) => {
            $.fn.zTree.init($("#noteTree"), setting, result.data);
        });
    };

    /**
     * 通用的刷新树(parma是一个map)
     */
    public freshTreeUs = (url: string, parma: any) => {
        let parmaString: string = "";
        for (let index in parma) {
            if (index !== "_method") {
                if (parmaString.trim() === "") parmaString = index + "=" + encodeURIComponent(parma[index]);
                else parmaString = parmaString + "&" + index + "=" + encodeURIComponent(parma[index]);

            } else {//对于method
                if (parmaString.trim() === "") parmaString = index + "=" + parma[index];
                else parmaString = parmaString + "&" + index + "=" + parma[index];
            }
        }
        //经检验 得到的应该string达标
        let setting = {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid",
                    rootPId: 0
                }
            }, async: {
                enable: false,
            }
            , callback: {
                onDblClick: this.bindTreeDoubleClick,
                asyncSuccess: (data: any) => {
                    console.log(data);
                },//异步加载成功的fun
            }
        };
        ClassManager.ajax.request(url, parmaString).then((result: AjaxResult) => {
            $.fn.zTree.init($("#noteTree"), setting, result.data);
        });


    };

    //主界面事件集
    /**
     * 1.树的双击事件
     */
    public bindTreeDoubleClick = (event: any, treeId: string, treeNode: any): void => {
        // console.log(event);
        // console.log(treeId);
        console.log(treeNode);
        if (treeNode.id % 2 == 1) {//ztree已经做了展开功能
        } else if (treeNode.id % 2 == 0) {
            //判断是否处于编辑状态
            this.isOnWorking();
            //记录笔记的信息
            this.editNoteInf = {
                mid: treeNode.id,
                pid: treeNode.pid
            };

            console.log(this);
            //触发浏览一个笔记的事件
            if (this.leftStatus == LeftStatus.noteTree || this.leftStatus == LeftStatus.shareTree) {//左边是基本树和分享树的情况
                this.viewNote({
                    mid: treeNode.id,
                    pid: treeNode.getParentNode().id
                });
            } else {//左边是搜索树的情况
                this.viewNote({
                    mid: treeNode.id,
                    pid: 0
                });

            }

        }
    };

    /**
     * 2.新建按钮事件（是否保存？->新建笔记界面）
     */
    public bindNewNote = (): void => {
        //标记
        //先判断是否在编辑状态
        $("#newNote").on("click", () => {
            //判断是否在选择状态
            let selectedNode = $.fn.zTree.getZTreeObj("noteTree").getSelectedNodes()[0];

            if (selectedNode !== undefined) {
                //选中文件夹
                if (selectedNode.id % 2 == 0) selectedNode = selectedNode.getParentNode();
                //判断是否处于编辑状态
                this.isOnWorking();
                this.newNote({
                    mid: 0,
                    pid: selectedNode.id
                });
                //更新状态
                this.editNoteInf.mid = 0;
                this.editNoteInf.pid = selectedNode.id;
                this.rightStatus = RightStatus.newPage;
            }
        });
        //若在 则提示是否需要保存

        //然后打开一个新的编辑页面
    };

    /**
     * 2.5 新建目录按钮事件
     */
    public bindNewDir = (): void => {

        $("#newDir").on("click", () => {

            let prompt = window.prompt("请输入要新建的目录名");
            if (prompt !== "") { //输入值不为空的情况
                let treeObj = $.fn.zTree.getZTreeObj("noteTree");
                let selectedNode = treeObj.getSelectedNodes()[0];
                if (selectedNode.id % 2 == 0) selectedNode = selectedNode.getParentNode(); //当选中的是笔记时 使用他的父节点


                ClassManager.ajax.request(Constant.urlHead + "dir/" + selectedNode.id, "name=" + encodeURIComponent(prompt)
                    , () => {
                    }, () => {
                    }, "post")
                    .then((result: AjaxResult) => {
                        //键入该节点,使其正好在目录最下面
                        let index: number = 0;
                        let children = selectedNode.children;
                        if(children===undefined){
                            treeObj.addNodes(selectedNode,{
                                id: result.data.id * 2 + 1,
                                    pId: result.data.parentId * 2 + 1,
                                    name: result.data.dirName,
                                    isParent: true
                            });
                        }else{
                            children.forEach((element: any) => {
                                if (element.isParent == true) {
                                    index = treeObj.getNodeIndex(element) + 1;
                                    return;
                                }
                            });
                            treeObj.addNodes(selectedNode, index, {
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
    public bindEditNote = (): void => {
        //标记
        //先判断是编辑目录还是笔记
        $("#editNote").on("click", () => {
            let selectedNode = $.fn.zTree.getZTreeObj("noteTree").getSelectedNodes()[0]; //在多选情况下，只看第一个节点
            if (selectedNode !== undefined) {
                if (selectedNode.id % 2 == 1) { //选中的是文件夹
                    let dirName = window.prompt("请输入修改后的文件夹名", selectedNode.name);
                    if (dirName !== selectedNode.name && dirName.trim() !== "") {
                        ClassManager.ajax.request(Constant.urlHead + "/dir/" + selectedNode.id, "name=" + encodeURIComponent(dirName) + "&_method=PUT"
                            , () => {
                            }, () => {
                            }, "post")
                            .then((result: AjaxResult) => {
                                //更新完目录名后要做的事（更新树）,标记 下面的方法可能无效
                                selectedNode.name = dirName;
                            });
                    }
                } else if (selectedNode.id % 2 == 0) {
                    //判断是否在编辑状态 并做出相应处理
                    this.isOnWorking();
                    //编辑笔记
                    this.editNote({
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
    public bindDelete = (): void => {
        //判断该笔记是否在打开状态

        $("#deleteNote").on("click", () => {
            let treeObj = $.fn.zTree.getZTreeObj("noteTree");
            let selectedNode = treeObj.getSelectedNodes()[0];
            if (selectedNode.id % 2 == 0) {//删除笔记
                if (window.confirm("是否要删除该笔记： " + selectedNode.name)) {
                    ClassManager.ajax.request(Constant.urlHead + "note/" + selectedNode.id, "_method=DELETE"
                        , () => {
                        }, () => {
                        }, "post")
                        .then((result: AjaxResult) => {
                            //删除之后要干的事情 删除树的节点
                            treeObj.removeNode(selectedNode, false);
                        });
                }

            } else { //删除目录
                if (window.confirm("是否要删除该目录： " + selectedNode.name)) {
                    ClassManager.ajax.request(Constant.urlHead + "dir/" + selectedNode.id, "_method=DELETE"
                        , () => {
                        }, () => {
                        }, "post")
                        .then((result: AjaxResult) => {
                            //删除之后要干的事，删除目录节点
                            treeObj.removeNode(selectedNode, false);
                        });

                }
            }

            if (this.rightStatus == RightStatus.editPage || this.rightStatus == RightStatus.viewPage && this.editNoteInf.mid == selectedNode.id) {
                //如果打开的笔记 在所删除的内容里面，应该关闭该笔记回到空白页面 nopage
                //标记
            }
        });

        //在则提示 不在则删除

    };

    /**
     * 5.回笔记中心按钮事件（刷新树为笔记树）
     */
    public bindGoBack = (): void => {
        //标记
        //刷新树
        $("#showTree").on("click", () => {
            $("#noteTree").empty();
            this.freshTree(Constant.urlHead + "dir/ztree");
        });

        this.leftStatus = LeftStatus.noteTree;

    };


    /**
     * 6.搜索事件（刷新树为搜索笔记树）
     */
    public bindSearch = (): void => {
        //标记
        //根据结果刷新树
        $("#searchNote").on("click", () => {
            //判断空值
            if ($("#tagSearchInput").val().trim() !== "") {
                let tagsWithSapce = $("#tagSearchInput").val();
                let split = tagsWithSapce.split(" ");
                let tags: string = split.join(";");
                //提交搜索
                //根据搜索的结果刷新树
                this.freshTreeUs(Constant.urlHead + "/note/ztree", {
                    tags: tags,
                    _method: "GET"
                });
                this.leftStatus = LeftStatus.SearchTree;
            }
        });
    };

    /**
     * 7.添加分享按钮事件
     */
    public bindAddShare = (): void => {

        //提交服务器
        $("#addShareBtn").on("click", () => {
            //在笔记树的情况下，此按钮有效
            if (this.leftStatus === LeftStatus.noteTree) {
                let selectedNode = $.fn.zTree.getZTreeObj("noteTree").getSelectedNodes()[0];
                //检查是否选中
                if (selectedNode !== undefined) {
                    ClassManager.ajax.request(Constant.urlHead + "share/" + selectedNode.id, {}, () => {
                    }, () => {
                    }, "post")
                        .then((result: AjaxResult) => {
                            //刷新树 也可以不管
                        });
                }
            }

        });
    };


    /**
     * 8.查看分享按钮事件
     */
    public bindShowShare = (): void => {
        //标记
        $("#showShareBtn").on("click", () => {

            //提交 刷新树
            this.freshTreeUs(Constant.urlHead + "share/ztree", {
                _method: "GET"
            });
            this.leftStatus = LeftStatus.shareTree;

        });
    };

    /**
     * 9.删除分享按钮事件
     */
    public bindDeleteShare = (): void => {
        $("#deleteShareBtn").on("click", () => {
            if (this.leftStatus === LeftStatus.shareTree) {//在分享树的情况下，此按钮有效
                //找到最上层节点
                let zTreeObj = $.fn.zTree.getZTreeObj("noteTree");
                let selectedNode = this.findTopNode();
                if (selectedNode !== null) {//选中了节点的情况
                    if (window.confirm("即将删除分享，请确认")) {
                        //发送删除
                        ClassManager.ajax.request(Constant.urlHead + "share/" + (-selectedNode.id), "_method=DELETE"
                            , () => {
                            }, () => {
                            }, "post")
                            .then((result: AjaxResult) => {
                                //删除树节点
                                zTreeObj.removeNode(selectedNode, false);
                            });
                    }
                }
            }

        });
    };

    /**
     * 10.黏贴分享链接事件
     */
    public bindCopyShare(): void {
        //标记
        //找到最上层节点
        $("#copyShareUrl").on("click", () => {
            if (this.leftStatus === LeftStatus.shareTree) {//分享树的情况下，此按钮有效
                let zTreeObj = $.fn.zTree.getZTreeObj("noteTree");
                let selectedNode = this.findTopNode();
                let shareUrl: string = window.location.href + "/v1/share/page/" + selectedNode.name;
                //拼接字符串 弹出输入框复制
                window.prompt("请CTRL + C 复制后 ENTER 退出", shareUrl);
            }
        });
    }


    //编辑界面事件集
    /**
     * 1.保存按钮事件（对于新建的笔记 先上传笔记，然后上传附件和添加标签；对于编辑的笔记，保存内容即可）
     */
    public bindSaveNote = (): void => {
        //标记
        $("#textSaveBtn").on("click", () => {
            //判断是新建的笔记还是编辑的笔记

            if (this.rightStatus === RightStatus.newPage) {
                //新建的 先上传笔记，然后上传附件和添加标签
                this.saveNewNote(
                    () => {
                        //最后跳转
                        this.viewNote({
                            mid: this.editNoteInf.mid,
                            pid: this.editNoteInf.pid
                        });
                    }
                );
            } else if (this.rightStatus === RightStatus.editPage) {
                //编辑的 直接保存内容（附件和标签在过程中就保存了）
                this.saveEditNote(() => {
                    //最后跳转
                    this.viewNote({
                        mid: this.editNoteInf.mid,
                        pid: this.editNoteInf.pid
                    });
                });
            }
        });
    };

    /**
     * 2.新建标签按钮事件
     */
    public bindNewTag = (): void => {
        //标记
        $("#newTagBtn").on("click", () => {

            //上传到服务器
            ClassManager.ajax.request(Constant.urlHead + "tag/" + String(this.editNoteInf.mid), "tagName=" + encodeURIComponent($("#newTagInput").val()) + "&_method=POST"
                , () => {
                }, () => {
                }, "post")
                .then((result: AjaxResult) => {
                    //添加到标签栏
                    this.addTag2List(result.data.id, result.data.tagName);
                });
        });
    };

    /**
     * 2.5删除标签事件
     */
    public bindDeleteTag = (): void => {
        //委托
        $("#tagList").on("click", (eventObject: any) => {
            let $tag = $(eventObject.target);

            //删除标签
            ClassManager.ajax.request(Constant.urlHead + "tag/" + $tag.attr("id"), "_method=DELETE"
                , () => {
                }, () => {
                }, "post")
                .then((result: AjaxResult) => {
                    //删除标签
                    $(`#${$tag.attr("id")}`).remove();
                });
        });
    };

    /**
     * 3.绑定上传按钮事件
     */
    public bindUpload = (): void => {


        //标记
        //这是webupload的上传插件
//按钮渲染
        this.uploader = WebUploader.create({
            // swf文件路径
            swf: '../plugin/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: 'http://localhost/net-note/v1/attach/' + this.editNoteInf.mid,
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
        $("#ctlBtn").on("click", () => {
            var files = this.uploader.getFiles();
            for (var i = 0; i < files.length; i++) {
                this.uploader.upload(files[i]);
            }
            $(".uploader-list").append("<h4>正在上传</h4>");
        });

        //文件添加列表（用户体验）
        this.uploader.on('fileQueued', (file: webuploaderFile) => {
            if (file.size > 30000000) alert("上传文件过大！单个文件不能超过30M");
            else {
                $(".uploader-list").append(`<div id="${file.id}" class="item">
                    <h5 class="info">${file.name}
                    &nbsp<span class="state">等待上传...</span></h5>
                    </div>`);
            }
        });
        //显示进度条
        this.uploader.on("uploadProgress", (file: webuploaderFile, percentage: number) => {
            console.log(file.name + " " + percentage);

        });


        //上传成功显示
        this.uploader.on('uploadSuccess', () => {
            this.uploader.reset();
            $(".uploader-list").empty()
                .append("<h4>上传成功！</h4>");

            setTimeout(" $(\".uploader-list\").empty()", 1500);

            ClassManager.ajax.request(Constant.urlHead + "note/" + this.editNoteInf.mid + "/attach", "_method=GET"
                , () => {
                }, () => {
                }, "post")
                .then((result: AjaxResult) => {
                    $("#attachList").empty();
                    result.data.forEach((element: any) => {
                        this.addAttach2List(element.id, element.filename);
                    });

                });


        });
        //上传失败显示
        this.uploader.on("uploadError", () => {
            this.uploader.reset();

            $(".uploader-list").empty()
                .append("<h3>上传出错！！</h3>");

            setTimeout(" $(\".uploader-list\").empty()", 1500);
        });
    };

    /**
     * 4.绑定删除附件按钮就
     */
    public bindDeleteAttach = (): void => {
        //委托
        $("#attachList").on("click", (eventObject) => {

            let $attach = $(eventObject.target);
            if ($attach.attr("id") !== "attachList") {
                ClassManager.ajax.request(Constant.urlHead + "attach/" + $attach.attr("id"), "_method=DELETE"
                    , () => {
                    }, () => {
                    }, "post")
                    .then((result: AjaxResult) => {
                        $(`#${$attach.attr("id")}`).remove();
                    });
            }
        });
    };

    //查看界面事件集
    /**
     * 1.附件下载按钮事件
     */
    public bindDownload = (): void => {
        //标记
        //利用事件委托，委托到附件列表的上一级

        $("#attachList").on("click", (eventObject: any) => {
            if ($(eventObject.target).attr("id") !== "attachList") {//去掉父元素本身的点击
                window.location.href = "./v1/attach/" + $(eventObject.target).attr("id");
            }
        });
    };

    //另外还有一个初始化页面的事件
    public bindInitEvent = (): void => {
        //搜索
        this.bindSearch();
        //编辑
        this.bindEditNote();
        this.bindDelete();
        this.bindGoBack();
        //分享
        this.bindShowShare();
        this.bindAddShare();
        this.bindDeleteShare();
        this.bindCopyShare();

        //新建
        this.bindNewNote();
        this.bindNewDir();
    };
    //页面一共有查看、编辑、新建 三种界面
    public bindViewEvent = (): void => {
        //附件下载
        this.bindDownload();
    };

    public bindEditEvent = (): void => {
        //保存
        this.bindSaveNote();
        //添加标签
        this.bindNewTag();
        //删除标签
        this.bindDeleteTag();
        //删除附件
        this.bindDeleteAttach();
        //上传附件
        this.bindUpload();
    };

    public bindNewEnent = (): void => {
        //大保存
        this.bindSaveNote();
        //上传附件
        this.bindUpload();
    };
}