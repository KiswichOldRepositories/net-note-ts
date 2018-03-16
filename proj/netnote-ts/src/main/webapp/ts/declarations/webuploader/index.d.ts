//部分功能的webuploader


declare  module "Webuploader"{
    export  function create(param: any): webUploaderEntry
}

interface  webUploader {
    create(param: any): webUploaderEntry,
}

interface webuploaderFile{
    name:string,
    size:number,
    type:string,
    lastModifiedDate:Date,
    id:number,
    ext:string,
    statusText:string,
    setStatus(status:any,statusText?:string):void;
    Status:any,
}

interface webUploaderEntry{
    getFiles():webuploaderFile[],
    upload(file:webuploaderFile):void,
    //事件的回调接口
    on(option:string,callback:Function):void;
    reset():void;
    option(key:string,value:string);
}


