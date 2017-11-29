/// <amd-dependency path="ztree" />

import {Head} from "../view/head.js";
import * as $ from 'jquery';
import {NotePage} from "../page/notePage.js";
import {Content} from "../view/content.js";


interface  Map<T>{
    [key:string]:T;
}

type node = Map<string>;
let a :node={};
function test01(){

    a["ssss"] = "sss";
    a["tttt"] = "tttt";

    console.log(a);
}

test01();

let head:Head = new Head("body");
head.build();
// head.deleteNav("网盘中心");

//
// let setting = {};
// let notePage = new NotePage("#content");
// $.fn.zTree.init($("#noteTree"));


let content = new Content("body");

let notePage = new NotePage(".content");
notePage.freshTree("../resource/ztree.json");




