/**
 * 页面用来展示笔记本的主页面
 */
import { EasyUIModule } from 'ts/declarations/easyui/components/easyui/easyui.module';

export class NotePage{
    public $select:JQuery;
    //笔记本主页面
    public $notePage =$(` <div class=\"col-xs-3 tree-div \">
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
                          </div>
                          <div class=\"col-xs-8\" id=\"textarea1\" >
             
                          </div>`);
    //笔记本编辑基础页面
    public $textArea = $(`<div class=\"form-group text-title\" id=\"textTitle\" >
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
    public $textView = $(`<div class=\'text-title\'>
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

    /**
     * 这个select一般是 "#content"
     * @param {string} select
     */
    constructor(select:string){
        this.$notePage.appendTo(select);
        this.$select = $(select);
    }

    /**
     * 绑定笔记基础页面的事件
     */
    public build():void{

    }

    /**
     * 查看笔记 （擦除原窗口 加入该窗口 绑定按钮事件）
     */
    public viewNote(){

    }

    /**
     * 笔记编辑页面 （擦除原窗口 加入该窗口 绑定按钮事件）
     */
    public editNote(){

    }

    /**
     * 笔记新建页面 （擦除原窗口 加入该窗口 绑定按钮事件）
     */
    public newNote(){

    }

    /**
     * 刷新树
     */
    public freshTree():void{
        let $tree = $("#tt3");
    }

    //主界面事件集
    /**
     * 1.树的双击事件
     */

    /**
     * 2.新建按钮事件（是否保存？->新建笔记界面）
     */

    /**
     * 3.编辑按钮事件（是否保存?->编辑笔记界面 || 编辑目录名）
     */

    /**
     * 4.删除按钮事件（确认删除?->删除）
     */

    /**
     * 5.回笔记中心按钮事件（刷新树为笔记树）
     */

    /**
     * 6.搜索事件（刷新树为搜索笔记树）
     */

    /**
     * 7.添加分享按钮事件
     */

    /**
     * 8.查看分享按钮事件
     */

    /**
     * 9.删除分享按钮事件
     */

    /**
     * 10.黏贴分享链接事件
     */



    //编辑界面事件集
    /**
     * 1.保存按钮事件（对于新建的笔记 先上传笔记，然后上传附件和添加标签；对于编辑的笔记，保存内容即可）
     */

    /**
     * 2.新建标签按钮事件
     */

    /**
     * 3.绑定上传按钮事件
     */

    //查看界面事件集
    /**
     * 1.附件下载按钮事件
     */



}