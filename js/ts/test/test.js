define(["require", "exports", "../view/head", "jquery"], function (require, exports, head_1, $) {
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
    // head.deleteNav("网盘中心");
    //
    // let setting = {};
    // let notePage = new NotePage("#content");
    // $.fn.zTree.init($("#noteTree"));
    var setting = {
        data: {
            simpleData: {
                enable: true
                //                  idKey:"id",
                //                  pIdKey:"pId",
            }
        },
        async: {
            enable: true,
            url: "../../../resource/ztree.json",
            autoParam: ["id", "name"],
            otherParam: { "otherParam": "zTreeAsyncTest" }
        },
        callback: {
            asyncSuccess: function () {
            }
        }
    };
    $.fn.zTree.init($("#noteTree", setting));
});
//# sourceMappingURL=test.js.map