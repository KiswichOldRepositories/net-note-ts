
import {ClassManager} from "../manager/classManager.js";
import {Constant} from "../constant.js";
import {AjaxResult} from "../declarations/scooper.ajax";

interface Map<T> {
    [key: string]: T;
}

//定义了节点的键值对
type navAttr = Map<string>;

interface navNode {
    text: string,
    attrs: navAttr
}

/**
 * 用来处理网页头部的函数
 */
export class Head {
    /**
     * 网页头基本框架
     * @type {string}
     */
    private header:string = (`<div class=\"head\">
          <a href=\"javascript:void(0)\"><img src=\"/net-note/images/logo2.png\" alt=\"logo\" id=\"logo\" class=\"logo\"></a>
        </div>`);


    /**
     *  PC端的导航栏
     * @type {string}
     */
    private headNav_PC:string = (`<span class=\"nav-control\"></span>`);

    /**
     * 导航标签
     * @type {string}
     */
    private navTab:string =
        (`<ul class=\"nav\" id=\"nav-begin\">
                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"2-net-disk\">网盘中心</a></li>
                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"about-us\">关于</a></li>
                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signin\">注册</a></li>
                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signup\">登录</a></li>
                </ul>`);

    public select:string;
    /**
     * 传入参数为某一个选择器
     * @param {string} select
     */
    constructor(select: string) {
        // this.$header.appendTo(select);
        $(select).append(this.header);
        $(".head").append(this.headNav_PC);
        this.select = select;
    }


    /**
     * 构造导航栏
     */
    public build = ():void=> {
        // this.$headNav_PC.appendTo(".head");

        // console.log(this.$navTab[0]);
        // this.$navTab.appendTo(".nav-control");
        $(".nav-control").append(this.navTab);

        $("#nav-begin").on("click",(eventObject)=>{
            switch ($(eventObject.target).text()){
                case "登录":
                    this.bindSignup();
                    break;
                case "注册":
                    this.bindSignin();
                    break;
                case "关于":
                    this.bindAbout();
                    break;
                case "网盘中心":
                    this.bind2Disk();
                    break;
                case "退出登录":
                    this.bindLogout();
                    break;
            }
        });
    };
    /**
     * 清空导航栏
     */
    public destory = ()=>{
        $(".nav-control").empty();
    };

    /**
     * 创建一个用户登录状态的导航栏
     * @param {string} username
     */
    public buildUser(username:string){
        this.deleteNav("登录");
        this.deleteNav("注册");
        $("#nav-begin").append(`<li class="nav-tab-def"><a href="javascript:void(0)" id="logout">退出登录</a></li>`);
        $("#nav-begin").append(`<li class="nav-tab-def"><a href="javascript:void(0)" id="navtext">欢迎回来 ${username}</a></li>`);
    }



    /**
     * 充值节点为登录注册页面
     * @param {navNode[]} nodes
     */
    public resetNav = (nodes: navNode[]):void=> {
        this.emptyNav();
        nodes.forEach((value: navNode, index: number) => {
            this.addNav(value);
        });
    };

    /**
     * 设置节点,在某个索引前插入一个元素
     * @param {navNode} node
     * @param {number} insertIndex
     */
    public setNav = (node: navNode, insertIndex: number):void => {
        let $nav = $(`<li><a href=\"javascript:void(0)\">${node.text}</a></li>`);
        $($("#nav-begin").children()[insertIndex]).before($nav[0]);
        //添加属性
        for (let key in node.attrs) {
            $nav.attr(key, node.attrs[key]);
        }
    };

    public addNav = (node: navNode):void => {
        //添加一个节点
        let $navNode = $(`<li><a href=\"javascript:void(0)\">${node.text}</a></li>`);
        // this.$headNav_PC.append($navNode);
        $(".nav-control").append($navNode);

        //添加属性
        for (let key in node.attrs) {
            $navNode.attr(key, node.attrs[key]);
        }
    };

    /**
     * 根据标签名删除标签,(理论上不该有重复的标签)
     * @param {string} text
     */
    public deleteNav = (text: string):void => {

        $("#nav-begin").children("li").each((index, elem) => {
            if ($(elem).text() === text) {
                console.log(elem);
                $(elem).remove();
                return;
            }
        });
    };

    /**
     * 清空导航栏
     */
    public emptyNav = ():void => {
        // this.$navTab.empty();
        $("#nav-begin").empty();
    };

    //事件集
    /**
     * 1.登录按钮（登录页面）
     */
    public bindSignup = ():void=>{
        $("#content").empty();
        ClassManager.signupPage.build();
    };

    /**
     * 2.注册按钮（注册页面）
     */
    public bindSignin = ():void=>{
        $("#content").empty();
        ClassManager.signinPage.build();
    };

    /**
     * 3.退出登录按钮（欢迎页面）
     */
    public bindLogout = ():void=>{
        ClassManager.ajax.request(Constant.urlHead + "user/signout",{}
            ,()=>{},()=>{},"post")
            .then((result:AjaxResult)=>{
                $("#content").empty();
                ClassManager.hellopage.build();
                this.destory();
                this.build();
            })
            .catch((result:AjaxResult)=>{
                alert(result.message);
            });
    };

    /**
     * 4.网盘中心按钮（跳转到网盘）
     */

    public bind2Disk = ():void=>{

    };

    /**
     * 5.关于按钮
     */
    public bindAbout = ():void =>{

    };

}