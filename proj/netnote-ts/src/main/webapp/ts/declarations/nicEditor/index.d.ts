

interface InicEditor{
    addInstance(someElementsID:string):void;
    removeInstance(someElementsID:string):void;
    setPanel(someElementsID:string):void;
    panelInstance(someElementsID:string):void;
    instanceById(someElementID:string):void;
    floatingPanel():void;
}

interface InicEditors{
    findEditor(id:string):nicInstance;
    allTextAreas():nicInstance[];
    editors:nicInstance[];
}

interface  nicInstance{
    getContent():string;
    setContent(html:string);
}

declare var nicEditor:InicEditor;

declare  var nicEditors:InicEditors;