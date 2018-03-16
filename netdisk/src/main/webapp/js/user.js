$(function () {

    $("#login").on("click",function () {
        $("#mess").text("");
        if($("#username").val()===""){
            //账号为空的情况
            $("#mess").append("请输入账号");
        }else{
            //提交表单
            $("#loginForm").submit();
        }
    });

    $("#signin").on("click",function () {
        $("#mess_sign").text("");
        if($("#username_sign").val().trim() ==="" || $("#username_sign").val().trim()===null){

            $("#mess_sign").text("请输入账号");
        }else{
            if($("#password_sign").val() === $("#password_sign_config").val()){
                $("#signInForm").submit();
            }else{
                $("#mess_sign").text("两次输入的密码不一致");
            }
        }
    });

    //username=alice&age=110&birthday=1983-05-12",
    $("#test").on("click",function () {

        $.ajax({
            type:"post",
            url:"/test/testAjax",
            data:{"username":"user","age":18},
            dataType:"json",
            success:function (data) {
                console.log(data);
            }
        });
    });
});