define(["require", "exports", "../constant.js", "../manager/classManager.js"], function (require, exports, constant_js_1, classManager_js_1) {
    "use strict";
    exports.__esModule = true;
    var SignInPage = /** @class */ (function () {
        function SignInPage(select) {
            var _this = this;
            this.signInPage = ("<div class=\"signup\">\n                                    <div class=\"col-xs-7\">\n                                        <img src=\"/" + constant_js_1.Constant.projName + "/images/sign.png\" alt=\"\" class=\"sign-img img-responsive\">\n                                    </div>\n                                    <div class=\"col-xs-5\">\n                                        <form class=\"form-inline sign-form\" style=\"padding: 40px;width:400px \">\n                                            <h1 style=\"text-align: center;margin-bottom: 30px\">\u6CE8\u518C</h1>\n                                            <form class=\"form-inline\">\n                                                <div class=\"form-group\">\n                                                    <div class=\"input-group\">\n                                                        <div class=\"input-group-addon\"><label for=\"username\">username</label></div>\n                                                        <input type=\"text\" class=\"form-control\" id=\"username\" placeholder=\"\u8BF7\u8F93\u5165\u5E10\u53F7\">\n                                                    </div>\n                                                </div>\n                                                <div class=\"form-group\">\n                                                    <div class=\"input-group\">\n                                                        <div class=\"input-group-addon\"><label for=\"password\">password</label></div>\n                                                        <input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"\u8BF7\u8F93\u5165\u5BC6\u7801\">\n                                                    </div>\n                                                </div>\n                                                <div class=\"form-group\">\n                                                    <div class=\"input-group\">\n                                                        <div class=\"input-group-addon\"><label for=\"password\">password</label></div>\n                                                        <input type=\"password\" class=\"form-control\" id=\"password_configure\" placeholder=\"\u8BF7\u518D\u6B21\u8F93\u5165\u5BC6\u7801\">\n                                                    </div>\n                                                </div>\n                                                <button type=\"button\" class=\"btn btn-success\" style=\"margin-top: 20px\" id='signin_btn'>Sign In</button>\n                                            </form>\n                                        </form>\n                                    </div>\n                              </div>");
            this.destory = function () {
                $(_this.select).empty();
            };
            //事件集
            /**
             * 1.注册按钮事件
             */
            this.bindSigninBtn = function () {
                $("#signin_btn").on("click", function () {
                    classManager_js_1.ClassManager.ajax.request(constant_js_1.Constant.urlHead + "user/signin", "username=" + encodeURIComponent($("#username").val()) + "&password=" + encodeURIComponent($("#password").val()), function () {
                    }, function () {
                    }, "post")
                        .then(function (result) {
                        //登陆成功 跳转到主界面\
                        _this.destory();
                        classManager_js_1.ClassManager.signupPage.build();
                    })["catch"](function () {
                        alert("注册失败，账号已存在或者非法密码");
                    });
                });
            };
            this.select = select;
        }
        /**
         * 加入注册事件（按钮）
         */
        SignInPage.prototype.build = function () {
            // this.$signInPage.appendTo(this.select);
            $(this.select).append(this.signInPage);
            this.bindSigninBtn();
        };
        return SignInPage;
    }());
    exports.SignInPage = SignInPage;
});
//# sourceMappingURL=signInPage.js.map