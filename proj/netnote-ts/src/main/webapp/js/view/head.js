define(["require", "exports", "../manager/classManager.js", "../constant.js"], function (require, exports, classManager_js_1, constant_js_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * 用来处理网页头部的函数
     */
    var Head = /** @class */ (function () {
        /**
         * 传入参数为某一个选择器
         * @param {string} select
         */
        function Head(select) {
            var _this = this;
            /**
             * 网页头基本框架
             * @type {string}
             */
            this.header = ("<div class=\"head\">\n          <a href=\"javascript:void(0)\"><img src=\"/net-note/images/logo2.png\" alt=\"logo\" id=\"logo\" class=\"logo\"></a>\n        </div>");
            /**
             *  PC端的导航栏
             * @type {string}
             */
            this.headNav_PC = ("<span class=\"nav-control\"></span>");
            /**
             * 导航标签
             * @type {string}
             */
            this.navTab = ("<ul class=\"nav\" id=\"nav-begin\">\n                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"2-net-disk\">\u7F51\u76D8\u4E2D\u5FC3</a></li>\n                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"about-us\">\u5173\u4E8E</a></li>\n                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signin\">\u6CE8\u518C</a></li>\n                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signup\">\u767B\u5F55</a></li>\n                </ul>");
            /**
             * 构造导航栏
             */
            this.build = function () {
                // this.$headNav_PC.appendTo(".head");
                // console.log(this.$navTab[0]);
                // this.$navTab.appendTo(".nav-control");
                $(".nav-control").append(_this.navTab);
                $("#nav-begin").on("click", function (eventObject) {
                    switch ($(eventObject.target).text()) {
                        case "登录":
                            _this.bindSignup();
                            break;
                        case "注册":
                            _this.bindSignin();
                            break;
                        case "关于":
                            _this.bindAbout();
                            break;
                        case "网盘中心":
                            _this.bind2Disk();
                            break;
                        case "退出登录":
                            _this.bindLogout();
                            break;
                    }
                });
            };
            /**
             * 清空导航栏
             */
            this.destory = function () {
                $(".nav-control").empty();
            };
            /**
             * 充值节点为登录注册页面
             * @param {navNode[]} nodes
             */
            this.resetNav = function (nodes) {
                _this.emptyNav();
                nodes.forEach(function (value, index) {
                    _this.addNav(value);
                });
            };
            /**
             * 设置节点,在某个索引前插入一个元素
             * @param {navNode} node
             * @param {number} insertIndex
             */
            this.setNav = function (node, insertIndex) {
                var $nav = $("<li><a href=\"javascript:void(0)\">" + node.text + "</a></li>");
                $($("#nav-begin").children()[insertIndex]).before($nav[0]);
                //添加属性
                for (var key in node.attrs) {
                    $nav.attr(key, node.attrs[key]);
                }
            };
            this.addNav = function (node) {
                //添加一个节点
                var $navNode = $("<li><a href=\"javascript:void(0)\">" + node.text + "</a></li>");
                // this.$headNav_PC.append($navNode);
                $(".nav-control").append($navNode);
                //添加属性
                for (var key in node.attrs) {
                    $navNode.attr(key, node.attrs[key]);
                }
            };
            /**
             * 根据标签名删除标签,(理论上不该有重复的标签)
             * @param {string} text
             */
            this.deleteNav = function (text) {
                $("#nav-begin").children("li").each(function (index, elem) {
                    if ($(elem).text() === text) {
                        console.log(elem);
                        $(elem).remove();
                        return;
                    }
                });
            };
            /**
             * 清空导航栏
             */
            this.emptyNav = function () {
                // this.$navTab.empty();
                $("#nav-begin").empty();
            };
            //事件集
            /**
             * 1.登录按钮（登录页面）
             */
            this.bindSignup = function () {
                $("#content").empty();
                classManager_js_1.ClassManager.signupPage.build();
            };
            /**
             * 2.注册按钮（注册页面）
             */
            this.bindSignin = function () {
                $("#content").empty();
                classManager_js_1.ClassManager.signinPage.build();
            };
            /**
             * 3.退出登录按钮（欢迎页面）
             */
            this.bindLogout = function () {
                classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "user/signout", {}, function () { }, function () { }, "post")
                    .then(function (result) {
                    $("#content").empty();
                    classManager_js_1.ClassManager.hellopage.build();
                    _this.destory();
                    _this.build();
                })["catch"](function (result) {
                    alert(result.message);
                });
            };
            /**
             * 4.网盘中心按钮（跳转到网盘）
             */
            this.bind2Disk = function () {
            };
            /**
             * 5.关于按钮
             */
            this.bindAbout = function () {
            };
            // this.$header.appendTo(select);
            $(select).append(this.header);
            $(".head").append(this.headNav_PC);
            this.select = select;
        }
        /**
         * 创建一个用户登录状态的导航栏
         * @param {string} username
         */
        Head.prototype.buildUser = function (username) {
            this.deleteNav("登录");
            this.deleteNav("注册");
            $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"logout\">\u9000\u51FA\u767B\u5F55</a></li>");
            $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"navtext\">\u6B22\u8FCE\u56DE\u6765 " + username + "</a></li>");
        };
        return Head;
    }());
    exports.Head = Head;
});
//# sourceMappingURL=head.js.map