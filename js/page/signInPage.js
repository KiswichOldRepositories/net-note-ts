define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var SignInPage = /** @class */ (function () {
        function SignInPage(select) {
            this.$signInPage = $("\" <div class=\"signup\">\n                                    <div class=\"col-xs-7\">\n                                        <img src=\"../images/sign.png\" alt=\"\" class=\"sign-img img-responsive\">\n                                    </div>\n                                    <div class=\"col-xs-5\">\n                                        <form class=\"form-inline sign-form\" style=\"padding: 40px;width:400px \">\n                                            <h1 style=\"text-align: center;margin-bottom: 30px\">\u6CE8\u518C</h1>\n                                            <form class=\"form-inline\">\n                                                <div class=\"form-group\">\n                                                    <div class=\"input-group\">\n                                                        <div class=\"input-group-addon\"><label for=\"username\">username</label></div>\n                                                        <input type=\"text\" class=\"form-control\" id=\"username\" placeholder=\"\u8BF7\u8F93\u5165\u5E10\u53F7\">\n                                                    </div>\n                                                </div>\n                                                <div class=\"form-group\">\n                                                    <div class=\"input-group\">\n                                                        <div class=\"input-group-addon\"><label for=\"password\">password</label></div>\n                                                        <input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"\u8BF7\u8F93\u5165\u5BC6\u7801\">\n                                                    </div>\n                                                </div>\n                                                <div class=\"form-group\">\n                                                    <div class=\"input-group\">\n                                                        <div class=\"input-group-addon\"><label for=\"password\">password</label></div>\n                                                        <input type=\"password\" class=\"form-control\" id=\"password_configure\" placeholder=\"\u8BF7\u518D\u6B21\u8F93\u5165\u5BC6\u7801\">\n                                                    </div>\n                                                </div>\n                                                <button type=\"button\" class=\"btn btn-success\" style=\"margin-top: 20px\" id='signin_btn'>Sign In</button>\n                                            </form>\n                                        </form>\n                                    </div>\n                              </div>");
            this.$signInPage.appendTo(select);
        }
        /**
         * 加入注册事件（按钮）
         */
        SignInPage.prototype.build = function () {
        };
        return SignInPage;
    }());
    exports.SignInPage = SignInPage;
});
//# sourceMappingURL=signInPage.js.map