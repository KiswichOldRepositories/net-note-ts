import {Head} from "../view/head";
// import {JQuery} from "../declarations/jquery.ztree/index";

import $ = require("jquery");
import {NotePage} from "../page/notePage";
/// <amd-dependency path="../declarations/jquery.ztree" />

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

var setting = {
    data: {
        simpleData: {
            enable: true
//                  idKey:"id",
//                  pIdKey:"pId",
        }
    }
    ,async: {
        enable: true,
        url:"../../../resource/ztree.json",
        autoParam:["id", "name"],
        otherParam:{"otherParam":"zTreeAsyncTest"},
//              dataType: "text",//默认text
//              type:"get",//默认post
       // dataFilter: filter  //异步返回后经过Filter
    }
    ,callback:{
        asyncSuccess: ()=>{

        },//异步加载成功的fun

    }
};
 $.fn.zTree.init($("#noteTree",setting));




