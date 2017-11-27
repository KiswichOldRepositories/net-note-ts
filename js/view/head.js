define(["require", "exports", "jquery", "es6-promise"], function (require, exports, $) {
    "use strict";
    exports.__esModule = true;
    /**
     * 用来处理网页头部的函数
     */
    var Head = (function () {
        /**
         * 传入参数为某一个选择器
         * @param {string} select
         */
        function Head(select) {
            /**
             * 网页头基本框架
             * @type {string}
             */
            this.$header = $("<div class=\"head\">\n          <a href=\"javascript:void(0)\"><img src=\"../images/logo2.png\" alt=\"logo\" id=\"logo\" class=\"logo\"></a>\n        </div>");
            /**
             *  PC端的导航栏
             * @type {string}
             */
            this.$headNav_PC = $("<span class=\"nav-control\"></span>");
            /**
             * 导航标签
             * @type {string}
             */
            this.$navTab = $("<ul class=\"nav\" id=\"nav-begin\">\n                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"2-net-disk\">\u7F51\u76D8\u4E2D\u5FC3</a></li>\n                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"about-us\">\u5173\u4E8E</a></li>\n                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signin\">\u6CE8\u518C</a></li>\n                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signup\">\u767B\u5F55</a></li>\n                </ul>");
            this.$header.appendTo(select);
        }
        /**
         * 构造导航栏
         */
        Head.prototype.build = function () {
            this.$headNav_PC.appendTo(this.$header);
            this.$navTab.appendTo(this.$headNav_PC);
            $("#nav-begin").on("click", function (eventObject) {
                switch ($(eventObject.target).text()) {
                    case "登录":
                        break;
                    case "注册":
                        break;
                    case "关于":
                        break;
                    case "网盘中心":
                        break;
                    case "退出登录":
                        break;
                }
            });
        };
        /**
         * 充值节点为登录注册页面
         * @param {navNode[]} nodes
         */
        Head.prototype.resetNav = function (nodes) {
            var _this = this;
            this.emptyNav();
            nodes.forEach(function (value, index) {
                _this.addNav(value);
            });
        };
        /**
         * 设置节点,在某个索引前插入一个元素
         * @param {navNode[]} nodes
         */
        Head.prototype.setNav = function (node, insertIndex) {
            var $nav = $("<li><a href=\"javascript:void(0)\">" + node.text + "</a></li>");
            $(this.$navTab.children()[insertIndex]).before($nav[0]);
            //添加属性
            for (var key in node.attrs) {
                $nav.attr(key, node.attrs[key]);
            }
        };
        Head.prototype.addNav = function (node) {
            //添加一个节点
            var $navNode = $("<li><a href=\"javascript:void(0)\">" + node.text + "</a></li>");
            this.$headNav_PC.append($navNode);
            //添加属性
            for (var key in node.attrs) {
                $navNode.attr(key, node.attrs[key]);
            }
        };
        /**
         * 根据标签名删除标签,(理论上不该有重复的标签)
         * @param {string} text
         */
        Head.prototype.deleteNav = function (text) {
            this.$navTab.children("li").each(function (index, elem) {
                if ($(elem).text() === text) {
                    $(elem).remove();
                    return;
                }
            });
        };
        /**
         * 清空导航栏
         */
        Head.prototype.emptyNav = function () {
            this.$navTab.empty();
        };
        return Head;
    }());
    exports.Head = Head;
});
//# sourceMappingURL=head.js.map