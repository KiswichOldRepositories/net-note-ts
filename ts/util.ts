

import {AjaxResult} from "./scooper.ajax";

export class Util{
    /**
     * 获取一个Cookie
     * @param {string} cname
     * @returns {string}
     */
    public getCookie(cname:string):string{
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    /**
     * 设置一个 Cookie
     * @param {string} cname
     * @param {string} cvalue
     * @param {number} exdays
     */
    public setCookie(cname:string,cvalue:string,exdays:number):void{
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    /**
     * 删除一个Cookie
     * @param {string} cname
     */
    public deleteCookie(cname:string){
        this.setCookie(cname,"",-1);
    }


    public static signup(username:string, password:string){
        var form = new FormData();
        form.append("username", username);
        form.append("password", password);
        $.ajax({
            url: "/net-note/v1/user/signup",
            type: "POST",
            cache: false,
            data: form,
            processData: false,
            contentType: false,
        }).done((data:AjaxResult)=>{
            if (data.code === 0) {
                // Func.showNotePage();
                // $("#signup").remove();
                // $("#signin").remove();
                // $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id=\"signout\">退出登录</a></li>");
                // $("#nav-begin").append("<li class=\"nav-tab-def\"><a href=\"javascript:void(0)\" id='signText'>欢迎回来  " + username + "</a></li>");
                // Func.logout();
                // Func.setCookie("book", username, 7);
                // Func.setCookie("cake", password, 7);
            } else {
                window.alert("账号或密码错误");
            }
        }).fail((data:AjaxResult)=>{

        });
    }

}