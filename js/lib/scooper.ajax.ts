/// <reference types="jquery" />
/// <amd-dependency path="es6-promise" />
import $ = require("jquery");

/** 外部变量，全局定义：Web容器路径 */
declare let contextPath: string;

/** key-value paires： {key1:value1, key2:value2, ...} */
export declare interface Map<T> {
    [key: string]: T;
}


/**
 * REST API 返回值对象格式定义
 */
export interface AjaxResult {
    /** 返回码 */
    code: number;
    /** 消息 */
    message: string;
    /** 数据 */
    data: any;
}

/**
 * 列表数据结果格式定义
 */
export interface AjaxDataList<T> {
    /** 列表数据 */
    list: Array<T>;
    /** 数据总数 */
    total: number;
}
/**
 * 分页查询结果格式定义
 * @extends {AjaxDataList}
 */
export interface AjaxDataPage<T> extends AjaxDataList<T> {
    /** 页码，从1开始 */
    pageNumber:number;
    /** 每页记录数 */
    pageSize:number;
}

/**
 * Ajax返回回调函数
 */
export interface AjaxResultCallback {
    (ret?:AjaxResult):void;
}
/**
 * Ajax错误回调函数
 */
export interface AjaxErrorCallback {
    (err?:any):void;
}

/**
 * Ajax调用返回码定义
 * @enum {number}
 */
export enum AjaxResultCode {
	/**	操作成功	*/
	SUCC 					= 0,
	/**	操作失败	*/
	FAIL 					= 1000,
	
	
	/*------------------ 调用者鉴权: (1000, 1100) ------------------*/	
	/**	Token不存在	*/
	TOKEN_NOEXIST			= 1001,
	/**	Token已到期	*/
	TOKEN_EXPIRED			= 1002,
	
	/**	访问频率超限	*/
	ACCESS_FRE_OVER			= 1003,
	/**	无API访问权限	*/
	API_NO_PERM				= 1004,
	/**	API不存在	*/
	API_NOEXIST				= 1005,
	/**	IP无访问权限	*/
	IP_NO_PERM				= 1006,
	
	/**	登录账号不存在	*/
	AUTH_USER_NOEXIST		= 1020,
	/**	登录密码错误	*/
	AUTH_PASSWORD_ERR		= 1021,
	/*------------------ 调用者鉴权 -----------------END-*/
	
	
	/*------------------ 调用API时发生错误: [1100, 2000) ------------------*/
	/**	请求参数错误	*/
	PARAM_ERR				= 1100,
	/**	缺少参数	*/
	PARAM_NOEXIST			= 1101,
	
	/**	数据不存在	*/
	DATA_NOEXIST			= 1120,
	/**	数据已存在	*/
	DATA_EXIST				= 1121,
	
	/**	文件格式错误	*/
	FILE_FMT_ERR			= 1200,
	
	/*------------------ 调用API时发生错误 -----------------END-*/	
	
    Unknow = -1
}

/**
 * AJAX辅助操作类
 * @class Ajax
 */
export class Ajax {

    // 快捷请求路径，通过 set(string, path) 方法设置
    private _pathMap:Map<string> = {};

    // 请求路径前缀
    private _contextPath:string;

    /**
     * Creates an instance of Ajax.
     * @param {string} [ctxPath] 请求路径前缀
     * 
     * @memberof Ajax
     */
    public constructor(ctxPath?:string) {
        this._contextPath = ctxPath || contextPath || "";
    }

    /**
     * 相对Web容器根目录调用 REST API
     * 
     * @param {string} action 请求路径
     * @param {*} [param] 请求参数
     * @param {AjaxResultCallback} [retFn] 返回回调
     * @param {AjaxErrorCallback} [errFn] 错误回调
     * @param {string} [method] get | post
     * @param {boolean} [useJson] 是否使用请求体来提交JSON数据（需要为"post"方式）
     * @returns {JQueryPromise} 
     * 
     * @memberof Ajax
     */
    request(action:string, param?:any, retFn?:AjaxResultCallback, errFn?:AjaxErrorCallback, method?:"get"|"post", useJson?:boolean):Promise<AjaxResult> {
    //request(action:string, param?:any, retFn?:AjaxResultCallback, errFn?:AjaxErrorCallback, method?:"get"|"post", useJson?:boolean):JQueryPromise<AjaxResult> {
        param = param || {};
        method = method || "get";
        var contentType:string = 'application/x-www-form-urlencoded; charset=UTF-8';
        if (useJson) {
            if (method != "post") {
                throw new Error("only 'post' can useJson");
            }
            param = JSON.stringify(param);
            contentType = 'application/json; charset=UTF-8';
        }
        return new Promise<AjaxResult>((resolve, reject)=>{
            $.ajax({
                async: true,
                url: this._contextPath + action,
                type: method,
                data: param,
                dataType: 'json',
                contentType: contentType
            }).done((ret:AjaxResult)=>{
                try {
                    if (ret && ret.code != 0) {
                        console.error(JSON.stringify(ret));
                    }
                    if (retFn) retFn(ret);
                } catch(e) {
                    console.error(e);
                }
                resolve(ret);
            }).fail((err:any)=>{
                try {
                    console.error(err);
                    if (errFn) errFn(err);
                } catch(e) {
                    console.error(e);
                }
                reject(err);
            });
        });
    }

    /**
     * 设置快捷请求路径
     * 
     * @param {string} key 
     * @param {string} path 
     * 
     * @memberof Ajax
     */
    setPath(key:string, path:string):void {
        this._pathMap[key] = path;
    }

    /**
     * 获取预先设置的快捷请求路径
     * 
     * @param {string} key 
     * @param {string} action 
     * @returns {string} 
     * 
     * @memberof Ajax
     */
    getActionPath(key:string, action:string):string {
        var path:string = this._pathMap[key] || '';
        return path + action;
    }

    /**
     * 以预先设置的快捷请求路径调用 REST API
     * 
     * @param {string} key 预先设置的快捷路径key
     * @param {string} action 请求路径
     * @param {*} [param] 请求参数
     * @param {AjaxResultCallback} [retFn] 返回回调
     * @param {AjaxErrorCallback} [errFn] 错误回调
     * @param {string} [method] get | post
     * @param {boolean} [useJson] 是否使用请求体来提交JSON数据（需要为"post"方式）
     * @returns {JQueryPromise} 
     * 
     * @memberof Ajax
     */
    req(key:string, action:string, param?:any, retFn?:AjaxResultCallback, errFn?:AjaxErrorCallback, method?:"get"|"post", useJson?:boolean):Promise<AjaxResult> {
        return this.request(this.getActionPath(key, action), param, retFn, errFn, method, useJson);
    }

    /**
     * 以预先设置的快捷请求路径调用 REST API
     * 
     * @param {string} key 预先设置的快捷路径key
     * @param {string} action 请求路径
     * @param {*} [param] 请求参数
     * @param {AjaxResultCallback} [retFn] 返回回调
     * @param {AjaxErrorCallback} [errFn] 错误回调
     * @param {boolean} [useJson] 是否使用请求体来提交JSON数据（需要为"post"方式）
     * @returns {JQueryPromise<AjaxResult>} 
     * 
     * @memberof Ajax
     */
    post(key:string, action:string, param?:any, retFn?:AjaxResultCallback, errFn?:AjaxErrorCallback, useJson?:boolean):Promise<AjaxResult> {
        return this.request(this.getActionPath(key, action), param, retFn, errFn, "post", useJson);
    }

    /**
     * 以预先设置的快捷请求路径调用 REST API
     * （以body里携带JSON格式数据方式）
     * 
     * @param {string} key 预先设置的快捷路径key
     * @param {string} action 请求路径
     * @param {*} [param] 请求参数
     * @param {AjaxResultCallback} [retFn] 返回回调
     * @param {AjaxErrorCallback} [errFn] 错误回调
     * @returns {JQueryPromise<AjaxResult>} 
     * 
     * @memberof Ajax
     */
    postJson(key:string, action:string, param?:any, retFn?:AjaxResultCallback, errFn?:AjaxErrorCallback):Promise<AjaxResult> {
        return this.request(this.getActionPath(key, action), param, retFn, errFn, "post", true);
    }

}
