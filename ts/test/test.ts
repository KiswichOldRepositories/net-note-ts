import {Head} from "../view/head";

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
head.deleteNav("网盘中心");
head.emptyNav();




