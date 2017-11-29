/// <amd-dependency path="ztree" />
define(["require", "exports", "../view/head.js", "../page/notePage.js", "../view/content.js", "ztree"], function (require, exports, head_js_1, notePage_js_1, content_js_1) {
    "use strict";
    exports.__esModule = true;
    var a = {};
    function test01() {
        a["ssss"] = "sss";
        a["tttt"] = "tttt";
        console.log(a);
    }
    test01();
    var head = new head_js_1.Head("body");
    head.build();
    // head.deleteNav("网盘中心");
    //
    // let setting = {};
    // let notePage = new NotePage("#content");
    // $.fn.zTree.init($("#noteTree"));
    var content = new content_js_1.Content("body");
    var notePage = new notePage_js_1.NotePage(".content");
    notePage.freshTree("../resource/ztree.json");
});
//# sourceMappingURL=test.js.map