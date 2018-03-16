import {Constant} from "../constant.js";
import {ClassManager} from "../manager/classManager.js";
import {AjaxResult} from "scooper.ajax";

export class SignInPage {
    public signInPage: string = (`<div class=\"signup\">
                                    <div class=\"col-xs-7\">
                                        <img src=\"/${Constant.projName}/images/sign.png\" alt=\"\" class=\"sign-img img-responsive\">
                                    </div>
                                    <div class=\"col-xs-5\">
                                        <form class=\"form-inline sign-form\" style=\"padding: 40px;width:400px \">
                                            <h1 style=\"text-align: center;margin-bottom: 30px\">注册</h1>
                                            <form class=\"form-inline\">
                                                <div class=\"form-group\">
                                                    <div class=\"input-group\">
                                                        <div class=\"input-group-addon\"><label for=\"username\">username</label></div>
                                                        <input type=\"text\" class=\"form-control\" id=\"username\" placeholder=\"请输入帐号\">
                                                    </div>
                                                </div>
                                                <div class=\"form-group\">
                                                    <div class=\"input-group\">
                                                        <div class=\"input-group-addon\"><label for=\"password\">password</label></div>
                                                        <input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"请输入密码\">
                                                    </div>
                                                </div>
                                                <div class=\"form-group\">
                                                    <div class=\"input-group\">
                                                        <div class=\"input-group-addon\"><label for=\"password\">password</label></div>
                                                        <input type=\"password\" class=\"form-control\" id=\"password_configure\" placeholder=\"请再次输入密码\">
                                                    </div>
                                                </div>
                                                <button type=\"button\" class=\"btn btn-success\" style=\"margin-top: 20px\" id='signin_btn'>Sign In</button>
                                            </form>
                                        </form>
                                    </div>
                              </div>`);


    public select: string;

    constructor(select: string) {
        this.select = select;
    }

    /**
     * 加入注册事件（按钮）
     */
    public build(): void {
        // this.$signInPage.appendTo(this.select);

        $(this.select).append(this.signInPage);
        this.bindSigninBtn();
    }

    public destory = (): void => {
      $(this.select).empty();
    };

    //事件集
    /**
     * 1.注册按钮事件
     */

    public bindSigninBtn = (): void => {
        $("#signin_btn").on("click", () => {
            ClassManager.ajax.request(Constant.urlHead + "user/signin",
                "username=" + encodeURIComponent($("#username").val()) + "&password=" + encodeURIComponent($("#password").val())
                , () => {
                }, () => {
                }, "post")
                .then((result: AjaxResult) => {
                    //登陆成功 跳转到主界面\
                    this.destory();
                    ClassManager.signupPage.build();
                }).catch(() => {
                alert("注册失败，账号已存在或者非法密码");
            });


        });

    }

}