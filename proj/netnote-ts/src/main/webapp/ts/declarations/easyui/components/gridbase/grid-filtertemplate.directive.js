/**
 * EasyUI for Angular 0.7
 * 
 * Copyright (c) 2009-2017 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: https://www.jeasyui.com/license_freeware2.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
import{Directive,ViewContainerRef,Input}from"@angular/core";var GridFilterTemplateDirective=function(){function GridFilterTemplateDirective(viewContainer){this.viewContainer=viewContainer}return GridFilterTemplateDirective.prototype.ngOnInit=function(){this.view=this.viewContainer.createEmbeddedView(this.template,{$implicit:this.column})},GridFilterTemplateDirective.prototype.ngOnDestroy=function(){this.view.destroy()},GridFilterTemplateDirective}();export{GridFilterTemplateDirective};GridFilterTemplateDirective.decorators=[{type:Directive,args:[{selector:"[euiGridFilterTemplate]"}]}],GridFilterTemplateDirective.ctorParameters=function(){return[{type:ViewContainerRef}]},GridFilterTemplateDirective.propDecorators={column:[{type:Input}],template:[{type:Input,args:["euiGridFilterTemplate"]}]};