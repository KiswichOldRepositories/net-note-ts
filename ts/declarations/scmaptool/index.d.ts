/// <reference path="../scmap/index.d.ts" />

// TODO 需完善


namespace scmaptools {

    declare class EventDispatcher {
        addListener(type, handler:Function, key?);
        removeListener(type, handler:Function);
        dispatch(e,opts?);
    }

    /**
     * 地图绘制工具
     */
    declare class DrawManager extends EventDispatcher {
        constructor(map:MapOp,opts?:any);
        /**
         * 开启地图的绘制模式
         */
        open();
        /**
         * 关闭地图的绘制状态
         */
        close();
        /**
         * 设置当前的绘制模式，参数DrawingType
         * @param {DrawingType} DrawingType
         * @return {Boolean} 
         */
        setDrawingMode(drawType:any);
        /**
         * 获取当前的绘制模式
         * @return {DrawingType} 绘制的模式
         */
        getDrawingMode():any;
        /**
         * 设置样式
         */
        setStyleOptions(type:string,opts?:any);
    }
    declare class InfoBox extends EventDispatcher {
        data();
        open();
        close();
        getBtn(id:string):any;
        removeBtn(id:string):any;
        createBtn(key:string,opt?:any);
        replaceBtn(id:string,opt?:any);
        setOptions(opts:any,isReset?:boolean);
        getSelItems();
        clearSelItems();
        alterListParams(id,key,val);
        enableCheck(id,able);
        addListener(type:string,handler:Function,key:string);
        removeListener(type:string,handler:Function);
        dispatch(e,options):any;
    }
    declare class TextIcon {
        // TODO ...
    }
    declare class MarkerClusterer {
        // TODO ...
    }
    declare class HeatmapOverlay {
        // TODO ...
    }
    declare class DistanceTool {
        // TODO ...
    }
    declare class AreaTool {
        // TODO ...
    }

    declare type Enum = {
        drawType: {
            MARKER: 'marker',
            POLYLINE: 'polyline',
            CIRCLE: 'circle',
            POLYGON: 'polygon',
            RECTANGLE:'rectangle'
        };
    }

}// namespace scmaptools



declare interface SCMapTools {
    DrawManager:typeof scmaptools.DrawManager;
    InfoBox:typeof scmaptools.InfoBox;
    TextIcon:typeof scmaptools.TextIcon;
    MarkerClusterer:typeof scmaptools.MarkerClusterer;
    HeatmapOverlay:typeof scmaptools.HeatmapOverlay;
    DistanceTool:typeof scmaptools.DistanceTool;
    AreaTool:typeof scmaptools.AreaTool;
    Enum:scmaptools.Enum;
}

declare interface SCMapToolsCreator {
    (entity:SCMap):SCMapTools;
}

declare module "scmaptool" {
    export = scMapToolCreator;
}
declare var scMapToolCreator:SCMapToolsCreator;
