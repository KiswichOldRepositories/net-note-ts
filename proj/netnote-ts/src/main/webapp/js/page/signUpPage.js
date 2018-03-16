define(["require", "exports", "../constant.js", "../manager/classManager.js"], function (require, exports, constant_js_1, classManager_js_1) {
    "use strict";
    exports.__esModule = true;
    var SignUpPage = /** @class */ (function () {
        function SignUpPage(select) {
            var _this = this;
            this.page = ("<div class=\"signup\">\n                            <div class=\"col-xs-7\">\n                                <img src=\"/" + constant_js_1.Constant.projName + "/images/sign.png\" alt=\"\" class=\"sign-img img-responsive\">\n                            </div>\n                            <div class=\"col-xs-5\"> \n                                <form class=\"form-inline sign-form\" style=\"padding: 40px;width:400px \">\n                                    <h1 style=\"text-align: center;margin-bottom: 30px\">\u767B\u5F55</h1>\n                                    <form class=\"form-inline\">\n                                    <div class=\"form-group\">\n                                         <div class=\"input-group\">\n                                            <div class=\"input-group-addon\"><label for=\"username\">username</label></div>\n                                            <input type=\"pa\" class=\"form-control\" id=\"username\" placeholder=\"\u8F93\u5165\u5E10\u53F7\">\n                                         </div>\n                                    </div>\n                                    <div class=\"form-group\">\n                                        <div class=\"input-group\">\n                                            <div class=\"input-group-addon\"><label for=\"password\">password</label></div>\n                                            <input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"\u8F93\u5165\u5BC6\u7801\">\n                                        </div>\n                                    </div>  \n                                    <button type=\"button\" class=\"btn btn-success\" style=\"margin-top: 20px\" id='signup_btn'>Sign Up</button>\n                                    <button type=\"button\" class=\"btn btn-success\" style=\"margin-top: 20px\" id='2signIn'>To Sign In</button>\n                                    </form>   \n                                </form>\n                            </div>\n                       </div>");
            this.destory = function () {
                $(_this.select).empty();
            };
            //事件集
            /**
             * 1.登录按钮事件
             */
            this.bindSignup = function () {
                $("#signup_btn").on("click", function () {
                    var username = $("#username").val();
                    var password = $("#password").val();
                    if (username.trim() !== "" && password.trim() !== "") {
                        classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "user/signup", "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password), function () { }, function () { }, "post")
                            .then(function () {
                            //删掉本页面
                            _this.destory();
                            //更新head状态信息
                            classManager_js_1.ClassManager.head.buildUser(username);
                            //跳转到笔记主页面
                            classManager_js_1.ClassManager.notePage.build();
                        })["catch"](function (result) {
                            window.alert(result.message);
                        });
                    }
                });
            };
            this.select = select;
        }
        /**
         * 构建登录页面（会清空.content）
         * 以及绑定按钮事件
         */
        SignUpPage.prototype.build = function () {
            // this.$page.appendTo(this.select);
            $(this.select).append(this.page);
            this.bindSignup();
        };
        return SignUpPage;
    }());
    exports.SignUpPage = SignUpPage;
});
//# sourceMappingURL=signUpPage.js.map