define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var NotePage = (function () {
        /**
         * 这个select一般是 "#content"
         * @param {string} select
         */
        function NotePage(select) {
            //笔记本主页面
            this.$notePage = $(" <div class=\"col-xs-3 tree-div \">\n                           <div class=\"text-title\" id=\"textTitle1\">\n                               <div class=\"form-group\" style='margin-bottom:0;min-height: 50px'>\n                                    <div class=\"btn-group pull-right\" >\n                                        <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                                            \u65B0\u5EFA <span class=\"caret\"></span>\n                                        </button>\n                                       <ul class=\"dropdown-menu\">\n                                         <li><a href=\"javascript:void(0)\" id='newNote'>\u7B14\u8BB0</a></li>\n                                         <li><a href=\"javascript:void(0)\" id='newDir'>\u76EE\u5F55</a></li>\n                                       </ul>\n                                    </div>\n\n                                     <div class=\"btn-group pull-right\" >\n                                       <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                                         \u5206\u4EAB <span class=\"caret\"></span>\n                                       </button>\n                                       <ul class=\"dropdown-menu\">\n                                         <li><a href=\"javascript:void(0)\" id='showShareBtn'>\u67E5\u770B\u5206\u4EAB</a></li>\n                                            <li role=\"separator\" class=\"divider\"></li>\n                                         <li><a href=\"javascript:void(0)\" id='addShareBtn'>\u6DFB\u52A0\u5230\u5206\u4EAB</a></li>\n                                         <li><a href=\"javascript:void(0)\" id='deleteShareBtn'>\u5220\u9664\u5206\u4EAB</a></li>\n                                            <li role=\"separator\" class=\"divider\"></li>\n                                         <li><a href=\"javascript:void(0)\" id='copyShareUrl'>\u590D\u5236\u5206\u4EAB\u94FE\u63A5</a></li>\n                                       </ul>\n                                     </div>\n\n                                     <div class=\"btn-group pull-right\" >\n                                       <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                                         \u7F16\u8F91 <span class=\"caret\"></span>\n                                       </button>\n                                       <ul class=\"dropdown-menu\">\n                                         <li><a href=\"javascript:void(0)\" id='editNote'>\u7F16\u8F91</a></li>\n                                         <li><a href=\"javascript:void(0)\" id='deleteNote'>\u5220\u9664</a></li>\n                                            <li role=\"separator\" class=\"divider\"></li>\n                                         <li><a href=\"javascript:void(0)\" id='showTree'>\u8FD4\u56DE\u7B14\u8BB0\u76EE\u5F55</a></li>\n                                       </ul>\n                                     </div>\n                                     <input id='tagSearchInput' type=\"text\" class=\"form-control tag-search\" style=\"float: left\"\n                                            placeholder=\"\u6309\u6807\u7B7E\u67E5\u627E \" id='searchNoteInput' >\n                                     <button class=\"btn btn-default search\"  type=\"button\" style=\"float: left\" id='searchNote'>Search</button>\n                                </div>\n \n                                <div>\n                                    <ul id=\"noteTree\" class=\"ztree\"></ul>        \n                                </div>\n                              </div>\n                          </div>\n                          <div class=\"col-xs-8\" id=\"textarea1\" >\n             \n                          </div>");
            //笔记本编辑基础页面
            this.$textArea = $("<div class=\"form-group text-title\" id=\"textTitle\" >\n                            <button class=\"btn btn-default btn-undef\" style=\"float: left\" id='textSaveBtn'>\u4FDD\u5B58</button>\n                            <input id='newTagInput' type=\"text\" class=\" tag-input\" placeholder=\"\u8F93\u5165\u6807\u7B7E\u6DFB\u52A0 \" >\n                            <button id='newTagBtn' class=\"btn btn-default btn-undef\" style=\"float: left;text-align: center\">\u6DFB\u52A0\u6807\u7B7E</button>\n\n                            <div class=\"btn-group\" id='tagDiv'>\n                              <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                                \u6807\u7B7E <span class=\"caret\"></span>\n                              </button>\n                              <ul class=\"dropdown-menu\" id='tagList'>\n                              </ul>\n                            </div>\n\n                            <div class=\"btn-group\" id='attachDiv'>\n                              <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                                \u9644\u4EF6 <span class=\"caret\"></span>\n                              </button>\n                              <ul class=\"dropdown-menu\" id='attachList'>\n                              </ul>\n                            </div>\n\n                            <br><label for='note-title' style='margin: 0 10px'>\u7B14\u8BB0\u6807\u9898</label><input class='note-title' id='note-title' >\n                        </div>\n                        <div id='sample' class='centor editor'>\n                            <textarea id='editor' name='editor' class='centor editor' style='width: 100%;height: 80%'></textarea>\n                        </div>\n\n                        <div id=\"uploader\" class=\"wu-example\">\n                             <!--\u7528\u6765\u5B58\u653E\u6587\u4EF6\u4FE1\u606F-->\n                             <div id=\"thelist\" class=\"uploader-list\">\n                             </div>\n                             <div class=\"btns\">\n                                 <span id=\"picker\">\u9009\u62E9\u6587\u4EF6</span>\n                                 <button id=\"ctlBtn\" class=\"btn btn-default\">\u5F00\u59CB\u4E0A\u4F20</button>\n                             </div>\n                        </div>");
            //笔记查看页面
            this.$textView = $("<div class='text-title'>\n                            <span id='textTitle' style='line-height: 50px'></span>\n\n                            <div class=\"btn-group pull-right\" id='tagDiv'>\n                                <button type=\"button\" class=\"btn btn-default dropdown-toggle btn-undef\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n\n                                    \u9644\u4EF6 <span class=\"caret\"></span>\n                                </button>\n                                <ul class=\"dropdown-menu\" id='attachList'>\n                                </ul>\n                            </div>\n                        </div>\n                        <div class='text-view' id='textView'>\n                        </div>");
            this.$notePage.appendTo(select);
            this.$select = $(select);
        }
        /**
         * 绑定笔记基础页面的事件
         */
        NotePage.prototype.build = function () {
        };
        /**
         * 查看笔记 （擦除原窗口 加入该窗口 绑定按钮事件）
         */
        NotePage.prototype.viewNote = function () {
        };
        /**
         * 笔记编辑页面 （擦除原窗口 加入该窗口 绑定按钮事件）
         */
        NotePage.prototype.editNote = function () {
        };
        /**
         * 笔记新建页面 （擦除原窗口 加入该窗口 绑定按钮事件）
         */
        NotePage.prototype.newNote = function () {
        };
        /**
         * 刷新树
         */
        NotePage.prototype.freshTree = function () {
            var $tree = $("#tt3");
        };
        return NotePage;
    }());
    exports.NotePage = NotePage;
});
//# sourceMappingURL=notePage.js.map