import "es6-promise";
import $ = require("jquery");

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
    private $header = $(`<div class=\"head\">
          <a href=\"javascript:void(0)\"><img src=\"../images/logo2.png\" alt=\"logo\" id=\"logo\" class=\"logo\"></a>
        </div>`);


    /**
     *  PC端的导航栏
     * @type {string}
     */
    private $headNav_PC = $(`<span class=\"nav-control\"></span>`);

    /**
     * 导航标签
     * @type {string}
     */
    private $navTab =
        $(`<ul class=\"nav\" id=\"nav-begin\">
                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"2-net-disk\">网盘中心</a></li>
                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"about-us\">关于</a></li>
                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signin\">注册</a></li>
                    <li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signup\">登录</a></li>
                </ul>`);

    /**
     * 传入参数为某一个选择器
     * @param {string} select
     */
    constructor(select: string) {
        this.$header.appendTo(select);
    }

    /**
     * 构造导航栏
     */
    public build() {
        this.$headNav_PC.appendTo(this.$header);
        this.$navTab.appendTo(this.$headNav_PC);

        $("#nav-begin").on("click",(eventObject)=>{
            switch ($(eventObject.target).text()){
                case "登录":
                    break;
                case "注册":
                    break;
                case "关于":
                    break;
                case "网盘中心":
                    break;
                case "退出登录":
                    break;
            }

        });
    }

    /**
     * 充值节点为登录注册页面
     * @param {navNode[]} nodes
     */
    public resetNav(nodes: navNode[]) {
        this.emptyNav();
        nodes.forEach((value: navNode, index: number) => {
            this.addNav(value);
        });
    }

    /**
     * 设置节点,在某个索引前插入一个元素
     * @param {navNode[]} nodes
     */
    public setNav(node: navNode, insertIndex: number) {
        let $nav = $(`<li><a href=\"javascript:void(0)\">${node.text}</a></li>`);
        $(this.$navTab.children()[insertIndex]).before($nav[0]);
        //添加属性
        for (let key in node.attrs) {
            $nav.attr(key, node.attrs[key]);
        }
    }

    public addNav(node: navNode) {
        //添加一个节点
        let $navNode = $(`<li><a href=\"javascript:void(0)\">${node.text}</a></li>`);
        this.$headNav_PC.append($navNode);

        //添加属性
        for (let key in node.attrs) {
            $navNode.attr(key, node.attrs[key]);
        }
    }

    /**
     * 根据标签名删除标签,(理论上不该有重复的标签)
     * @param {string} text
     */
    public deleteNav(text: string) {

        this.$navTab.children("li").each((index, elem) => {
            if ($(elem).text() === text) {
                $(elem).remove();
                return;
            }
        });
    }

    /**
     * 清空导航栏
     */
    public emptyNav() {
        this.$navTab.empty();
    }


}