$(function () {

    $("#content").empty();
    $('#content').append(shareUrlPage);

    $("#signup").on("click", function () {
        Func.showSignup();
    });
    $("#signin").on("click", function () {
        Func.showSignin();
    });
    $("#logo").on("click", function () {
        Func.showHelloPage();
    });

    $("#2-net-disk").on("click",function () {
        window.open("http://localhost:62202/net-disk/", 'newWidow');
    });

    $('#tt4').tree({
        url: "/net-note/v1/share/" + $("#shareUrl").val(),
        lines: true,
        async: false,
        checkbox: true,
        method: "GET",
        contentType: "application/x-www-form-urlencoded",

        onLoadSuccess: function (node, data) {
            var t = $(this);
            if (data) {
                $(data).each(function (index, d) {
                    if (this.state === 'closed') {
                        t.tree('expandAll');
                    }
                });
            }
        }
    });

    $("#tt4").tree({
        //树的双击事件,用来打开笔记或者折叠（打开）目录 查看笔记 显示笔记
        onDblClick: function (node) {

            //这里请求异步加载在线笔记预览
            //alert(node.text);
            //0.检查是否为文件夹的点击，若是，则展开/合拢文件夹，若不是则->1
            if (node.id % 2 === 1 || $("#tt4").tree("getParent", node.target) === null) {
                $("#tt4").tree("toggle", node.target);
            } else {

                //获取笔记内容
                $.ajax({
                    url: "/net-note/v1/note/" + node.id,
                    type: "GET",
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        if (data.code === 0) {
                            $("#textarea1").empty();
                            $("#textarea1").append(textView);
                            //添加显示内容
                            $("#textView").append(data.data.noteText);
                            $("#textTitle").append(data.data.noteName);

                            $.ajax({
                                url: "/net-note/v1/note/" + node.id + "/attach",
                                type: "GET",
                                cache: false,
                                // data: formData,
                                processData: false,
                                contentType: false,
                                success: function (data) {
                                    if (data.code === 0) {
                                        var attachs = data.data;
                                        for (var i = 0; i < attachs.length; i++) {
                                            Func.addAttachList(attachs[i]);
                                        }
                                    }
                                    //在这里绑定下载事件 (利用冒泡机制捕获子元素的点击事件)
                                    $("#attachList").on("click", function (evt) {
                                        //console.log($(evt.target).attr("id"));
                                        //下载事件
                                        window.location = "./v1/attach/" + $(evt.target).attr("id");
                                    });

                                }
                            });

                        } else {
                            window.alert("您的笔记正在路上");
                        }
                    }
                });
            }

        },
        onClick: function (node) {

        }
    });


});