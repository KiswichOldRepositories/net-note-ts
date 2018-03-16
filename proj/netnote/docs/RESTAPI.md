# REST API 定义

* 在此填上 REST API 相关路径、参数列表 及 返回结果格式。

{
    注：后台不能直接收到PUT/DELETE/PUTCH方式提交的表单中的内容
    采用POST方式的 Form URL Encoded表单提交，同时表单中加入一个_method字段，值为PUT/DELETE/PUTCH,spring将自动转换
}


<properties>
    <url>http://localhost:80/net-note/</url>
</properties>

// #{}表示一个占位符


//*************************************目录API  START  *************************************//

//获取目录结构
GET ${url}/v1/dir
返回结果：   json 
                id: node id, which is important to load remote data
                text: node text to show
                state: node state, 'open' or 'closed', default is 'open'. When set to 'closed', the node have children nodes and will load them from remote site
                checked: Indicate whether the node is checked selected.
                attributes: custom attributes can be added to a node
                children: an array nodes defines some children nodes

//添加目录到数据库
POST  ${url}/v1/dir/{pid}
参数：    name = #{dirName}
返回结果：目录信息的json字符串

//删除数据库中的目录
DELETE ${url}/v1/dir/{mid}
返回结果：none

//更新目录名称
PATCH ${url}/v1/dir/{mid}
参数：    name = #{dirName}.(放在url里)
返回结果：目录信息的json字符串

//更新目录位置（目录、笔记）    
PATCH ${url}/v1/dir/{mid}
参数：     parentId=#{pid}
返回结果：目录信息的json字符串

//*************************************目录API  END  *************************************//


//*************************************笔记API  START  *************************************//

//提交笔记
POST ${url}/v1/note/{pid}
参数：     noteName noteText 两个参数 分别是笔记名称，笔记内容
        
            @depar...
           递交如下所示的json字符串
           {
            "note":{
                "noteName":"This is noteName",
                "noteText":"This is noteText"
            }
            
           	"text":"this is note html",
           	"tagList":[
           		{
           			"name":"tagname1"
           		},
           		{
           			"name":"tagname2"
           		},
           		{
           			"name":"tagname3"
           		}
           	]
           }
返回结果：note的json字符串

//删除笔记
DELETE ${url}/v1/note/{mid}
返回结果：none

//修改笔记
PATCH ${url}/v1/note/{mid}
参数：     text=#{noteText}/noteName=#{noteName}
返回结果：none

//移动笔记
PATCH ${url}/v1/note/{mid}
参数：     parentId=#{pid}
返回结果：none

//搜索笔记
GET ${url}/v1/note
参数:     tagName=#{tagName}
返回结果： 笔记的json树

//获取笔记信息
GET ${URL}/v1/note/{mid}
返回结果:笔记的json树

//根据传入的标签来搜索笔记
GET ${url}/v1/note
参数：tags=#{tags(用;隔开每一个标签)}
返回：List<Note>
//*************************************笔记API  END  *************************************//


//*************************************附件API  START  *************************************//

//上传附件
POST ${url}/v1/attach/{parentNoteId}
参数：     file=#{file}
返回结果：none

//下载附件
GET ${url}/v1/attach/{attachId}
返回结果：       FILE

//显示附件
GET ${url}/v1/note/{noteId}/attach
返回结果：       json
                    [{id:id,filename:filename,size:size},{......},......]
                    
//删除附件
DELETE ${url}/v1/attach/{attachId}


//*************************************附件API  END  *************************************//

//*************************************分享API  START  *************************************//

//添加到分享
POST ${url}/v1/share/{dirOrNoteId}
返回结果：none

//删除分享
DELETE ${url}/v1/share/{shareId}
返回结果:none

//展示分享（根据用户）
GET ${url}/v1/share
返回结果:       json
                    [{id:id,shareURL:shareURL,}]
                            id: node id, which is important to load remote data
                            text: node text to show
                            state: node state, 'open' or 'closed', default is 'open'. When set to 'closed', the node have children nodes and will load them from remote site
                            checked: Indicate whether the node is checked selected.
                            attributes: custom attributes can be added to a node
                            children: an array nodes defines some children nodes

//展示分享（根据URL）
GET ${url}/v1/share/{shareURL}
返回结果:       json
                    [{id:id,shareURL:shareURL,}]
                            id: node id, which is important to load remote data
                            text: node text to show
                            state: node state, 'open' or 'closed', default is 'open'. When set to 'closed', the node have children nodes and will load them from remote site
                            checked: Indicate whether the node is checked selected.
                            attributes: custom attributes can be added to a node
                            children: an array nodes defines some children nodes

//下载和查看内容 就使用上面的api

//*************************************分享API  END  *************************************//

//*************************************标签API  START  *************************************//

//展示标签
GET ${url}/v1/tag/{noteId}
返回结果:       json
                    [{id:id,tagName:tagName},{......},......]

//添加标签
POST ${url}/v1/tag/{noteId}
参数：    tagName=#{tagname}

//修改标签
PATCH ${url}/v1/tag/{noteId}
参数:     tagList:json
                [{id:id,tagName:tagName},{......},......]

//删除标签
DELETE ${url}/v1/tag/{tagId}
参数:     tagId=#{noteId}


//*************************************标签API  END  *************************************//

//*************************************用户API  START  *************************************//

//注册
POST ${url}/v1/user/signin
参数：     username=#{username},password=#{password}
返回结果：success or error

//登录 
POST ${url}/v1/user/signup

//检查是否登录成功
GET ${url}/v1/user/check
200 500


//*************************************用户API  END  *************************************//