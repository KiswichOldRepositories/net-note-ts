
import {ClassManager} from "../manager/classManager.js";

export class HelloPage{
    public helloPage:string = (`<div class=\"jumbotron\" >
                <div class=\"hello\">
                    <h1>Net Note!</h1>
                    <p>
                        This note on web with markdown text and  user-defined images.You can tag notes when you read,watch movie.
                        <br>
                        COME ON!!
                        <br>
                        Bring you a special experience
                    </p>
                    <p><button class='btn btn-primary btn-lg' id='2notePage' role='button'>Do it</button></p>
                </div>
            </div>`);
    public select:string;

    constructor(select:string){
        this.select = select;
    }

    public build = ():void=>{
        // this.$helloPage.appendTo(this.select);
        $(this.select).append(this.helloPage);
        this.bind2Signup();
    };

    public destory = ():void=>{
        $(this.select).empty();
    };



    //  事件集
    /**
     * 跳转到登录
     */
    public bind2Signup = ():void=>{
        //点击 跳转到登录
        $("#2notePage").on("click",()=>{
            this.destory();
            ClassManager.signupPage.build();
        });
    };
}