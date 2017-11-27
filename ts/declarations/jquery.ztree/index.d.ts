/// <reference path="./jquery.d.ts" />

interface JQueryZTreePlugin {
    init(obj:JQuery, zSetting?:any, zNodes?:any):JQueryZTreeObject;
    destroy(treeId:string):void;
    getZTreeObj(treeId:string):JQueryZTreeObject;
    _z:any;
}

interface JQueryZTreeObject {
    setting:any;
    addNodes(parentNode:any, index:number, newNodes:any, isSilent?:boolean):any;
    addNodes(parentNode:any, newNodes:any, isSilent?:boolean):any;
    cancelEditName(newName?:string):void;
    cancelSelectedNode(treeNode:any):void;
    checkAllNodes(checked:boolean):void;
    checkNode(treeNode:any, checked:boolean, checkTypeFlag:boolean, callbackFlag?:boolean):void;
    copyNode(targetNode:any, treeNode:any, moveType:string, isSilent?:boolean):any;
    destroy():void;
    editName(treeNode:any):void;
    expandAll(expandFlag:boolean):boolean;
    expandNode(node:any, expandFlag?:boolean, sonSign?:boolean, focus?:boolean, callbackFlag?:boolean):boolean;
    getChangeCheckedNodes():void;
    getCheckedNodes(checked:boolean):any;
    getNodeByParam(key:string, value:any, parentNode:any):any;
    getNodeByTId(tid:string):any;
    getNodeIndex(treeNode:any):number;
    getNodes():any[];
    getNodesByFilter(filter:Function, isSingle:boolean, parentNode:any, invokeParam:any):any[];
    getNodesByParam(key:string, value:any, parentNode:any):any[];
    getNodesByParamFuzzy(key:string, value:any, parentNode:any):any[];
    getSelectedNodes():any[];
    hideNode(treeNode:any):void;
    hideNodes(treeNodes:any[]):void;
    moveNode(targetNode:any, treeNode:any, moveType:string, isSilent?:boolean):any;
    reAsyncChildNodes(parentNode:any, reloadType:string, isSilent?:boolean):void;
    refresh():void;
    removeChildNodes(parentNode:any):any[];
    removeNode(treeNode:any, callbackFlag:boolean):void;
    selectNode(treeNode:any, addFlag?:boolean, isSilent?:boolean):void;
    setChkDisabled(node:any, disabled:boolean, inheritParent?:boolean, inheritChildren?:boolean):void;
    setEditable(editable:boolean):void;
    showNode(treeNode:any):void;
    showNodes(treeNodes:any[]):void;
    transformToArray(treeNodes:any[]):any[];
    transformTozTreeNodes(simpleNodes:any[]):any[];
    updateNode(treeNode:any, checkTypeFlag?:boolean):void;
}

interface JQuery {
    zTree: JQueryZTreePlugin;
}
