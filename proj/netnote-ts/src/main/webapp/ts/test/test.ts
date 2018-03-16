import "ztree";
import "nicEdit";

import {Head} from "../view/head.js";
import {NotePage} from "../page/notePage.js";
import {Content} from "../view/content.js";
import {ClassManager} from "../manager/classManager.js";


interface Map<T> {
    [key: string]: T;
}

type node = Map<string>;
let a: node = {};

function test01() {

    a["ssss"] = "sss";
    a["tttt"] = "tttt";

    console.log(a);
}

test01();

ClassManager.head.build();
ClassManager.content.build();
ClassManager.foot.build();

ClassManager.hellopage.build();
// head.deleteNav("网盘中心");

//
// let setting = {};
// let notePage = new NotePage("#content");
// $.fn.zTree.init($("#noteTree"));






