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

//easyui 节点解释：                        id: node id, which is important to load remote data
                                          text: node text to show
                                          state: node state, 'open' or 'closed', default is 'open'. When set to 'closed', the node have children nodes and will load them from remote site
                                          checked: Indicate whether the node is checked selected.
                                          attributes: custom attributes can be added to a node
                                          children: an array nodes defines some children nodes


//*************************************目录API  START  *************************************//

//获取目录结构(easyui)
GET ${url}/v1/dir
参数：
返回结果：   json [{id:?,text:?,state:?,checked:?,attributes:?,children:?},..]
              
//获取目录结构(easyui)
GET ${url}/v1/dir/ztree
参数：
返回结果：   APIObjectJson.data: [{id:?,pId:?,name:?,checked:?,isIsParent:?},..]

//添加目录到数据库
POST  ${url}/v1/dir/{pid}
参数：    name = #{dirName}
返回结果：   APIObjectJson.data:{id:?,dirName:?,parentId:?,userId:?}

//删除数据库中的目录
DELETE ${url}/v1/dir/{mid}
参数：
返回结果：APIObjectJson

//更新目录名称
PATCH ${url}/v1/dir/{mid}
参数：    name = #{dirName}
返回结果：   APIObjectJson.data:{id:?,dirName:?,parentId:?,userId:?}

//更新目录位置（目录、笔记）    
PATCH ${url}/v1/dir/{mid}
参数：     parentId=#{pid}
返回结果：   APIObjectJson.data:{id:?,dirName:?,parentId:?,userId:?}

//*************************************目录API  END  *************************************//


//*************************************笔记API  START  *************************************//

//提交笔记
POST ${url}/v1/note/{pid}
参数：     noteName=#{noteName} noteText=#{noteText}
返回结果：APIObjectJson.data:{id:?,noteName:?,noteText:?,createtime:?,parentDirId:?,userId:?}

//删除笔记
DELETE ${url}/v1/note/{mid}
参数：
返回结果：APIObjectJson

//修改笔记
PATCH ${url}/v1/note/{mid}
参数：     text=#{noteText}/noteName=#{noteName}
返回结果：APIObjectJson.data:{id:?,noteName:?,noteText:?,createtime:?,parentDirId:?,userId:?}

//移动笔记
PATCH ${url}/v1/note/{mid}
参数：     parentId=#{pid}
返回结果：APIObjectJson.data:{id:?,noteName:?,noteText:?,createtime:?,parentDirId:?,userId:?}

//搜索笔记(easyui)
GET ${url}/v1/note
参数:     tags=#{tagName;tagName;tagName}
返回结果： json [{id:?,text:?,state:?,checked:?,attributes:?,children:?},..]

//搜索笔记(ztree)
GET ${url}/v1/note/tree
参数:     tags=#{tagName;tagName;tagName}
返回结果： APIObjectJson.data:[{id:?,pId:?,name:?,checked:?,isIsParent:?},..]

//获取笔记信息
GET ${URL}/v1/note/{mid}
参数:
返回结果:APIObjectJson.data:{id:?,noteName:?,noteText:?,createtime:?,parentDirId:?,userId:?}

//*************************************笔记API  END  *************************************//


//*************************************附件API  START  *************************************// 

//上传附件
POST ${url}/v1/attach/{parentNoteId}
参数：     file=#{file}
返回结果：APIObjectJson

//下载附件
GET ${url}/v1/attach/{attachId}
参数：
返回结果：       FILE

//显示附件
GET ${url}/v1/note/{noteId}/attach
参数：
返回结果：       APIObjectJson.data:[{id:id,filename:filename,size:size},{......},......]
                    
//删除附件
DELETE ${url}/v1/attach/{attachId}
参数：
返回结果：APIObjectJson

//*************************************附件API  END  *************************************//

//*************************************分享API  START  *************************************//

//添加到分享
POST ${url}/v1/share/{dirOrNoteId}
参数：
返回结果：APIObjectJson.data:{id:?,url:?,noteOrDirId:?,type:?,userId:?}

//删除分享
DELETE ${url}/v1/share/{shareId}
参数：
返回结果:APIObjectJson

//展示分享（根据用户）(easyui)
GET ${url}/v1/share
参数：
返回结果:       json  [{id:?,text:?,iconCls:?,checked:?,state:?,attributes:?,children:?},..]  

//展示分享（根据用户）(ztree)
GET ${url}/v1/share/ztree
参数：
返回结果:      APIObjectJson.data:[{id:?,pId:?,name:?,checked:?,isIsParent:?},..] 
              
//展示分享（根据URL）(easyui)
GET ${url}/v1/share/{shareURL}
参数：
返回结果:       json [{id:?,text:?,iconCls:?,checked:?,state:?,attributes:?,children:?},..]  

//展示分享（根据URL）(ztree)
GET ${url}/v1/share/ztree/{shareURL}
参数：
返回结果:        APIObjectJson.data:[{id:?,pId:?,name:?,checked:?,isIsParent:?},..]  

//下载和查看内容 就使用附件和笔记的api

//*************************************分享API  END  *************************************//

//*************************************标签API  START  *************************************//

//展示标签
GET ${url}/v1/tag/{noteId}
参数：
返回结果:        APIObjectJson.data:[{id,tagName},...] 

//添加标签
POST ${url}/v1/tag/{noteId}
参数：    tagName=#{tagname}
返回结果:       APIObjectJson.data:[{id,tagName},...] 

//删除标签
DELETE ${url}/v1/tag/{tagId}
参数:     noteId=#{noteId}
返回结果:        APIObjectJson


//*************************************标签API  END  *************************************//

//*************************************用户API  START  *************************************//

//注册
POST ${url}/v1/user/signin
参数：     username=#{username},password=#{password}
返回结果：APIObjectJson

//登录 
POST ${url}/v1/user/signup
参数：
返回结果：APIObjectJson

//检查是否登录成功
GET ${url}/v1/user/check
参数：
返回结果:APIObjectJson

//登出
POST ${url}/v1/user/signout
参数：
返回结果:APIObjectJson



//*************************************用户API  END  *************************************//