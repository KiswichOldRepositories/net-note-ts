// TODO 需完善

declare interface SCMap {
    createPoint(lng:number, lat:number):Point;
    createPixel(x:number,y:number):Pixel;
    createBounds(nw:Point,se:Point):Bounds;
    createSize(width:number,height:number):Size;
    createMap(div:any,opt?:MapOptions):MapOp;
    createMapType(name:string,layer:string,opts?:MapTypeOptions):MapType;
    createIcon(url:string,size:Size,offset:any):Icon;
    createMarker(point:Point,opt?:MarkerOptions):Marker;
    createLabel(content:string,opt?:any):Label;
    createPolyline(path:Point[],opt?:any):Polyline;
    createLineRing(path:Point[],opt?:any):LineRing;
    createPolygon(path:Point[],opt?:any):Polygon;
    createCircle(center:Point, radius:number, opt?:any):Circle;
    createInfoWindow(content:string, opt?:any):InfoWindow;
    createScaleControl():ScaleControl;
    createOverviewMapControl(opts?:any):OverviewMapControl;
    createPanzoomControl(opts?:any):PanzoomControl;
    extendOverlay(Constructor,add:Function,draw:Function);
}


declare interface MapTypeOptions {
    minZoom:number;
    maxZoom:number;
}
declare interface MapOptions extends MapTypeOptions {
    mapType?:MapType;
}
declare interface MarkerOptions {
    icon?: Icon;
    enableDragging?: boolean;
    label?: Label;
}

declare interface Equalsable {
    /**
     * 判断是否相等
     */
    equals(other):boolean;
}

/**
 * 坐标点
 */
declare interface Point extends Equalsable {
    constructor(lng:number,lat:number);
    constructor(point:any);
    lng:number;
    lat:number;
    /** 地图原始对象 */
    point:any;
}
/**
 * 像素点，坐标原点在地图窗口的左上角
 */
declare interface Pixel extends Equalsable {
    constructor(x:number,y:number);
    constructor(pixel:any);
    x:number;
    y:number;
    /** 地图原始对象 */
    pixel:any;
}
/**
 * 矩形边界范围
 */
declare interface Bounds extends Equalsable {
    constructor(ne:Point,sw:Point);
    constructor(bounds:any);
    minX:number;
    minY:number;
    maxX:number;
    maxY:number;
    bounds:any;
    containsPoint(point:Point):boolean;
    containsBounds(bounds:Bounds):boolean;
    intersects(other:Bounds):boolean;
    extend(point:Point):void;
    getCenter():Point;
    getNorthEast():Point;
    getSouthWest():Point;
}
/**
 * 像素坐标表示的矩形大小
 */
declare interface Size extends Equalsable {
    constructor(width:number,height:number);
    constructor(size:any);
    width:number;
    height:number;
    size:any;
}

/**
 * 地图操作接口对象
 */
declare interface MapOp {
    /** 地图原生对象 */
    map:any;
    /**
     * 获取地图缩放最小级别
     */
    getMinZoom():number;
    /**
     * 获取地图缩放最大级别
     */
    getMaxZoom():number;
    /**
     * 设置地图缩放最小级别，不得小于地图类型的最小级别
     */
    setMinZoom(num:number):void;
    /**
     * 设置地图缩放最大级别，不得大于地图类型的最大级别
     */
    setMaxZoom(num:number):void;
    /**
     * 改变鼠标样式
     */
    setDefaultCursor(css:string):void;
    /**
     * 开启滚轮
     */
    enableScrollWheelZoom():void;
    /**
     * 关闭滚轮
     */
    disableScrollWheelZoom():void;
    /**
     * 获取当前视野的边界
     * @return {Bounds}
     */
    getBounds():Bounds;
    /**
     * 获取中心点
     * @returns {Point}
     */
    getCenter():Point;
    /**
     * 获取当前视野的大小，单位像素
     * @returns {Size}
     */
    getSize():Size;
    /**
     * 返回当前地图的缩放级别
     * @returns {Number}
     */
    getZoom():number;
    /**
     * 返回当前地图的地图类型
     * @returns {MapType}
     */
    getMapType():MapType;
    /**
     * 设置地图中心点和缩放级别，初始化地图
     * @param {Point} point 中心点经纬度
     * @param {Number} zoom 缩放级别
     */
    centerAndZoom(point:Point, zoom:number):void;
    /**
     * 移动地图
     * @param {Point} point 地图移动到该点
     */
    panTo(point:Point):void;
    /**
     * 移动地图
     * @param {Number} x x轴方向
     * @param {Number} y y轴方向
     */
    panBy(x:number,y:number,flag?:boolean);
    /**
     * 重置地图
     */
    reset();
    /**
     * 设置地图中心点
     * @param {Point} point 中心点坐标
     */
    setCenter(point:Point);
    /**
     * 设置地图类型
     * @param {MapType} mapType 地图类型
     */
    setMapType(mapType:MapType);
    /**
     * 设置地图缩放级别
     * @param {Number} zoom 缩放级别
     */
    setZoom(zoom:number);
    /**
     * 添加覆盖物
     * @param {Overlay} overlay
     */
    addOverlay(overlay:Overlay);
    /**
     * 添加一组覆盖物
     * @param {Array<Overlay>} overlays 覆盖物组
     */
    addOverlays(overlays:Overlay[]);
    /**
     * 在固定点，打开信息窗口
     * @param {InfoWindow} infoWindow 信息窗口
     * @param {Point} point 经纬度
     */
    openInfoWindow(infoWindow,point);
    /**
     * 移除覆盖物
     * @param {Overlay} overlay 覆盖物
     */
    removeOverlay(overlay:Overlay);
    /**
     * 清除所有覆盖物
     */
    clearOverlays();
    /**
     * 关闭打开的信息窗口
     */
    closeInfoWindow();
    /**
     * 获取地图容器
     * @returns {DOMObject}
     */
    getContainer():HTMLElement;
    /**
     * 获取地图上打开的信息窗口
     * @return {InfoWindow}
     */
    getInfoWindow():InfoWindow;
    /**
     * 获取地图上所有覆盖物
     * @returns {Array<Overlay>}
     */
    getOverlays():Overlay[];
    /**
     * 获取地图容器
     * @returns {Array<DOMObject>}
     */
    getPanes():HTMLElement[];
    /**
     * 像素转经纬度
     * @param {Pixel} pixel 像素坐标
     * @returns {Point}
     */
    pixelToPoint(pixel:Pixel):Point;
    /**
     * 经纬度转像素
     * @param {Point} point 经纬度坐标
     * @returns {Pixel}
     */
    pointToPixel(point:Point):Pixel;
    /**
     * 经纬度转像素【坐标原点是地图的中心点】
     * @param {Point} point 经纬度坐标
     * @returns {Pixel}
     */
    pointToOverlayPixel(point:Point):Pixel;
    /**
     * 两点间距离
     * @param {Point} start 起始点经纬度
     * @param {Point} end 借宿点经纬度
     * @returns {Number}
     */
    getDistance(start:Point, end:Point):number;
    /**
     * 注册事件
     * @param {String} eventName 事件名称
     * @param {function} callback 回调函数
     */
    addListener(eventName:string, callback:Function):any;
    /**
     * 销毁事件
     */
    removeListener(mapsEventListener:any):void;
    /**
     * 派发事件
     */
    dispatch(type:string):void;
}//SCMap

declare interface MapType {
    constructor(name:string,opts?:MapTypeOptions);
    constructor(mapType:any);
    tileLayer:any;
    /** 地图原始对象 */
    mapType:any;
    /**
     * 设置瓦片图片地址
     * @param url 瓦片地图地址 eg：'/scgis/satellite?'
     */
    setTilesUrl(url:string);
    getName():string;
    getMinZoom():number;
    getMaxZoom():number;
}

declare interface EventDispatcher {
    addListener(eventName,callback);
    removeListener(mapsEventListener);
    dispatch(type);
}

/**
 * 所有覆盖物类的父类
 */
declare interface Overlay {
    /** 地图原始对象 */
    overlay:any;
}
declare interface Icon extends Overlay {
    constructor(url:string, size:Size, offset?:any);
    constructor(overlay:any);
    setUrl(url:string);
    getUrl():string;
    setSize(size:Size);
    getSize():Size;
    setOffset(offset:Size);
    getOffset():Size;
}
declare interface Marker extends Overlay, EventDispatcher {
    constructor(point:Point, opt?:MarkerOptions);
    constructor(overlay:any);
    openInfoWindow(infoWindow:InfoWindow);
    closeInfoWindow();
    getPosition():Point;
    setPosition(point:Point);
    getLabel():Label;
    setLabel(label:Label);
    setZIndex(index:number);
    enableDragging();
    disableDragging();
    setIcon(icon:Icon);
    getIcon():Icon;
    /**
     * marker置顶。只支持百度
     */
    setTop(top:boolean);
}
declare interface Label extends Overlay {
    constructor(content:string, opt?:any);
    constructor(overlay:any);
    setTitle(title:string):void;
    setStyle(style:any):void;
    setContent(content:string):void;
            // TODO ...
            // TODO ...
            // TODO ...
            // TODO ...
            // TODO ...
}
/**
 * 几何图形类父类
 * @class
 */
declare interface Geometry extends Overlay, EventDispatcher {
    constructor(opt:any);
    show();
    hide();
    /**
     * 设置画笔颜色
     */
    setStrokeColor(color);
    /**
     * 获取画笔颜色
     */
    getStrokeColor();
    /**
     * 设置画笔透明度
     */
    setStrokeOpacity(opacity);
    /**
     * 获取画笔透明度
     */
    getStrokeOpacity();
    /**
     * 设置画笔粗度
     */
    setStrokeWeight(weight);
            // TODO ...
            // TODO ...
            // TODO ...
            // TODO ...
            // TODO ...
    /**
     * 开启编辑
     */
    enableEditing();
    /**
     * 关闭编辑
     */
    disableEditing();
}
declare interface Polyline extends Geometry {
    constructor(path?:Point[], opt?:any);
    setPath(path:Point[]);
    getPath():Point[];
    setPositionAt(index:number,point:Point);
}
declare interface LineRing extends Polyline {
    constructor(path?:any, opt?:any);
            // TODO ...
            // TODO ...
            // TODO ...
            // TODO ...
            // TODO ...
}
declare interface Polygon extends Polyline {
    constructor(path?:any, opt?:any);
    setFillColor(color);
    getFillColor();
    setFillOpacity(opacity);
    getFillOpacity();
}
declare interface Circle extends Geometry {
    constructor(center:Ponit,radius:number, opt?:any);
    constructor(overlay:any);
            // TODO ...
            // TODO ...
            // TODO ...
            // TODO ...
            // TODO ...
}
            // TODO ...
            // TODO ...
            // TODO ...
            // TODO ...
            // TODO ...
/**
 * 信息框
 */
declare interface InfoWindow extends Overlay {
    constructor(content:string, opt?:any);
    constructor(overlay:any);
}

//// 控件

/**
 * 地图控件
 */
declare interface MapControler {
    type:string;
    option?:any;
    $control?:any;
}

/**
 * 平移缩放控件（鱼骨）
 */
declare interface PanzoomControl extends MapControler {
}

/**
 * 比例尺控件
 */
declare interface ScaleControl extends MapControler {
}

/**
 * 鹰眼控件
 */
declare interface OverviewMapControl extends MapControler {
}

declare module "scmap" {
    export function createMapEntity(type:string):SCMap;
    export const Enum = {
        mapServer: {
            BAIDU: 'baidu',
            GOOGLE: 'google',
            SUPER: 'super'
        }
    };
}
