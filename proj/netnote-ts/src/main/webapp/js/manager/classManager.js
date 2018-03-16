define(["require", "exports", "../page/notePage.js", "../page/helloPage.js", "../page/signInPage.js", "../page/signUpPage.js", "scooper.ajax", "../view/content.js", "../view/foot.js", "../view/head.js"], function (require, exports, notePage_js_1, helloPage_js_1, signInPage_js_1, signUpPage_js_1, scooper_ajax_1, content_js_1, foot_js_1, head_js_1) {
    "use strict";
    exports.__esModule = true;
    //单实例管理
    var ClassManager = /** @class */ (function () {
        function ClassManager() {
        }
        ClassManager.hellopage = new helloPage_js_1.HelloPage("#content");
        ClassManager.notePage = new notePage_js_1.NotePage("#content");
        ClassManager.signinPage = new signInPage_js_1.SignInPage("#content");
        ClassManager.signupPage = new signUpPage_js_1.SignUpPage("#content");
        ClassManager.head = new head_js_1.Head("body");
        ClassManager.content = new content_js_1.Content("body");
        ClassManager.foot = new foot_js_1.Foot("body");
        ClassManager.ajax = new scooper_ajax_1.Ajax();
        return ClassManager;
    }());
    exports.ClassManager = ClassManager;
});
//# sourceMappingURL=classManager.js.map