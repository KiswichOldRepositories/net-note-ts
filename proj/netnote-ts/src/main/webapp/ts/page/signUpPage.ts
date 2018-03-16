//管理登录页面(暂时挺静态的一个页面 不加入响应式)
import {Ajax, AjaxResult} from "scooper.ajax";
import {Constant} from "../constant.js";
import {NotePage} from "./notePage.js";
import {ClassManager} from "../manager/classManager.js";

export class SignUpPage {
    public select: string;

    public page:string = (`<div class=\"signup\">
                            <div class=\"col-xs-7\">
                                <img src=\"/${Constant.projName}/images/sign.png\" alt=\"\" class=\"sign-img img-responsive\">
                            </div>
                            <div class=\"col-xs-5\"> 
                                <form class=\"form-inline sign-form\" style=\"padding: 40px;width:400px \">
                                    <h1 style=\"text-align: center;margin-bottom: 30px\">登录</h1>
                                    <form class=\"form-inline\">
                                    <div class=\"form-group\">
                                         <div class=\"input-group\">
                                            <div class=\"input-group-addon\"><label for=\"username\">username</label></div>
                                            <input type=\"pa\" class=\"form-control\" id=\"username\" placeholder=\"输入帐号\">
                                         </div>
                                    </div>
                                    <div class=\"form-group\">
                                        <div class=\"input-group\">
                                            <div class=\"input-group-addon\"><label for=\"password\">password</label></div>
                                            <input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"输入密码\">
                                        </div>
                                    </div>  
                                    <button type=\"button\" class=\"btn btn-success\" style=\"margin-top: 20px\" id='signup_btn'>Sign Up</button>
                                    <button type=\"button\" class=\"btn btn-success\" style=\"margin-top: 20px\" id='2signIn'>To Sign In</button>
                                    </form>   
                                </form>
                            </div>
                       </div>`);

    constructor(select: string) {
        this.select = select;

    }

    /**
     * 构建登录页面（会清空.content）
     * 以及绑定按钮事件
     */
    public build() {
        // this.$page.appendTo(this.select);
        $(this.select).append(this.page);
        this.bindSignup();
    }

    public destory = () => {
        $(this.select).empty();
    };

    //事件集
    /**
     * 1.登录按钮事件
     */
    public bindSignup = ()=>{

        $("#signup_btn").on("click",()=>{
            let username:string = $("#username").val();
            let password:string = $("#password").val();
            if(username.trim()!=="" && password.trim()!== ""){//帐号密码都不为空
                ClassManager.ajax.request(Constant.urlHead + "user/signup","username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password),()=>{},()=>{},"post")
                    .then(()=>{
                        //删掉本页面
                        this.destory();
                        //更新head状态信息
                        ClassManager.head.buildUser(username);


                        //跳转到笔记主页面
                        ClassManager.notePage.build();

                    })
                    .catch((result:AjaxResult)=>{
                        window.alert(result.message);
                    });
            }



        });

    }


}