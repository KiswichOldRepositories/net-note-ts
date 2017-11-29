define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    //管理登录页面(暂时挺静态的一个页面 不加入响应式)
    var SignUpPage = /** @class */ (function () {
        function SignUpPage(select) {
            this.$page = $(" <div class=\\\"signup\\\">\n                            <div class=\\\"col-xs-7\\\">\n                                <img src=\\\"../images/sign.png\\\" alt=\\\"\\\" class=\\\"sign-img img-responsive\\\">\n                            </div>\n                            <div class=\\\"col-xs-5\\\"> \n                                <form class=\\\"form-inline sign-form\\\" style=\\\"padding: 40px;width:400px \\\">\n                                    <h1 style=\\\"text-align: center;margin-bottom: 30px\\\">\u767B\u5F55</h1>\n                                    <form class=\\\"form-inline\\\">\n                                    <div class=\\\"form-group\\\">\n                                         <div class=\\\"input-group\\\">\n                                            <div class=\\\"input-group-addon\\\"><label for=\\\"username\\\">username</label></div>\n                                            <input type=\\\"pa\\\" class=\\\"form-control\\\" id=\\\"username\\\" placeholder=\\\"\u8F93\u5165\u5E10\u53F7\\\">\n                                         </div>\n                                    </div>\n                                    <div class=\\\"form-group\\\">\n                                        <div class=\\\"input-group\\\">\n                                            <div class=\\\"input-group-addon\\\"><label for=\\\"password\\\">password</label></div>\n                                            <input type=\\\"password\\\" class=\\\"form-control\\\" id=\\\"password\\\" placeholder=\\\"\u8F93\u5165\u5BC6\u7801\\\">\n                                        </div>\n                                    </div>  \n                                    <button type=\\\"button\\\" class=\\\"btn btn-success\\\" style=\\\"margin-top: 20px\\\" id='signup_btn'>Sign Up</button>\n                                    <button type=\\\"button\\\" class=\\\"btn btn-success\\\" style=\\\"margin-top: 20px\\\" id='2signIn'>To Sign In</button>\n                                    </form>   \n                                </form>\n                            </div>\n                       </div>");
            this.select = select;
            // this.$page.appendTo(select);
        }
        /**
         * 构建登录页面（会清空.content）
         * 以及绑定按钮事件
         */
        SignUpPage.prototype.build = function () {
            $(this.select).empty();
            this.$page.appendTo(this.select);
        };
        return SignUpPage;
    }());
    exports.SignUpPage = SignUpPage;
});
//# sourceMappingURL=signUpPage.js.map