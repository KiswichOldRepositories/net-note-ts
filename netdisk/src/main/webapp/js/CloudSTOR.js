/**
 * Created by 24886 on 2017/9/10.
 * ##网盘主要功能的操作函数
 */
var treeSelectID;
var firstFlag = 0;
$(function () {
    // var treeUrl = '/folder/showFolders';


    function freshTree() {
        //异步动态加载树
        $('#tt3').tree({
            url: 'folder/showFolders',
            lines: true,
            async: false,
            checkbox: true,

            onLoadSuccess: function (node, data) {
                var t = $(this);
                if (data) {
                    $(data).each(function (index, d) {
                        if (this.state === 'closed') {
                            t.tree('expandAll');
                        }
                    });
                }
                if (firstFlag === 0) {
                    treeSelectID = data[0].id;
                    firstFlag = 1;
                }
                //选中之前的节点
                var newNode = $('#tt3').tree('find', treeSelectID);
                console.log(newNode);
                $('#tt3').tree('select', newNode.target);
            }
        });
        $('#tt4').tree({
            url: 'share/showShare',
            lines: true,
            async: false,
            checkbox: true,
            onLoadSuccess: function (node, data) {
                var t = $(this);
                if (data) {
                    $(data).each(function (index, d) {
                        if (this.state == 'closed') {
                            t.tree('expandAll');
                        }
                    });
                }
                var newNode = $('#tt4').tree('find', data[data.length - 1]);
                //让分享树选中最新的分享节点
                if (newNode !== null) $('#tt4').tree('select', newNode.target);
            },
        });
    }

    //页面打开时加载文件树
    freshTree();

    // //测试树节点获取 测试通过
    // $('#tt3').on("click",function () {
    //
    //     console.log($("#tt3").tree("getSelected").id);
    // });

    var shipSize = 2*1024*1024 ; //2mb为一个分片

    //点击上传按钮 进行文件上传表单的提交
    $("#upload").on("click", function () {
        //上传时校验 1.文件是否为空 2.选中树节点为文件的情况，默认上传至该文件所在的文件夹
        if ($("#file").val() !== "") {
            //上传文件不为空的情况
            var fNode = $("#tt3").tree("getSelected");
            if (fNode === null) //没有选中文件/文件夹
                return;

            if (fNode.id % 2 === 0) {
                //选中的是个文件 因此要找到其所在文件夹的
                fNode = $("#tt3").tree("getParent", fNode.target);
            }

            var CurrentShip = 0;//当前片

            var file = $("#file")[0].files[0];

            //先向服务器询问有没有上次发送的残片
            var startForm = new FormData();
            startForm.append("method", "start");
            startForm.append("fileName", file.name);
            startForm.append("folderID", fNode.id);
            $("#bartext").text("正在上传");
            $.ajax({
                url: "/net-disk/file/uploadFileWithShip",
                type: "POST",
                cache: false,
                data: startForm,
                processData: false,
                contentType: false,
                success: function (data) {//data为上次传送的断点
                    //约定 返回0说明没有，返回数字就从该数字开始发送
                    CurrentShip = parseInt(data);//若不转换成int，这个断点的碎片大小将会是剩下的整个文件的大小

                    console.log("从第" + CurrentShip + "片开始传输");
                    var shipCount = Math.ceil(file.size / shipSize);//总片数
                    console.log(shipCount);
                    if(CurrentShip!==0){//不是从0开始传输，给出提示
                        var percent = Math.ceil( CurrentShip *90 /shipCount);//剩下百分之十给压缩
                        var msg = "检测到您上一次传送" +file.name +"到" +percent + "%\n\n要继续吗！";
                        if (confirm(msg) === true) {//请求继续传输

                        }else{//重新传输
                            CurrentShip=0;
                        }
                    }

                    for (var i = CurrentShip; i < shipCount; i++) {
                        var start = 0;//当前开始位置
                        var end = 0;//当前结束位置
                        var form = new FormData();
                        start = i * shipSize;
                        if (i === shipCount - 1) {//最后一片
                            end = file.size;
                        } else {
                            end = (i + 1) * shipSize;
                        }
                        //console.log("start " + start + " ;end " + end);

                        form.append("method", "send");
                        form.append("fileName", file.name);
                        form.append("file", file.slice(start, end));
                        form.append("CurrentShip", i);
                        $.ajax({
                            url: "/net-disk/file/uploadFileWithShip",
                            type: "POST",
                            cache: false,
                            data: form,
                            processData: false,
                            contentType: false,
                            success: function () {
                                //成功后显示进度条
                                CurrentShip++;
                                $("#uploadBar").progressbar('setValue',Math.ceil(CurrentShip*90/shipCount));
                                if (CurrentShip === shipCount) {//比较是否传输完成 若完成则发送结束信号
                                    var form2 = new FormData();
                                    form2.append("method", "end");
                                    form2.append("fileName", file.name);
                                    form2.append("folderID", fNode.id);
                                    form2.append("shipCount", shipCount);
                                    //这个表单要等上面的表单全部处理完成后才能发送
                                    $("#bartext").text("正在压缩");

                                    $.ajax({//通知服务器发送结束了 可以打包了
                                        url: "/net-disk/file/uploadFileWithShip",
                                        type: "POST",
                                        cache: false,
                                        data: form2,
                                        processData: false,
                                        contentType: false,
                                        success: function () {
                                            //这里刷新树
                                            $("#bartext").text("上传成功！");
                                            $("#uploadBar").progressbar('setValue',Math.ceil(100));
                                            freshTree();
                                            CurrentShip = 0;
                                        }
                                    });
                                }

                            }
                        });
                    }
                }
            });

        }
    });
    // $("#upload").on("click", function () {
    //     //上传时校验 1.文件是否为空 2.选中树节点为文件的情况，默认上传至该文件所在的文件夹
    //     if ($("#file").val() !== "") {
    //         //上传文件不为空的情况
    //         var fNode = $("#tt3").tree("getSelected");
    //         if (fNode !== null) {//没有选中文件/文件夹
    //             if (fNode.id % 2 === 0) {
    //                 //选中的是个文件 因此要找到其所在文件夹的
    //                 fNode = $("#tt3").tree("getParent", fNode.target);
    //             }
    //             //填充表单
    //             $("#folderID").val(fNode.id);
    //             //使用jquery.form.min.js
    //             $("#fileForm").ajaxSubmit({
    //                 url: "/file/uploadFile",
    //                 uploadProgress: function(event, position, total, percentComplete) {//上传的过程
    //                     //position 已上传了多少
    //                     //total 总大小
    //                     //已上传的百分数
    //                     // var percentVal = percentComplete + '%';
    //                     // bar.width(percentVal)
    //                     // percent.html(percentVal);
    //                     // console.log(percentVal, position, total);
    //                     $("#uploadBar").progressbar('setValue',percentComplete);
    //                 },
    //                 success: function () {
    //                     //刷新树
    //                     freshTree();
    //                 }
    //             });
    //         }
    //     } else {
    //         //上传文件为空的情况 为考虑用户体验 应给出提示
    //     }
    // });

    //点击下载按钮 下载当前选中的文件（暂不支持批量）
    $("#download").on("click", function () {
        //应该检测选中的状态 以及选中为文件夹的情况
        var fNode = $("#tt3").tree("getSelected");
        if (fNode !== null) {
            if (fNode.id % 2 === 0) {

                //选中的是个文件 可以提交下载
                $("#folderTreeID").val(fNode.id);
                $("#downloadForm").submit();

            } else {
                //选中的是文件夹 会下载到zip压缩包
                $("#folderTreeID").val(fNode.id);
                $("#downloadForm").submit();
            }
        }
    });

    //问题1：easyui好像不能显示空的文件夹。。。会把他识别成文件。。--》加入空文件的方式得以改善
    $("#addFolder").on("click", function () {
        var folderName = prompt("请输入新建的文件夹名", "");
        if (folderName !== null && folderName.trim() !== "") {//文件夹名不能为空
            //注：应该正则检验一下特殊字符
            var fNode = $("#tt3").tree("getSelected");
            if (fNode !== null) { //是否选中的文件夹
                if (fNode.id % 2 === 0) {
                    //选中的是个文件 因此要找到其所在文件夹的
                    fNode = $("#tt3").tree("getParent", fNode.target);
                }
                //填充、提交表单
                $("#parentFolderID").val(fNode.id);
                $("#newFolderName").val(folderName);
                // $("#addFolderForm").submit();
                //使用jquery.form.min.js
                $("#addFolderForm").ajaxSubmit({
                    success: function () {
                        //刷新树 并选中之前的选
                        treeSelectID = fNode.id;
                        freshTree();
                    }
                });
            }
        }
        console.log(folderName)
    });

    //添加分享
    $("#addShareBtn").on("click", function () {
        var fNode = $("#tt3").tree("getSelected");
        if (fNode !== null) { //是否选中的文件夹
            // var action = "/share/addShare";
            // var params = [{"name": "shareID", "val": fNode.id}];
            // submitForm(action, params);
            $.ajax({
                url: "/net-disk/share/addShare",
                type: "post",
                data: {"shareID": fNode.id},
                success: function (data) {
                    freshTree();
                    console.log(data);
                }
            });
        }
    });

    //删除分享
    $("#deleteShare").on("click", function () {
        var fNode = $("#tt4").tree("getSelected");
        //跳到最外层
        while ($("#tt4").tree("getParent", fNode.target) !== null) {
            fNode = $("#tt4").tree("getParent", fNode.target);
        }
        // submitForm("/share/deleteShare", [{"name": "shareID", "val": fNode.id}]);

        $.ajax({
            url: "/net-disk/share/deleteShare",
            type: "post",
            data: {"shareID": fNode.id},
            success: function (data) {
                freshTree();
                console.log(data);
            }
        });
    });

    //复制分享链接
    $("#copyURL").on("click", function () {
        var fNode = $("#tt4").tree("getSelected");
        //跳到最外层
        while ($("#tt4").tree("getParent", fNode.target) !== null) {
            fNode = $("#tt4").tree("getParent", fNode.target);
        }
        //拼接URL
        var href = window.location.href;
        var split = href.split("/");
        var link = "http://" + split[2] + "/net-disk/share/s/" + fNode.text;

        window.prompt("Copy to clipboard: Ctrl+C, Enter", link);
    });

    //修改文件夹/文件名
    $("#editFileOrFolder").on("click", function () {
        var fNode = $("#tt3").tree("getSelected");
        if (fNode !== null) {//需要在选中文件树的情况下
            var NewfolderName = prompt("请输入新的文件夹/文件名", fNode.text);
            if (NewfolderName !== fNode.text) {//提交的是不同的名称
                $.ajax({
                    url: "/net-disk/folder/editFolderOrFileName",
                    type: "post",
                    async: false,
                    data: {"fID": fNode.id, "newName": NewfolderName},
                    success: function (data) {
                        //选择修改的ID
                        treeSelectID = fNode.id;
                        freshTree();
                    }
                });

            }
        }
    });

    //删除文件夹、文件
    $("#deleteFileOrFolder").on("click", function () {
        var msg = "您真的确定要删除吗？\n\n请确认！";
        if (confirm(msg) === true) {
            var fNode = $("#tt3").tree("getSelected");
            if (fNode !== null) {//需要在选中文件树的情况下
                $.ajax({
                    url: "/net-disk/folder/deleteFolderOrFile",
                    type: "post",
                    data: {"fID": fNode.id},
                    success: function (data) {
                        flag = 0; //指向主目录
                        freshTree();
                        console.log(data);
                    }
                });
            }
        }
    });

    //测试右键点击 好像不太行
    $("#categoryChooseDiv").mousedown(function (e) {
        // alert(e.which) // 1 = 鼠标左键 left; 2 = 鼠标中键; 3 = 鼠标右键
        if (e.swich === 3) {
            $('#mm').menu('show', {left: e.pageX, top: e.pageY});
            e.preventDefault();
        }
        return false;//阻止链接跳转
    });

    //模拟表单提交 action为提交地址 params为一组json对象（需要传递的参数）
    //不使用了
    function submitForm(action, params) {
        var form = $("<form></form>");
        form.attr('action', action);
        form.attr('method', 'post');
        form.attr('target', '_self');
        for (var i = 0; i < params.length; i++) {
            var input1 = $("<input type='hidden' name='" + params[i].name + "' />");
            input1.attr('value', params[i].val);
            form.append(input1);
        }
        form.appendTo("body");
        form.css('display', 'none');
        form.submit();
    }


    // $("#test").on("click", function () {
    //     try {
    //         var fNode = $("#tt3").tree("getSelected");
    //         var parenstNode = $("#tt3").tree("getParent", fNode.target);
    //         console.log("选中的节点为 : " + fNode.id + " " + fNode.text);
    //         console.log("选中的父节点为 : " + parenstNode.id + " " + parenstNode.text);
    //     } catch (e) {
    //         console.log("发生错误");
    //     }
    //
    //     console.log(fNode === null);
    //     console.log(parenstNode === null);
    //     console.log(parenstNode === undefined);
    // });
});


