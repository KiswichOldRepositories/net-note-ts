//之前选中的树ID
var treeSelectID;
//区分是页面刚加载还是刷新树的标志
var firstFlag = 0;
var nicEditor2;

//当前正在编辑的笔记ID(相对于前端的id)
var noteId;
//当前正在编辑的笔记的目录
var pid;
//储存当前笔记的标签 （{[{id:#,tagName:#}, ......]}）
var tags;

//储存编辑器的内容
var textInf;

//webuploader的接口
var uploader;


$(function () {
/////////////////////////////////////////注册登录逻辑//////////////////////////////////////////////////////////////////////////////////

    Func.signupInStart();

    $("#signup").on("click", function () {
        Func.showSignup();
    });
    $("#signin").on("click", function () {
        Func.showSignin();
    });

    $("#2-net-disk").on("click",function () {
        var host = window.location.host;
        window.open("http://"+ host+":62202/net-disk/", 'newWidow');
    });

    Func.logout();


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //测试用树
    function textTree() {
        $("#tt3").tree({
            url: '../resource/text-tree.json'
        });
    }








    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //加载主页
    //showHelloPage();

    //加载页面
    //$("#content").append(notePage);

    $("#logo").on("click", function () {
        Func.showHelloPage();
    });

    $("#btn5").on("click", function () {
        $.ajax({
            url: "/net-note/v1/note/11",
            type: "POST",
            cache: false,
            data: {"noteText": "121322", "noteName": "ssssss"},//这种写法不得行
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data);
            },
            error: function () {
                console.log(1);
            },
            statusCode: {
                500: function () {
                    console.log(222);
                }
            }
        });
    });

    $("#btn").on("click", function () {
        $("#textarea1").append(textArea);
        nicEditor2 = new nicEditor;
        nicEditor2.panelInstance("editor");
        $(".nicEdit-main").addClass("text-area");
    });

    $("#btn2").on("click", function () {
        nicEditor2.removeInstance("editor");
        $("#textarea1").empty();
    });

    $("#btn3").on("click", function () {
        var editor = nicEditors.findEditor("editor");
        var content = editor.getContent();
        textInf = content;
    });

    $("#btn4").on("click", function () {
        $("#textarea1").append(textView);
        $("#textView").append(textInf);
    });

});






/////////////////////////////////////////////////笔记页面/////////////////////////////////////////////////////////////////////////////////















