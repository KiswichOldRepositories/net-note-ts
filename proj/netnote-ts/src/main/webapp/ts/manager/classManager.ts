
import {NotePage} from "../page/notePage.js";
import {HelloPage} from "../page/helloPage.js";
import {SignInPage} from "../page/signInPage.js";
import {SignUpPage} from "../page/signUpPage.js";
import {Ajax} from "scooper.ajax";

import {Content} from "../view/content.js";
import {Foot}from "../view/foot.js"
import {Head} from "../view/head.js"

//单实例管理
export class ClassManager{
    public static  hellopage:HelloPage = new HelloPage("#content");
    public static notePage:NotePage = new NotePage("#content");
    public static signinPage:SignInPage = new SignInPage("#content");
    public static signupPage:SignUpPage = new SignUpPage("#content");

    public static head:Head = new Head("body");
    public static content:Content = new Content("body");
    public static foot:Foot = new Foot("body");

    public static ajax:Ajax = new Ajax();
}