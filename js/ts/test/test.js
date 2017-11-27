define(["require", "exports", "../view/head"], function (require, exports, head_1) {
    "use strict";
    exports.__esModule = true;
    var a = {};
    function test01() {
        a["ssss"] = "sss";
        a["tttt"] = "tttt";
        console.log(a);
    }
    test01();
    var head = new head_1.Head("body");
    head.build();
    head.deleteNav("网盘中心");
    head.emptyNav();
});
//# sourceMappingURL=test.js.map