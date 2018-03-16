define(["require", "exports", "../manager/classManager.js"], function (require, exports, classManager_js_1) {
    "use strict";
    exports.__esModule = true;
    var HelloPage = /** @class */ (function () {
        function HelloPage(select) {
            var _this = this;
            this.helloPage = ("<div class=\"jumbotron\" >\n                <div class=\"hello\">\n                    <h1>Net Note!</h1>\n                    <p>\n                        This note on web with markdown text and  user-defined images.You can tag notes when you read,watch movie.\n                        <br>\n                        COME ON!!\n                        <br>\n                        Bring you a special experience\n                    </p>\n                    <p><button class='btn btn-primary btn-lg' id='2notePage' role='button'>Do it</button></p>\n                </div>\n            </div>");
            this.build = function () {
                // this.$helloPage.appendTo(this.select);
                $(_this.select).append(_this.helloPage);
                _this.bind2Signup();
            };
            this.destory = function () {
                $(_this.select).empty();
            };
            //  事件集
            /**
             * 跳转到登录
             */
            this.bind2Signup = function () {
                //点击 跳转到登录
                $("#2notePage").on("click", function () {
                    _this.destory();
                    classManager_js_1.ClassManager.signupPage.build();
                });
            };
            this.select = select;
        }
        return HelloPage;
    }());
    exports.HelloPage = HelloPage;
});
//# sourceMappingURL=helloPage.js.map