/// <reference path="./jquery.d.ts" />

/** key-value paires： {key1:value1, key2:value2, ...} */
declare interface Map<T> {
    [key: string]: T;
}

interface BrowserInfo {
    isIE:boolean;
    version:string;
}
interface UrlInfo {
    baseUrl:string;
    anchor:string;
    params:any;
}

interface XWindowCall {
    initialize():void;
    destroy():void;
    callMethod(target:Window, method:string, args?:Array<any>):any;
}

interface WindowMessage {
    supprted:boolean;
    postPorts:string;
    messageHandler(key:string, data:any):void;
    addMessageListener(l:Function):void;
    removeMessageListener(l:Function):void;
    initialize():void;
    destroy():void;
    post(key:string, data:any):void;
}

interface XDomainChecker {
    checked:boolean;
    xDomain:boolean;
    mainDomain:string;
    currentDomain:string;
}

interface Overlay {
    show(elms?:any):void;
    hide():void;
}

interface SelectionChangeCallback {
    (e:any):void;
}

/*interface ScooperUtil {
    version: string;
    browser: BrowserInfo;
    hostUrl: string;
    contextPath: string;
    baseUrl: string;
    isTopFrame(): boolean;
    findTopFrame(): Window;
    inTheElectron(): boolean;
    currentScriptUrl(): string;
    htmlEncode(html:string): string;
    htmlDecode(html:string): string;
    urlParam(url:string,name:string,value:string):string;
    parseUrl(url:string):UrlInfo;
    addEventListener(element:HTMLElement, eventName:string, listener:Function):void;
    removeEventListener(element:HTMLElement, eventName:string, listener:Function):void;
    xWindowCall:XWindowCall;
    windowMessage:WindowMessage;
    xDomainChecker:XDomainChecker;
    overlay:Overlay;
    LeftNavi:LeftNavi;
    TabPage:TabPage;
    TabPage2:TabPage2;
    SingleSelection;
    Cache;
    SCMap;
}*/

declare module "scooper.util" {
    //export = util;
    export var version: string;
    export var browser: BrowserInfo;
    export var hostUrl: string;
    export var contextPath: string;
    export var baseUrl: string;
    export function isTopFrame(): boolean;
    export function findTopFrame(): Window;
    export function inTheElectron(): boolean;
    export function currentScriptUrl(): string;
    export function htmlEncode(html:string): string;
    export function htmlDecode(html:string): string;
    export function urlParam(url:string,name:string,value:string):string;
    export function parseUrl(url:string):UrlInfo;
    export function addEventListener(element:HTMLElement, eventName:string, listener:Function):void;
    export function removeEventListener(element:HTMLElement, eventName:string, listener:Function):void;
    export var xWindowCall:XWindowCall;
    export var windowMessage:WindowMessage;
    export var xDomainChecker:XDomainChecker;
    export var overlay:Overlay;
    
    export class LeftNavi {
        initialize(cfg?:any):void;
    }

    export class TabPage {
        select(tab:any):void;
        selectByIndex(idx:number):void;
        onSelectionChange:SelectionChangeCallback;
    }
    export class TabPage2 {
        select(tab:any):void;
        selectByIndex(idx:number):void;
        getSelectedIndex():number;
        onSelectionChange:SelectionChangeCallback;
    }

    export class SingleSelection {
        constructor(cfgs:Array<{$list:JQuery,selector:string}>);
        getSelection():any;
        setSelection(e:any):void;
        setSelectionByIndex(idx:number):void;
        getSelectionIndex():number;
        onSelectionChange:SelectionChangeCallback;
    }

}
//declare var util: ScooperUtil;
