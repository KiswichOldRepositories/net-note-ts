$(function () {
    var shareFlags = $("#shareFlag").val();
    console.log(shareFlags);
    //异步加载不能写data属性
    $('#tt5').tree({
        url: '/net-disk/comShare/showFolders/'+shareFlags,
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
            var newNode = $('#tt5').tree('find', data[0].id);
            $('#tt5').tree('select', newNode.target);
        }
    });

    $("#download").bind("click",function () {
        var fNode = $("#tt5").tree("getSelected");
        var tree = $("#tt5").tree('getRoot');

        if(fNode === tree){//选择了主节点
            fNode = $("#tt5").tree('getChildren',tree.target)[0];
        }

        submitForm("/net-disk/comShare/getShows",[
            {"name":"shareID",
            "val":fNode.id}
        ]);
        // if(fNode == tree)
        // if (fNode !== null) {
        //     if (fNode.id % 2 === 0) {
        //
        //         //选中的是个文件 可以提交下载
        //         $("#folderTreeID").val(fNode.id);
        //         $("#downloadForm").submit();
        //
        //     } else {
        //         //选中的是文件夹 会下载到zip压缩包
        //         $("#folderTreeID").val(fNode.id);
        //         $("#downloadForm").submit();
        //     }
        // }


    });



    //模拟表单提交 action为提交地址 params为一组json对象（需要传递的参数）
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

});