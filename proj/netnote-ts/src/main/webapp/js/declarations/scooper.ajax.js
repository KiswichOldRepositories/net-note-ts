define(["require", "exports", "jquery", "es6-promise"], function (require, exports, $) {
    "use strict";
    exports.__esModule = true;
    /**
     * Ajax调用返回码定义
     * @enum {number}
     */
    var AjaxResultCode;
    (function (AjaxResultCode) {
        /**	操作成功	*/
        AjaxResultCode[AjaxResultCode["SUCC"] = 0] = "SUCC";
        /**	操作失败	*/
        AjaxResultCode[AjaxResultCode["FAIL"] = 1000] = "FAIL";
        /*------------------ 调用者鉴权: (1000, 1100) ------------------*/
        /**	Token不存在	*/
        AjaxResultCode[AjaxResultCode["TOKEN_NOEXIST"] = 1001] = "TOKEN_NOEXIST";
        /**	Token已到期	*/
        AjaxResultCode[AjaxResultCode["TOKEN_EXPIRED"] = 1002] = "TOKEN_EXPIRED";
        /**	访问频率超限	*/
        AjaxResultCode[AjaxResultCode["ACCESS_FRE_OVER"] = 1003] = "ACCESS_FRE_OVER";
        /**	无API访问权限	*/
        AjaxResultCode[AjaxResultCode["API_NO_PERM"] = 1004] = "API_NO_PERM";
        /**	API不存在	*/
        AjaxResultCode[AjaxResultCode["API_NOEXIST"] = 1005] = "API_NOEXIST";
        /**	IP无访问权限	*/
        AjaxResultCode[AjaxResultCode["IP_NO_PERM"] = 1006] = "IP_NO_PERM";
        /**	登录账号不存在	*/
        AjaxResultCode[AjaxResultCode["AUTH_USER_NOEXIST"] = 1020] = "AUTH_USER_NOEXIST";
        /**	登录密码错误	*/
        AjaxResultCode[AjaxResultCode["AUTH_PASSWORD_ERR"] = 1021] = "AUTH_PASSWORD_ERR";
        /*------------------ 调用者鉴权 -----------------END-*/
        /*------------------ 调用API时发生错误: [1100, 2000) ------------------*/
        /**	请求参数错误	*/
        AjaxResultCode[AjaxResultCode["PARAM_ERR"] = 1100] = "PARAM_ERR";
        /**	缺少参数	*/
        AjaxResultCode[AjaxResultCode["PARAM_NOEXIST"] = 1101] = "PARAM_NOEXIST";
        /**	数据不存在	*/
        AjaxResultCode[AjaxResultCode["DATA_NOEXIST"] = 1120] = "DATA_NOEXIST";
        /**	数据已存在	*/
        AjaxResultCode[AjaxResultCode["DATA_EXIST"] = 1121] = "DATA_EXIST";
        /**	文件格式错误	*/
        AjaxResultCode[AjaxResultCode["FILE_FMT_ERR"] = 1200] = "FILE_FMT_ERR";
        /*------------------ 调用API时发生错误 -----------------END-*/
        AjaxResultCode[AjaxResultCode["Unknow"] = -1] = "Unknow";
    })(AjaxResultCode = exports.AjaxResultCode || (exports.AjaxResultCode = {}));
    /**
     * AJAX辅助操作类
     * @class Ajax
     */
    var Ajax = /** @class */ (function () {
        /**
         * Creates an instance of Ajax.
         * @param {string} [ctxPath] 请求路径前缀
         *
         * @memberof Ajax
         */
        function Ajax(ctxPath) {
            // 快捷请求路径，通过 set(string, path) 方法设置
            this._pathMap = {};
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
        Ajax.prototype.request = function (action, param, retFn, errFn, method, useJson) {
            var _this = this;
            //request(action:string, param?:any, retFn?:AjaxResultCallback, errFn?:AjaxErrorCallback, method?:"get"|"post", useJson?:boolean):JQueryPromise<AjaxResult> {
            param = param || {};
            method = method || "get";
            var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
            if (useJson) {
                if (method != "post") {
                    throw new Error("only 'post' can useJson");
                }
                param = JSON.stringify(param);
                contentType = 'application/json; charset=UTF-8';
            }
            return new Promise(function (resolve, reject) {
                $.ajax({
                    async: true,
                    url: _this._contextPath + action,
                    type: method,
                    data: param,
                    dataType: 'json',
                    contentType: contentType
                }).done(function (ret) {
                    try {
                        if (ret && ret.code != 0) {
                            console.error(JSON.stringify(ret));
                        }
                        if (retFn)
                            retFn(ret);
                    }
                    catch (e) {
                        console.error(e);
                    }
                    resolve(ret);
                }).fail(function (err) {
                    try {
                        console.error(err);
                        if (errFn)
                            errFn(err);
                    }
                    catch (e) {
                        console.error(e);
                    }
                    reject(err);
                });
            });
        };
        /**
         * 设置快捷请求路径
         *
         * @param {string} key
         * @param {string} path
         *
         * @memberof Ajax
         */
        Ajax.prototype.setPath = function (key, path) {
            this._pathMap[key] = path;
        };
        /**
         * 获取预先设置的快捷请求路径
         *
         * @param {string} key
         * @param {string} action
         * @returns {string}
         *
         * @memberof Ajax
         */
        Ajax.prototype.getActionPath = function (key, action) {
            var path = this._pathMap[key] || '';
            return path + action;
        };
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
        Ajax.prototype.req = function (key, action, param, retFn, errFn, method, useJson) {
            return this.request(this.getActionPath(key, action), param, retFn, errFn, method, useJson);
        };
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
        Ajax.prototype.post = function (key, action, param, retFn, errFn, useJson) {
            return this.request(this.getActionPath(key, action), param, retFn, errFn, "post", useJson);
        };
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
        Ajax.prototype.postJson = function (key, action, param, retFn, errFn) {
            return this.request(this.getActionPath(key, action), param, retFn, errFn, "post", true);
        };
        return Ajax;
    }());
    exports.Ajax = Ajax;
});
//# sourceMappingURL=scooper.ajax.js.map