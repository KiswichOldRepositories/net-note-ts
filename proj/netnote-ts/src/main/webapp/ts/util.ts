

import {AjaxResult} from "./scooper.ajax.js";
import {ClassManager} from "./manager/classManager.js";
import {Constant} from "./constant.js";

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



}