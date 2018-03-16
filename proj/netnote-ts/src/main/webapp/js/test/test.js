define(["require", "exports", "../manager/classManager.js", "ztree", "nicEdit"], function (require, exports, classManager_js_1) {
    "use strict";
    exports.__esModule = true;
    var a = {};
    function test01() {
        a["ssss"] = "sss";
        a["tttt"] = "tttt";
        console.log(a);
    }
    test01();
    classManager_js_1.ClassManager.head.build();
    classManager_js_1.ClassManager.content.build();
    classManager_js_1.ClassManager.foot.build();
    classManager_js_1.ClassManager.hellopage.build();
});
// head.deleteNav("网盘中心");
//
// let setting = {};
// let notePage = new NotePage("#content");
// $.fn.zTree.init($("#noteTree"));
//# sourceMappingURL=test.js.map