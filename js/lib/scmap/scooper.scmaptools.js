/**
 * @file 地图工具类
 * @version 1.0.4
 * 
 * @update 2017-05-3
 * 合并点聚合调整
 * 标绘增加矩形
 * 
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('jquery'));
    } else {
        // 浏览器全局变量(root 即 window)
    	root.scooper = root.scooper || {};

        root.scooper.SCMapTools = factory(root.jQuery,root['h337']);
    }
}(this, function ($,heatmapFactory) {
	"use strict";
	function Tools(entity){
		
		var _entity = entity,
			Enum = {};
		/**
		 * 唯一标识id
		 */
		
		var GUID = 1;
		
		/**
		 * 为事件添加唯一标识字符串
		 */
		function guid(){
		    return 'SCMap_ID_'+ (GUID++).toString();
		}
		
		/**
		 * event 对象，
		 * 为自定义对象添加事件机制，
		 * 处理event对象。
		 * 对dom元素事件监听，利用jquery的机制
		 */
		var scmapEvent = {
				/**
				 * 事件对象包装类，通过事件type，加载必要的属性
				 *  @class
				 */
				Event: function(type,target){
				    this.type = type;
				    this.returnValue = true;
				    this.target = target || null;
				    this.currentTarget = null;
				},
				
				
				/**
				 * 获取event.target,解决不同浏览器兼容问题
				 * @param {Event}
				 * @return {Target}
				 */
				getTarget: function(event) {
				    return event.target || event.srcElement;
				},
				
				/**
				 * 阻止事件的默认行为
				 * @function
				 * @param {Event} event 事件对象
				 * @meta standard
				 */
				preventDefault: function(event) {
				    if (event.preventDefault) {
				        event.preventDefault();
				    } else {
				        event.returnValue = false;
				    }
				},
				
				/** 
				 * 停止事件冒泡传播
				 * @param {Event}
				 */
				stopBubble: function(event) {
				    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
				},
				
				/**
				 * 添加事件
				 */
				addEvent: function(type,handler,key){
				    if (typeof handler != 'function') {
			            return;
			    }
			    !this._listeners &&(this._listeners = {});
			    var t = this._listeners,id;
			    if (typeof key == "string" && key) {
			            if (/[^\w\-]/.test(key)) {
			                throw("nonstandard key:" + key);
			            } else {
			                handler.hashCode = key; 
			                id = key;
			            }
			        }
			        type.indexOf("on") != 0 && (type = "on" + type);
			        typeof t[type] != "object" && (t[type] = {});
			        id = id || guid();
			        handler.hashCode = id;
			        t[type][id] = handler;
				},
				
				/**
				 * 删除事件
				 */
				removeEvent: function(type,handler){
				    !this._listeners && (this._listeners = {});
				    type.indexOf("on") != 0 && (type = "on" + type);
				    var t = this._listeners;
				    if (!t[type]) {
				        return;
				    }
				    if (handler) {
				        if (typeof handler == 'function') {
				            handler = handler.hashCode;
				        }else if (typeof key != "string"){
				            return;
				        }
				        t[type][handler] && delete t[type][handler];
				    }else{
				        t[type] = {};
				    }
				},
				/**
				 * 派发事件
				 */
				dispatch: function(e,options){
				    if (typeof e == 'string') {
				        e = new scmapEvent.Event(e);
				    }
				    !this._listeners && (this._listeners = {});
				    options = options || {};
				    for (var i in options) {
				        e[i] = options[i];
				    }
				    var i, t = this._listeners, p = e.type;
				    e.target || (e.target = this);
				    e.currentTarget = this;
				    p.indexOf("on") != 0 && (p = "on" + p);
				    typeof this[p] == 'function' && this[p].apply(this, arguments);
				    if (typeof t[p] == "object") {
				        for (i in t[p]) {
				            t[p][i].call(this, e);
				        }
				    }
				    return e.returnValue;
				}
		};
		
		var drawTypeEnum = {
				MARKER: 'marker',
				POLYLINE: 'polyline',
				CIRCLE: 'circle',
				POLYGON: 'polygon',
				RECTANGLE:'rectangle'
		}
		
		Enum.drawType= drawTypeEnum;
		
		
		function DrawManager(map,opts){
			if(!map) {
				return;
			}
			drawInstances.push(this);
			
			opts = opts || {};
			
			this._init(map,opts);
		}
		
		DrawManager.prototype = {
				
				constructor: DrawManager,
			    /**
			     * 开启地图的绘制模式
			     */
				open: function() {
					if (this._isOpen == true){
			            return true;
			        }
			        closeInstanceExcept(this);
			        this._open();
				},
				
			    /**
			     * 关闭地图的绘制状态
			     */
				close: function() {
			        if (this._isOpen == false){
			            return true;
			        }
			        this._close();
/*			        setTimeout(function(){
			            me._map.enableDoubleClickZoom();
			        },2000);*/
				},
	
			    /**
			     * 设置当前的绘制模式，参数DrawingType
			     * @param {DrawingType} DrawingType
			     * @return {Boolean} 
			     */
				setDrawingMode: function(drawType) {
			        if (this._drawType != drawType) {
			            //closeInstanceExcept(this);
			            this._setDrawingMode(drawType);
			        }
				},
				
				/**
			     * 获取当前的绘制模式
			     * @return {DrawingType} 绘制的模式
			     */
				getDrawingMode: function() {
					return this._drawType;
				},
				
				/**
				 * 设置样式
				 */
				setStyleOptions: function(type, opts) {
					if (!this[type]) {
						return;
					}
					this[type] = opts;
				},
				
			    /**
			     * 初始化状态
			     * @param {Map} 地图实例
			     * @param {Object} 参数
			     */
				_init: function(map,opts) {
					this._map = map;
					this._opts = opts;
					this._drawType = opts.drawType || drawTypeEnum.MARKER;
					
					this._isOpen = !!(opts.isOpen === true);
					if(this._isOpen){
						this._open();
					}
			        this.markerOptions    = opts.markerOptions    || {};
			        this.circleOptions    = opts.circleOptions    || {};
			        this.polylineOptions  = opts.polylineOptions  || {};
			        this.polygonOptions   = opts.polygonOptions   || {};
					this.rectangleOptions   = opts.rectangleOptions   || {};
			        
			        //设置鼠标左右键控制
			        this.controlButton =  opts.controlButton == "right" ? "right" : "left";
	
				},
				_open: function() {
					this._isOpen = true;
					if(!this._mask){
						this._mask = new Mask();
					}
					this._map.addOverlay(this._mask);
					this._setDrawingMode(this._drawType);
					
				},
				_setDrawingMode: function(drawType) {
					this._drawType = drawType;
					if(this._isOpen){
						
						this._mask._listeners = {};
						
						switch (drawType) {
		                	case drawTypeEnum.MARKER:
		                		this._bindMarker();
		                		break;
			               	case drawTypeEnum.CIRCLE:
			                    this._bindCircle();
			                    break;
			               	case drawTypeEnum.RECTANGLE:
			                    this._bindRectangle();
			                    break;
			                case drawTypeEnum.POLYLINE:
			                case drawTypeEnum.POLYGON:
			                    this._bindPolylineOrPolygon();
			                    break;
						}
					}
				},
				_close: function() {
					this._isOpen = false;
					if (this._mask) {
						this._map.removeOverlay(this._mask);
					}
				},
				_bindMarker: function() {
					var me = this,
						map = this._map,
						mask = this._mask;
					var clickAction = function(e) {
						var marker = _entity.createMarker(e.point,me.markerOptions);
						map.addOverlay(marker);
						me._dispatchOverlayComplete(marker);
					};
					mask.addListener('click',clickAction);
				},
				_bindCircle: function() {
					var me = this,
						map = this._map,
						mask = this._mask,
						center = null,
						circle = null;
					
					var startAction = function(e){
						if(me.controlButton == "right" && (e.button == 1 || e.button==0)){
							return ;
						}
						
						center = e.point;
						circle = _entity.createCircle(center,0,me.circleOptions);
						map.addOverlay(circle);
						mask.enableEdgeMove();
						mask.addListener('mousemove',moveAction);
						$(document).one('mouseup',endAction);
					}
					
					var moveAction = function(e){
						circle.setRadius(map.getDistance(center, e.point));
					}
					
					var endAction = function(e){
						me._dispatchOverlayComplete(circle);
						center = null;
						mask.disableEdgeMove();
						mask.removeListener('mousemove',moveAction);
					}
					
					var mousedownAction = function(e){
						scmapEvent.preventDefault(e);
						scmapEvent.stopBubble(e);
						 if(me.controlButton == "right" && e.button == 1){
				                return ;
			            }
			            if (center == null) {
			                startAction(e);
			            } 
					}
					mask.addListener('mousedown', mousedownAction);
					
				},
				//矩形
				_bindRectangle: function() {
					var me = this,
						map = this._map,
						mask = this._mask,
						start = null,
						rectangle = null;
					
					var getRectanglePath = function (end){
						var _path = [start];
						_path.push(_entity.createPoint(start.lng,end.lat));
						_path.push(end);
						_path.push(_entity.createPoint(end.lng,start.lat));
						return _path;
					}
					var startAction = function(e){
						if(me.controlButton == "right" && (e.button == 1 || e.button==0)){
							return ;
						}
						
						start = e.point;
						rectangle = _entity.createPolygon([start],me.rectangleOptions);
						map.addOverlay(rectangle);
						mask.enableEdgeMove();
						mask.addListener('mousemove',moveAction);
						$(document).one('mouseup',endAction);
					}
					
					var moveAction = function(e){
						rectangle.setPath(getRectanglePath(e.point));
					}
					
					var endAction = function(e){
						me._dispatchOverlayComplete(rectangle);
						start = null;
						mask.disableEdgeMove();
						mask.removeListener('mousemove',moveAction);
					}
					
					var mousedownAction = function(e){
						scmapEvent.preventDefault(e);
						scmapEvent.stopBubble(e);
						 if(me.controlButton == "right" && e.button == 1){
				                return ;
			            }
			            if (start == null) {
			                startAction(e);
			            } 
					};
					mask.addListener('mousedown', mousedownAction);
					
				},
				_bindPolylineOrPolygon: function() {
					var me = this,
						map = this._map,
						mask = this._mask,
						points = [],
						overlay = null,
						drawPoint=null,
						isBinded = false;
					
					var startAction = function(e) {
						if(me.controlButton == "right" && (e.button == 1 || e.button==0)){
			                return ;
			            }
						points.push(e.point);
						drawPoint = points.concat(points[points.length-1]);
						
						if (1 == points.length) {
							if (me._drawType == drawTypeEnum.POLYLINE) {
								overlay = _entity.createPolyline(drawPoint,me.polylineOptions);
							}else if (me._drawType == drawTypeEnum.POLYGON) {
								overlay = _entity.createPolygon(drawPoint,me.polygonOptions);
							}
							map.addOverlay(overlay);
						}else{
							overlay.setPath(drawPoint);
						}
						
						if (!isBinded) {
							isBinded = true;
							mask.enableEdgeMove();
							mask.addListener('mousemove', moveAction);
							mask.addListener('dblclick', dblclickAction);
						}
						
					};
					
					var moveAction = function(e) {
						overlay.setPositionAt(drawPoint.length-1 , e.point);
					};
					var dblclickAction = function(e) {
						scmapEvent.stopBubble(e);
						isBinded = false;
						mask.disableEdgeMove();
						mask.removeListener('mousedown', startAction);
						mask.removeListener('mousemove', moveAction);
						mask.removeListener ('dblclick', dblclickAction);
						
						if(me.controlButton == "right"){
							points.push(e.point);
						}else{
							points.pop();
						}
						overlay.setPath(points);
						me._dispatchOverlayComplete(overlay);
						points.length = 0;
						drawPoint.length = 0;
						me.close();
					};
					mask.addListener('mousedown', startAction);
					
				},
				_dispatchOverlayComplete: function(overlay) {
					var options = {
			            'overlay'     : overlay,
			            'drawingMode' : this._drawType
			        };
			        this.dispatch(this._drawType + 'complete', {'overlay': overlay});
			        this.dispatch('overlaycomplete', options);
				},
				addListener: scmapEvent.addEvent,
				removeListener: scmapEvent.removeEvent,
				dispatch: scmapEvent.dispatch
				
		};
		//用来存储用户实例化出来的对象
		var drawInstances = [];
		
		/*
		 * 关闭其他实例
		 * @param {DrawingManager} 当前的实例
		 */
		function closeInstanceExcept(instance) {
		    var index = drawInstances.length;
		    while (index--) {
		        if (drawInstances[index] != instance) {
		        	drawInstances[index].close();
		        }
		    }
		}
		
		/**
		 * 信息展示窗口组件
		 * @class
		 */
		function InfoBox($dom,opts){
			
			opts = opts || {};
			//监测js是否引入
			this._init($dom,opts);
		}
		/**
		 * 添加一个clickbtn事件，{currentTarget:btn,id:btnId,target:this}
		 * 当参数改变的时候要同时将界面对应的部分修改掉
		 * 建立一个Style 去保存元素的各种宽高，最好支持自适应。
		 * 建立一个与参数对应的class表。【改进的话 直接保存该元素】
		 */
		InfoBox.prototype = {
				constructor: InfoBox,
				
				/**
				 * 存储资源
				 */
				data: function(data) {
					if(data) {
						this.__data = data;
					} else {
						return this.__data;
					}
				},
				
				/**
				 * 显示infobox
				 */
				open: function() {
					$(this._container).show();
					this.isOpen = true;
					this.dispatch('afteropen');
				},
				
				/**
				 * 关闭infobox
				 */
				close: function() {
					this.dispatch('beforeclose');
					$(this._container).hide();
					this.isOpen = false;
				},
				
				getBtn: function(id) {
					return this._container.find('#'+id);
				},
				
				removeBtn: function(id) {
					var $dom = this.getBtn(id);
					var parent = $dom.parent();
					if (!$dom.length) {
						return;
					}
					$dom.remove();
					return parent;
				},
				
				createBtn: function(key,opt) {
					var $div;
					
					if (key.indexOf('list') > -1) {
						$div = this._container.find('.checkbox-all');
					} else {
						$div = this._getDom(key);
					}
					
					this._createBtn($div,opt,true);
				},
				
				replaceBtn: function(id,opt) {
					this._createBtn(this.removeBtn(id),opt,true);
				},
				
				/**
				 * 修改参数，页面也会随着修改
				 * @param id 对应的信息id
				 * @param opts  参数
				 * @param isReset  设为true的时候 重置整个dom,否则只针对 参数内容对dom修改。
				 */
				setOptions: function(opts,isReset) {
					var me = this;
					isReset && (opts = me._mergeOpts(opts));
					$.each(opts,function(key,val){
						if (key == "topic") {
							me._setTopic(val);
							return true;
						}
						
						if (!val){
							me._removeDom(key);
							return true;
						}
						if (key.indexOf('btns') > -1 ){
							me._createBtns(me._getDom(key),val);
							return true;
						}
						if (key.indexOf('list') > -1 ) {
							me._createList(me._getDom(key),val);
							return true;
						}
						me._getDom(key).html(val);
					});
					
				},
				
				
				
				//获取选择的人员号码 
				getSelItems: function() {
					return this._selItems;
				},
				//清除所有的选择项目
				clearSelItems: function() {
					this._selItems.clear();
				},
				
                alterListParams: function(id,key,val) { 
                	if (!id || !key || !val) {
                		return;
                	}
                	this._alterListParams(id, key, val);
                },
                
                enableCheck: function(id,able) {
                	if (!id) {
                		return;
                	}
                	this._enableCheck(id, able);
                },

				
				_importMyCheckbox: function() {
					if (window.myCheckbox) {
						return;
					} else {
						var $script = $('<script>').attr({
							src : contextPath +'/js/lib/myCheckbox/js/myCheckbox.js',
						});
						
						var $css = $('<link>').attr({
							href : contextPath +'/js/lib/myCheckbox/css/myCheckbox.css',
							rel : "stylesheet"
						});
						$('head').append($script).append($css);
						$("head").append('' +
								'<!--[if (gte IE 6)&(lte IE 8)]>' +
							       '<link rel="stylesheet" type="text/css" href="' + contextPath + '/js/lib/myCheckbox/css/myCheckbox-IE8.css"/>' +
							       '<script type="text/javascript" src="' + contextPath + '/js/lib/myCheckbox/js/selectivizr.js"></script>' +        
							    '<![endif]-->');
					}
				},
				_init: function($dom,opts) {
					
					this._container = $dom;
					
					this._topic = '';
					
					this._domMapping = {};
					
					//建立完整的dom查询树
					this._domTypeMap = this._createQueryMap();
					
					this._listItem = {};
					
					this._selItems = new CheckItems(this);
					
					$dom.hide();
					//渲染dom
					$.isEmptyObject(opts) || this._render(opts);
					this._btnClickAction();
				},
				
				_render: function(opts) {
					var me = this;
					$.each(opts,function(name,val){
						//第一层的渲染，也就是对head body foot 进行渲染
						if (name == "topic") {
							me._setTopic(val);
						}
						me._doRender(name,val);
					});
				},
				
				_setTopic: function(val) {
					this._container.removeClass(this._topic);
					this._container.addClass(val);
					this._topic = val;
					return true;
				},
				
				_doRender: function(suffx,opts) {
					var me = this,
						traversalArray = [{suffx:suffx,obj:opts}];//渲染数组。suffx 前缀，可以详细看下dom查询树，
					while (traversalArray.length>0) {
						
						var o = traversalArray.splice(0,1)[0];
						$.each(o.obj,function(name,val) {
							
							var suffx = o.suffx + '_' + name;
							//参数类型是对象 ,同时 不是list的默认参数。就把该参数加入到渲染数组中，等待渲染
							if(typeof val === 'object' ) {
								if (name == 'list') {
									me._createList(me._getDom(suffx), val);
									return true;
								}
								if (name == 'btns') {
									me._createBtns(me._getDom(suffx),val);
									return true;
								}
								me._getDom(suffx);
								traversalArray.push({suffx:suffx,obj:val});
								return true;
							}
							//获取该参数对应的dom并处理之
							me._getDom(suffx).html(val);
						});
					}
				},
				
				_createBtns: function($dom,obj) {
					if ($dom == null) {
						return;
					}
					if ($.isEmptyObject(obj)) {
						return;
					}
					
					$dom.removeClass($dom.data('styleClass'));
					var styleClass = obj.styleClass || '';
					$dom.addClass(styleClass);
					$dom.data('styleClass', styleClass);
					var html = '';
					$.each(obj.data,function(i,obj){
						html += '<a id = "'+obj.id+'" ' +
									(obj.disabled ? 'class="disabled" title=' + obj.tip : '') +
									'>'+
									(obj.icon ? '<span></span>' : '')+
									(obj.param2 ?
										'<span class =  "info">' +
						                    '<span class = "param1">'+obj.param1+'</span>'+
						                    '<span class = "param2">'+obj.param2+'</span>'+
										'</span>':
										obj.param1)+
								'</a>';
					});
					$dom.html(html);
				},
				
				_createBtn: function($dom,obj) {
					if ($dom == null) {
						return;
					}
					var html = '<a id = "'+obj.id+'">'+
								(obj.icon ? '<span></span>' : '')+
								(obj.param2 ?
									'<span class =  "info">' +
					                    '<span class = "param1">'+obj.param1+'</span>'+
					                    '<span class = "param2">'+obj.param2+'</span>'+
									'</span>':
									obj.param1)+
								'</a>';
					
					$dom.append(html);
				},
				
				/**
				 * opt = {
				 * 	type: 当前类型，
				 * 	hasCheckbox: 是否要选择框
				 * 	btns: 按钮
				 * 	data: list数据 ---如果有disableChecked == true  改list不可选
				 * 	params: 需要显示的数据
				 * 	values: 需要存储的数据
				 * 	id: 检索items用到的字段
				 * }
				 */
				_createList: function($dom,opt) {
					
					var defaultOpts = {
							type: '',
							hasCheckbox: false,
							btns: [],
							data: [],
							params: [],
							values: [],
							id: undefined
					};
					
					opt = $.extend(defaultOpts,opt||{});
					
					var _this = this;
					_this._selItems.clear();
					
					$dom.html('');
                    var $ul = $('<ul>');
                    
                    $.each(opt.data,function(i,obj) {
						$ul.append(_this._createLi(obj,opt));
					});
					$dom.append($ul);

					if (opt.hasCheckbox) {						
                        var $check = $('<input>').addClass('my-check check-all').attr({
                            placeholder: '全选',
                            type: 'checkbox'
                        });
                        var $div = $('<div>').addClass('checkbox-all');
                        this._createBtns($div, opt.btns);

                        $dom.prepend($div.prepend($check));

					    //调用改变checkbox的样式
                        window.myCheckbox || this._importMyCheckbox();
					    window.myCheckbox.changeCheckBox();
					}

					this._addListEvent($dom,opt);

				},
				
				_createLi: function(obj,opt) {
					var $li = $('<li>').addClass('infobox_list_item');
					$li.data('id',obj.id);
					
					var idKey = obj[opt.id] || obj.id;
					
					this._listItem[idKey] = $li;
					//设置是否有checkbox
					var $first;
					if (opt.hasCheckbox) {
						$first = $('<input>').addClass('my-check check-self').attr({
							placeholder: obj[opt.params[0]],
							type: 'checkbox'
						});
						obj.disableChecked && ($li.addClass('not-allow'),$first.attr('disabled', 'disabled'));
					} else {
						$first = $('<span>').addClass(opt.params[i]).text(obj[opt.params[0]]);
					}

					
					$li.append($first);
					//循环属性，创建标签
					$.each(opt.params,function(i,prop) {
						if (i == 0 || !obj[prop]) {
							return true;
						}
						$li.append($('<span>').addClass(opt.params[i]).text(obj[prop]));
					});
                   
					//仓库地址，获取方式 --$('.var_wh').data(prop);
					var $varWh = $('<span>').addClass('var_wh').css({
						'display': 'none'
					});

					$.each(opt.values,function(i,prop) {
						$varWh.data(prop, obj[prop]);
					});

					// console.log($varWh.data());
					
					return $li.append($varWh);
				},
				/**
				 * 列表点击事件
				 */
				_addListEvent: function($dom,opt) {
					var that = this;
					that._selItems.create($dom.find('.check-all'), $('.infobox_list_item:not(.not-allow)').length,opt.type);

					$dom.find('.infobox_list_item').on('click',function() {
						var $self = $(this);
						var data = {type: opt.type};
						
						if($self.hasClass('not-allow')) {
							return;
						}
						
						$.each(opt.values,function(i,prop) {
							data[prop] = $self.find('.var_wh').data(prop);
						});
						var $check = $self.find('.check-self');
						if ($check.length) {
							var isChecked = !$check.is(':checked');
							data.checked = isChecked;
							//获取当前被点击的记录的序号
							var index = $('.infobox_list_item').index($self);
                       
							if (isChecked) {
								that._selItems.add(index,$self);
							} else {
								that._selItems.remove(index);
							}
						}
						//派发事件,外部通过 infobox.addListener('clicklist',function(e){}) 调用 
						that.dispatch('clicklist',{data: data});
						return false;
					});

					//全选/不选
					$dom.find('.check-all').on('click',function() {

						if ($(this).is(':checked')) {
							that._selItems.addAll($('.infobox_list_item:not(.not-allow)'));
							
						} else {
							that._selItems.clear();
						}
					});
				},
				
                
                _alterListParams: function(id,key,val) { 
                	if (this._listItem[id]) {
                		var $span = this._listItem[id].find('.'+key);
                		$span.length ? $span.text(val) : $('<span>').addClass(key).text(val).appendTo(this._listItem[id]);
                	}
                },
                
                _enableCheck: function(id,able) {
                	if (!this._listItem[id]) {
                		return;
                	}
                	var $li = this._listItem[id];
                	var extr = 1;
                	if (able) {
                		if(!$li.hasClass('not-allow')) return;
                		$li.removeClass('not-allow');
                		$li.find('.check-self').removeAttr('disabled');
                	} else {
                		if($li.hasClass('not-allow')) return;
						$li.trigger('click');
						//$li.find(':checkbox').attr('checked', false);
                		$li.addClass('not-allow');
                		$li.find('.check-self').attr('disabled', 'disabled');
                		extr = -1;
                	}
                	
                	this._selItems.setMaxLength(this._selItems.maxLength + extr);
                },
                
                
				/**
				 * 将节点串解析成数组，然后循环遍历该数组，保证该节点的父节点存在
				 * @param key
				 * @returns
				 */
				_getDom: function(key) {
					var me = this;
					var nodes = key.split('_');
					var nowNode;
					$.each(nodes,function(i,val){
						if (i == 0) {
							nowNode = val;
						}else {
							nowNode += '_'+val;
						}
						me._domMapping[nowNode] || (me._domMapping[nowNode] = me._createDom(nowNode));
					});		
					return  $(this._domMapping[key]);
				},
				
				//先去dom树寻找该key值是否可用 ,不可用则抛出异常
				//然后创建该dom元素 添加到其元素之下
				_createDom: function(key) {
					var domType = this._domTypeMap[key];
					if (!domType) {
						throw new Error('the node '+ key +' is not allowed to generate');
					}
					
					var dom = document.createElement(domType),
						calssNameA = 'infobox_' + key ,
						calssNameB = guid();
					$(dom).addClass( calssNameA+' '+calssNameB);
					
					//TODO 确保插入顺序
					var index = key.lastIndexOf('_');
					index == -1 ? 
						$(this._container).append(dom) : 
						$(this._domMapping[key.substring(0,index)]).append(dom);
					return '.'+calssNameB;
				},
				//删除该节点和其子节点
				_removeDom: function(key) {
					if (!this._domMapping[key]) {
						return false;
					}

					var str = '/^'+key+'(_\w*|$)'+'/',
						regex = eval(str);
					$(this._domMapping[key]).remove();
					var me = this;
					$.each(this._domMapping,function(name,val){
						regex.test(name) && delete me._domMapping[name];
					});
					
				},
				_createQueryMap: function() {
					return {
						topic:					'',
						head: 					'div',
						head_title: 			'div',
						head_title_main: 		'p',
						head_title_sub: 		'p',
						head_title_btns: 		'div',
						head_intro: 			'div',
						head_btns: 				'div',


						body: 					'div',
						body_title: 			'div',
						body_details: 			'div',
						body_details_html: 		'div',
						body_details_btns: 		'div',
						body_btns: 				'div',


						foot: 					'div',
						foot_title: 			'div',
						foot_title_main: 		'span',
						foot_title_sub: 		'span',
						foot_btns: 				'div',
						foot_list:				'div',
						
						tip:					'div',
						tip_container:			'div',
						tip_list:				'div'

					};
				},
				_mergeOpts: function(opts) {
					var temp = {},
						me = this;
					$.each(me._domTypeMap,function(key,val){
						temp[key] = opts[key] ? opts[key] : false;
					});
					return temp;
				},
				//派发按钮点击事件
				_btnClickAction: function() {
					var me = this;
					$(this._container).on('click','a',function(e){
						var evt = new scmapEvent.Event('clickbtn', e.currentTarget);
						me.dispatch(evt, {btnId:$(this).attr('id')});
						
					});
				},
				addListener: scmapEvent.addEvent,
				removeListener: scmapEvent.removeEvent,
				dispatch: scmapEvent.dispatch
		};
		
		
		/**
		 * 选择数组，
		 * @class
		 */
		function CheckItems(infoBox) {
			this._infoBox = infoBox;
            this.length = 0;
            this.obj = {};

            this.add = function(index,val) {
            	this.obj[index] || this.length++;
            	this.obj[index] = val;
            	//增加选择
            	val.find('.check-self').prop('checked', true),
                this.change();
            	this._infoBox.dispatch('itemchecked',{id: val.data('id'),dataType: this._type});
            };

            this.remove = function(index) {
                if (this.obj[index]) {
                    
                    //取消选择
                    this.obj[index].find('.check-self').prop('checked', false);
                    this._infoBox.dispatch('itemdischecked',{id: this.obj[index].data('id'),dataType: this._type});
                    delete this.obj[index];
                    this.length--;
                    this.change();
                    

                }
            };

            this.clear = function() {
                var me = this;
                $.each(this.obj, function(index) {
                	me.remove(index);
                });

            };
            
            this.create = function($checkAll,maxLength,type) {
                this.$checkAll = $checkAll;
                this.maxLength = maxLength;
                this.clear();
                this._type = type;
                
            };
            
            this.setMaxLength = function(len) {
            	this.maxLength = len;
            	this.change();
            };

            this.addAll = function($dom) {
                var self = this;
                $.each($dom,function(i,dom) {
                    self.add(i,$(dom));
                });
            };

            this.change = function() {
            	if (this.maxLength == 0) {
            		this.$checkAll.prop("checked",false);
            	} else {
            		this.$checkAll.prop("checked", this.length == this.maxLength);
            	}
                
            };

            this.toJson = function() {
                return this.obj;
            };
        }
		
		/**
		 * 文字图标，覆写 getStyleByText 方法。自定义不同文字下的图标风格
		 * @param position
		 * @param text
		 * @param styles
		 */
		function TextIcon(position,text,styles) {
			
			this._position = position;
		    this._text = text;
		    this._styles = styles || [];
		    this.overlay = this; 
		}

		function textIconAdd(map) {
			this._map = map;
			this._$dom = $('<div>');
			this._updateCss();
			this._updateText();
			this._updatePosition();
			this._bind();
			
			$(map.getPanes().floatPane).append(this._$dom);
			return this._$dom[0];
		}

		function textIcondraw() {
			this._map && this._updatePosition();
		}

		_entity.extendOverlay(TextIcon,textIconAdd,textIcondraw);

		TextIcon.prototype.getText = function() {
			return this._text;
		};

		TextIcon.prototype.setText = function(text) {
		    if(text && (!this._text || (this._text.toString() != text.toString()))){
		        this._text = text;
		        this._updateText();
		/*        this._updateCss();
		        this._updatePosition(); */
		    }
		};
		
		TextIcon.prototype.getStyles = function(styles) {
			return this._styles;
		};
		
		TextIcon.prototype.setStyle = function(styles) {
			this._styles = styles;
			this._updateCss();
			this._updatePosition();
		};

		TextIcon.prototype.getPosition = function () {
		    return this._position;
		};

		TextIcon.prototype.setPosition = function (position) {
		    if(position && (!this._position || !this._position.equals(position))){
		        this._position = position;  
		        this._updatePosition();
		    }
		};


		TextIcon.prototype.getStyleByText = function(styles){
			return styles[0];
		};


		TextIcon.prototype._updatePosition = function(){
		    if (this._$dom && this._position) {
		        var pixelPosition= this._map.pointToOverlayPixel(this._position); 
		        pixelPosition.x -= Math.ceil(parseInt(this._$dom.width()) / 2);
		        pixelPosition.y -= Math.ceil(parseInt(this._$dom.height()));    
		        this._$dom.css({
		        	left: pixelPosition.x + "px",
		        	top: pixelPosition.y + "px"
		        });
		    }
		};

		TextIcon.prototype._updateCss = function(){
		    var style = this.getStyleByText(this._styles);
		    this._$dom && this._$dom.css(this._buildCssText(style));
		};

		TextIcon.prototype._updateText = function(){
		    if (this._$dom) {
		    	this._$dom.text(this._text);
		    }
		};

		TextIcon.prototype._buildCssText = function(style) {    
		    var url = style['url'];
		    var size = style['size'] || _entity.createSize(10,10);
		    var anchor = style['anchor'];
		    var offset = style['offset'];
		    var textColor = style['textColor'] || 'black';
		    var textSize = style['textSize'] || (style['textSize']==0 ? 0 : 10);
		    var lineHight = style['lineHight'] || size.height;
		    var border = style['border'];
		    
		    var css = {
		    		'cursor': 'pointer',
		    		'color': textColor,
		    		'position': 'absolute',
		    		'font-size': textSize +'px',
		    		'font-family': 'Microsoft Yahei',
		    		'font-weight': 500
		    };
		    
		    if (url) {
		    	var position = '0 0';
		    	offset && (position = offset.width + 'px' + ' ' + offset.height + 'px');
		    	css['background'] = 'url(' + url + ') ' + position;
		    }

		    if (size) {
		    	if (anchor) {
		    		anchor.height > 0 && anchor.height < size.height && (css['height'] = size.height - anchor.height +'px',
		    															 css['padding-top'] = anchor.height +'px');
		    		anchor.width > 0 && anchor.width < size.width && (css['height'] = size.width - anchor.width +'px',
							 										  css['padding-top'] = anchor.width +'px');
		    	} else {
		    		css['height'] = size.height + 'px';
		    		css['width'] = size.width + 'px';
		    	}
		    } else {
		    	css['min-height'] = '10px';
		    	css['min-width'] = '10px';
		    }
			css['line-height'] = lineHight+'px';
			css['text-align'] = 'center';
			
			if (border) {
				css['border'] = border;
		    }

		    return css;
		};

		TextIcon.prototype._bind = function(){
		    if (!this._$dom){
		        return;
		    }
		    
		    var me = this;
		    
		    this._$dom.on('click',function(e) {
		    	me.dispatch('click',{positon:me._position,text:me._text});
		    });
		    this._$dom.on('mouseover',function(e) {
		    	me.dispatch('mouseover',{positon:me._position,text:me._text});
		    });
		    this._$dom.on('mouseout',function(e) {
		    	me.dispatch('mouseout',{positon:me._position,text:me._text});
		    });
		};
		
		TextIcon.prototype.addListener = scmapEvent.addEvent;
		TextIcon.prototype.removeListener = scmapEvent.removeEvent;
		TextIcon.prototype.dispatch = scmapEvent.dispatch;

		
		
		function MarkerClusterer(map,options) {
			if (!map) {
		        return;
			}
		    this._map = map;
		    
		    this._markers = [];
		    this._clusters = [];
		    
		    this._gridSize = options['gridSize'] || 40;
		    this._maxZoom = options["maxZoom"] || 18;
		    this._minClusterSize = options["minClusterSize"] < 2 ? 2 : options["minClusterSize"];
		    this._isAverageCenter = !!options["isAverageCenter"];
		    this._styles = options['styles'] || [];
		    this._filterCluster = options['filterCluster'];
		    
			var me = this;
			
			this._map.addListener("boundschanged",function(){
				if(me._map.getSize().width == 0 || me._map.getSize().height == 0) return;
		        me._redraw();     
		    });
			$.isArray(options.markers) && this.addMarkers(options.markers);
		}


		MarkerClusterer.prototype = {
				constructor: MarkerClusterer,
				
				addMarkers: function(markers) {
					var me = this;
					$.each(markers,function(i,marker) {
						me._pushMarkerTo(marker);
					});
					
					me._createClusters();
				},
				addMarker: function(marker) {
					this._pushMarkerTo(marker);
					this._createClusters();
				},
				
				removeMarker: function(marker) {
					this._removeMarker(marker) && this._redraw();
				},
				
				removeMarkers: function(markers) {
					var me = this;
					$.each(markers,function(i,marker) {
						me._removeMarker(marker);
					});
					
					this._redraw();
				},
				
				clearMarkers: function() {
					this._clearLastClusters();
			        this._removeMarkersFromMap();
			        this._markers = [];
				},
				
				getGridSize: function() {
					return this._gridSize;
				},
				
				setGridSize: function(size) {
					this._gridSize = size;
			        this._redraw();
				},
				
				getMaxZoom: function() {
					return this._maxZoom;
				},
				
				setMaxZoom: function(maxZoom) {
					this._maxZoom = maxZoom;
			        this._redraw();
				},
				
				getStyles: function() {
					return this._styles;
				},
				
				setStyle: function(styles) {
					this._styles = styles;
			        this._redraw();
				},
				
				getMinClusterSize: function() {
					return this._minClusterSize;
				},
				
				setMinClusterSize: function(num) {
					this._minClusterSize = size;
			        this._redraw();
				},
				
				getMap: function() {
					return this._map;
				},
				
				getMarkers: function() {
					return this._markers;
				},
				
				getClustersCount: function() {
					var count = 0;
					$.each(this._clusters,function(i,cluster) {
						cluster._isReal && count++;
					});
					return count;
				},

				isAverageCenter: function() {
					return this._isAverageCenter;
				},
				
				redraw : function() {
					this._redraw();
				},
				
				_redraw: function() {
			        this._clearLastClusters();
			        this._createClusters();
				},
				
				_pushMarkerTo: function(marker) {
					this._markers.indexOf(marker) == -1
						&& (
							marker.isInCluster = false,
							this._markers.push(marker)
						);
				},
				
				_createClusters: function() {
					var mapBounds = this._map.getBounds();
					var effectBounds = getExtendedBounds(this._map,mapBounds,this._gridSize);
					var me = this;
					$.each(this._markers,function(i,marker) {
						!marker.isInCluster && effectBounds.containsPoint(marker.getPosition()) && me._addToClosestCluster(marker);
					});
				},
				
				_addToClosestCluster: function(marker) {
					var me = this,
						distance = 4000000,
						clusterToAdd = null,
						position = marker.getPosition();
					
					$.each(me._clusters,function(i,cluster) {
						var center = cluster.getCenter(),
							d = me._map.getDistance(center,position);
						if (d < distance) {
							distance = d;
							clusterToAdd = cluster;
						}
					});
					
					if (clusterToAdd && clusterToAdd.isInBounds(marker)) {
						if($.isFunction(me._filterCluster)) {
							me._filterCluster(clusterToAdd,marker) && clusterToAdd.addMarker(marker);
						} else {
							clusterToAdd.addMarker(marker);
						}
					} else {
						var cluster = new Cluster(me);
						if($.isFunction(me._filterCluster)) {
							cluster.addMarker(marker);
							this._clusters.push(cluster);
							me._filterCluster(cluster,marker);
						} else {
							cluster.addMarker(marker);
							this._clusters.push(cluster);
						}
					}
				},
				
				_clearLastClusters: function() {
					$.each(this._clusters,function(i,cluster) {
						cluster.remove();
					});
					this._clusters = [];
					this._removeMarkersFromCluster();
				},
				
				_removeMarkersFromCluster: function() {
					$.each(this._markers,function(i,marker) {
						marker.isInCluster = false;
					});
				},
				
				_removeMarkersFromMap: function() {
					var me = this;
					$.each(me._markers,function(i,marker) {
						me._map.removeOverlay(marker);
					});
				},
				
				_removeMarker: function(marker) {
					var index = this._markers.indexOf(marker);
					if (index == -1) {
						return false;
					}
					this._map.removeOverlay(marker);
					this._markers.splice(index,1);
					return true;
				},
				
				addListener: scmapEvent.addEvent,
				removeListener: scmapEvent.removeEvent,
				dispatch: scmapEvent.dispatch
				
		};
		
		
	
		/************************辅助类*************************/
		
		/**
		 * 聚合点图标设置
		 */
		function Cluster(markerClusterer) {
			var me = this;
		    this._markerClusterer = markerClusterer;
		    this._map = markerClusterer.getMap();
		    this._minClusterSize = markerClusterer.getMinClusterSize();
		    this._isAverageCenter = markerClusterer.isAverageCenter();
		    this._center = null;
		    this._markers = [];
		    this._gridBounds = null;
			this._isReal = false; 
			
		    this._clusterMarker = new TextIcon(this._center, this._markers.length, this._markerClusterer.getStyles());
		    
		    this._clusterMarker.addListener('click',function(e) {
		    	markerClusterer.dispatch(e,{markers: me._markers});
			});
		}

		Cluster.prototype = {
				
				constructor: Cluster,
				
				addMarker: function(marker) {
					
					var me = this,
						len = this._markers.length;
					
					if (!me._center) {
						me._center = marker.getPosition();
						me.updateGrid();
					} else if (me._isAverageCenter) {

						var lat = (me._center.lat * len +  marker.getPosition().lat)/(len+1),
						 	lng = (me._center.lng * len +  marker.getPosition().lng)/(len+1);
						me._center = _entity.createPoint(lng,lat);
						me.updateGrid();
					}
					
					marker.isInCluster = true;
					me._markers.push(marker);
					len = len+1;
					
					if (len < me._minClusterSize) {
						me._map.addOverlay(marker);
						return true;
					} else if (len == me._minClusterSize) {
						$.each(me._markers,function(i,marker) {
							me._map.removeOverlay(marker);
						});
					}
					
					this._map.addOverlay(this._clusterMarker);
					me._isReal = true;
					me.updateClusterMarker();
				},
				
				isInBounds: function(markre) {
					return this._gridBounds.containsPoint(markre.getPosition());
				},
				
				updateGrid: function() {
					var bounds = _entity.createBounds(this._center,this._center);
					this._gridBounds = getExtendedBounds(this._map, bounds, this._markerClusterer.getGridSize());
				},
				
				updateClusterMarker: function() {
					if (this._map.getZoom() > this._markerClusterer.getMaxZoom()) {
						this._clusterMarker && this._map.removeOverlay(this._clusterMarker);
						this._map.addOverlays(this._markers);
						return;
					}
					
					this._clusterMarker.setPosition(this._center);
					this._clusterMarker.setText(this._markers.length);
				},
				
				remove: function() {
					var me = this;
					$.each(this._markers,function(i,marker) {
						me._map.removeOverlay(marker);
					});
					
					me._map.removeOverlay(me._clusterMarker);
					me._markers = [];
				},
				
				getCenter: function() {
					return this._center;
				},
				
				getClusterMarker: function() {
					return this._clusterMarker;
				},
				
				getMarkerClusterer: function() {
					return this._markerClusterer;
				}
		};
	
		/**
		 * 遮罩类，绘画动作都在遮罩上完成;
		 *TODO 谷歌移动误差
		 */
		function Mask(){
			this._enableEdgeMove = false;
			this.overlay = this;
		}
		
		function maskAdd(map){
		    var me = this;
		    this._map = map;
		    var div = this.container = document.createElement("div");
		    var size = this._map.getSize();
		    div.style.cssText = "position:absolute;background:url(about:blank);cursor:crosshair;width:" + size.width + "px;height:" + size.height + "px";
		    this._map.addListener('resize', function(e) {
		        me._adjustSize(e.size);
		    });
		    this._map.getPanes().floatPane.appendChild(div);
		    this._bind();
		    return div; 
		}

		function maskDraw(){
		    var map = this._map,
	        point = map.pixelToPoint(_entity.createPixel(0, 0)),
	        //让是否开启地图平移功能变的可控制
	        pixel = map.pointToOverlayPixel(point);
		    this.container.style.left = pixel.x + "px";
		    this.container.style.top  = pixel.y + "px";
		}
		
		_entity.extendOverlay(Mask,maskAdd,maskDraw);
		
		/**
		 * 添加自定义事件
		 */
		Mask.prototype.addListener = scmapEvent.addEvent;
		Mask.prototype.removeListener = scmapEvent.removeEvent;
		Mask.prototype.dispatch = scmapEvent.dispatch;
	
		/**
		 * 开启鼠标到地图边缘，自动平移地图
		 */
		Mask.prototype.enableEdgeMove = function() {
		    this._enableEdgeMove = true;
		};
	
		/**
		 * 关闭鼠标到地图边缘，自动平移地图
		 */
		Mask.prototype.disableEdgeMove = function() {
		    clearInterval(this._edgeMoveTimer);
		    this._enableEdgeMove = false;
		};
	
		/**
		 * 绑定事件,派发自定义事件
		 */
		Mask.prototype._bind = function() {
	
		    var me = this,
		        map = this._map,
		        container = this.container,
		        lastMousedownXY = null,
		        lastClickXY = null;
	
		    /**
		     * 根据event对象获取鼠标的xy坐标对象
		     * @param {Event}
		     * @return {Object} {x:e.x, y:e.y}
		     */
		    var getXYbyEvent = function(e){
		        return {
		            x : e.clientX,
		            y : e.clientY
		        };
		    };
	
		    var domEvent = function(e) {
		        var type = e.type,
		            point = me.getDrawPoint(e); //当前鼠标所在点的地理坐标
	
		        var dispatch = function() {
		            e.point = point;
		            me.dispatch(e);
		        };
	
		        if (type == "mousedown") {
		            lastMousedownXY = getXYbyEvent(e);
		        }
	
		        var nowXY = getXYbyEvent(e);
		        //click经过一些特殊处理派发，其他同事件按正常的dom事件派发
		        if (type == "click") {
		            //鼠标点击过程不进行移动才派发click和dblclick
		            if (Math.abs(nowXY.x - lastMousedownXY.x) < 5 && Math.abs(nowXY.y - lastMousedownXY.y) < 5 ) {
		                if (!lastClickXY || !(Math.abs(nowXY.x - lastClickXY.x) < 5 && Math.abs(nowXY.y - lastClickXY.y) < 5)) {
		                    dispatch();
		                    lastClickXY = getXYbyEvent(e);
		                } else {
		                    lastClickXY = null;
		                }
		            }
		        } else {
		            dispatch();
		        }
		    };
	
		    /**
		     * 将事件都遮罩层的事件都绑定到domEvent来处理
		     */
		    var events = ['click', 'mousedown', 'mousemove', 'mouseup', 'dblclick'],
		        index = events.length;
		    while (index--) {
		        $(container).on(events[index],domEvent);
		    }
	
		    //鼠标移动过程中，到地图边缘后自动平移地图
		    $(container).on('mousemove', function(e) {
		        if (me._enableEdgeMove) {
		            me.mousemoveAction(e);
		        }
		    });
		};
	
		//鼠标移动过程中，到地图边缘后自动平移地图
		Mask.prototype.mousemoveAction = function(e) {
			
		    var map       = this._map,
		        me        = this,
		        mapSize   = map.getSize(),
		        pixel     = map.pointToPixel(this.getDrawPoint(e));
		    this._draggingMovePixel = pixel;
		    // 拖拽到地图边缘移动地图
		    this._panByX = this._panByY = 0;
		    if (pixel.x <= 20 || pixel.x >= mapSize.width - 20
		        || pixel.y <= 50 || pixel.y >= mapSize.height - 10) {
		        if (pixel.x <= 20) {
		            this._panByX = -8;
		        } else if (pixel.x >= mapSize.width - 20) {
		            this._panByX = 8;
		        }
		        if (pixel.y <= 50) {
		            this._panByY = -8;
		        } else if (pixel.y >= mapSize.height - 10) {
		            this._panByY = 8;
		        }
		        if (!this._edgeMoveTimer) {
		            this._edgeMoveTimer = setInterval(function(){
		                map.panBy(me._panByX, me._panByY, true);
		            }, 30);
		        }
		    } else {
		        if (this._edgeMoveTimer) {
		            window.clearInterval(this._edgeMoveTimer);
		            this._edgeMoveTimer = null;
		        }
		    }
		};
	
		/**
	    * 调整大小
	    * @param {Size}
	    */
		Mask.prototype._adjustSize = function(size) {
		    this.container.style.width  = size.width + 'px';
		    this.container.style.height = size.height + 'px';
		};
	
		/**
		 * 获取当前绘制点的地理坐标
		 *
		 * @param {Event} e e对象
		 * @return Point对象的位置信息
		 */
		Mask.prototype.getDrawPoint = function(e) {
		    var map = this._map,
		    trigger = scmapEvent.getTarget(e),
		    x = e.offsetX || e.layerX || 0,
		    y = e.offsetY || e.layerY || 0;
		    
		    var pixel = _entity.createPixel(x,y);
		    
		    if(_entity._type == 'baidu'){
			    if (trigger.nodeType != 1) trigger = trigger.parentNode;
			    //得到该次事件在map上的正确x，y值
			    while (trigger && trigger != map.getContainer()) {
			        if (!(trigger.clientWidth == 0 &&
			            trigger.clientHeight == 0 &&
			            trigger.offsetParent && trigger.offsetParent.nodeName == 'TD')) {
			            x += trigger.offsetLeft || 0;
			            y += trigger.offsetTop || 0;
			        }
			        trigger = trigger.offsetParent;
			    }
			    pixel = _entity.createPixel(x, y);
		    }
		    var point = map.pixelToPoint(pixel);
		    return point;
	
		};
		
		/********************扩展边界***********************/
		
		function getExtendedBounds(map,bounds,gridSize) {
			bounds = cutBoundsInRange(bounds);
		    var pixelNE = map.pointToPixel(bounds.getNorthEast());
		    var pixelSW = map.pointToPixel(bounds.getSouthWest());
		    var neX = pixelNE.x + gridSize;
		    var neY = pixelNE.y - gridSize;
		    var swX = pixelSW.x - gridSize;
		    var swY = pixelSW.y + gridSize;
		    var newNE = map.pixelToPoint(entity.createPixel(neX,neY));
		    var newSW = map.pixelToPoint(entity.createPixel(swX,swY));
		    return _entity.createBounds(newSW, newNE);
		}

		function cutBoundsInRange(bounds) {
			var maxX = getRange(bounds.maxX, -74, 74);
		    var minX = getRange(bounds.minX, -74, 74);
		    var maxY = getRange(bounds.maxY, -180, 180);
		    var minY = getRange(bounds.minY, -180, 180);
		    return _entity.createBounds(_entity.createPoint(minY,minX), _entity.createPoint(maxY,maxX));
		}

		function getRange(i, mix, max) {
		    mix && (i = Math.max(i, mix));
		    max && (i = Math.min(i, max));
		    return i;
		}
		/*******************************************/
		

	    /** 
	     * @exports DistanceTool as DistanceTool 
	     */
	    var DistanceTool = function(map, opts){
	            if (!map) {
	                return;
	            }
	            
	            /**
	             * map对象
	             * @private
	             * @type {Map}
	             */
	            this._map = map;

	            opts = opts || {};
	            /**
	             * _opts是默认参数赋值。
	             * 下面通过用户输入的opts，对默认参数赋值
	             * @private
	             * @type {Json}
	             */
	            this._opts = $.extend(
	                $.extend(this._opts || {}, {
	                    tips : "测距",
	                    followText : "单击确定地点，双击结束",
	                    unit : "metric",//单位，可接受的属性为"metric"表示米制和"us"表示美国传统单位
	                    lineColor : "#ff6319",
	                    lineStroke : 2,
	                    opacity : 0.8,
	                    lineStyle : "solid",
	                    cursor : "../images/scmap/ruler.cur",
	                    secIcon : null,//转折点的ICON样式
	                    closeIcon : null
	                })
	            , opts);

	            this._followTitle = null;//跟随的title覆盖物
	            this._points = [];//折线包含所有点的数组
	            this._paths = [];//折线所包含的所有path数组
	            this._dots = [];//折线结点图片数组
	            this._segDistance = [];//折线测距包含所有线段的距离
	            this._overlays = [];//覆盖物的数组
	            this._enableMassClear = true,//是否在调用map.clearOverlays清除画线需要建立的相关overlay元素
	            
	            this._units = {//单位制，存储语言包中定义的单位名称
	                // metric 表示米制
	                metric : {
	                    name : "metric",//米
	                    conv : 1,//和米制的换算关系
	                    incon : 1000,//米制单位下两个单位制之间的换算关系
	                    u1 : "米",//米制单位下较小单位
	                    u2 : "公里"//米制单位下较大单位
	                },
	                // us 表示美国传统单位，各参数意义同上metric
	                us : {
	                    name : "us",
	                    conv : 3.2808,
	                    incon : 5279.856,
	                    u1 : "英尺",
	                    u2 : "英里"
	                }
	            };

	            this._isOpen = false;//是否已经开启了测距状态
	            this._startFollowText = "单击确定起点";//未点击任何一点时，鼠标移动时的跟随提示文字

	            /**
	             * 地图移动的计时器
	             * @private
	             * @type {Object}
	             */
	            this._movingTimerId = null;

	            /**
	             * 测距需要添加的CSS样式
	             * @private
	             * @type {Json}
	             */
	             this._styles = {
	                 "BMapLib_diso" : "height:17px;width:5px;position:absolute;background:url(http://api.map.baidu.com/images/dis_box_01.gif) no-repeat left top"
	                 ,"BMapLib_disi" : "color:#7a7a7a;position:absolute;left:5px;padding:0 4px 1px 0;line-height:17px;background:url(http://api.map.baidu.com/images/dis_box_01.gif) no-repeat right top" 
	                 ,"BMapLib_disBoxDis" : "color:#ff6319;font-weight:bold"
	             };

	            if (this._opts.lineStroke <= 0) {
	                this._opts.lineStroke = 2;
	            }
	            if (this._opts.opacity > 1) {
	                this._opts.opacity = 1;
	            } else if (this._opts.opacity < 0) {
	                this._opts.opacity = 0;
	            }
	            if (this._opts.lineStyle != "solid" &&
	                this._opts.lineStyle != "dashed") {
	                    this._opts.lineStyle = "solid";
	            }
	            if (!this._units[this._opts.unit]) {
	                this._opts.unit = "metric";
	            }
	            
	            this.text = "测距";
	            this.addListener = scmapEvent.addEvent;
	            this.removeListener = scmapEvent.removeEvent;
	            this.dispatch = scmapEvent.dispatch;
	        };

	    /**
	     * 地图区域的移动事件绑定
	     * @return 无返回值
	     */
	    DistanceTool.prototype._bind = function(){
	        // 设置鼠标样式
	        this._setCursor(this._opts.cursor);
	        var me = this;
	        // 在装载地图的页面元素上，绑定鼠标移动事件
	        $(this._map.getContainer()).on("mousemove", function(e){
	            if (!me._isOpen) {
	                return;
	            }
	            if (!me._followTitle) {
	                return;
	            }
	            e = window.event || e;
	            var t = e.target || e.srcElement;
	            // 如果触发该事件的页面元素不是遮盖效果层，则返回，无操作
	            if (t != OperationMask.getDom(me._map)) {
	                me._followTitle.hide();
	                return;
	            }
	            if (!me._mapMoving) {
	                me._followTitle.show();
	            }
	            // 设置鼠标移动过程中，跟随的文字提示框的位置
	            var pt = OperationMask.getDrawPoint(e, true);
	            me._followTitle.setPosition(pt);
	        });
	        // 创建鼠标跟随的文字提示框
	        if (this._startFollowText) {
	            var t = this._followTitle = _entity.createLabel(this._startFollowText, {offset : _entity.createSize(14, 16)});
	            this._followTitle.setStyle({color : "#333", borderColor : "#ff0103"});
	        }
	    };

	    /**
	     * 开启地图的测距状态
	     * @return {Boolean}，开启测距状态成功，返回true；否则返回false。
	     *
	     * @example <b>参考示例：</b><br />
	     * myDistanceToolObject.open();
	     */
	    DistanceTool.prototype.open = function(){
	        // 判断测距状态是否已经开启
	        if (this._isOpen == true){
	            return true;
	        }

	        this._isOpen = true;

	        // 判断是否是否在移动过程中
	        if (this._mapMoving){
	            delete this._mapMoving;
	        }

	        var me = this;
	        // 增加鼠标在地图区域移动的事件
	        // 通过binded参数，避免多次绑定
	        if (!this._binded) {
	            this._binded = true;
	            // 绑定控件项事件
	            this._bind();
	            // 地图的移动过程中，需要隐藏相关的提示框
	            this._map.addListener("moving", function(){
	                me._hideCurrent();
	            });
	        }

	        // 将文字提示框作为Label元素，提交给Map Api进行管理
	        if (this._followTitle) {
	            this._map.addOverlay(this._followTitle);
	            this._followTitle.hide();
	        }

	        /**
	         * 测距过程中，点击地图时，触发的操作
	         * @ignore
	         * @param {Object} e event对象
	         */
	        var distClick = function(e) {
	            var map = me._map;
	            if (!me._isOpen) {
	                    return;
	            }
	            // 通过event对象，计算得出点击位置的物理坐标，poi为一个Point对象
	            e = window.event || e;
	            var poi = OperationMask.getDrawPoint(e, true);
	            // 验证计算得出的该点的位置合理性
	            if (!me._isPointValid(poi)) {
	                return;
	            }
	            // 记录当前点的屏幕位置
	            me._bind.initX = e.pageX || e.clientX || 0;
	            me._bind.initY = e.pageY || e.clientY || 0;

	            // 这个if循环内的计算是，判断当前这个点，与存储内的最后一个点的距离，
	            // 如果距离过小，比如小于5，可以认为是用户的误点，可以忽略掉
	            if (me._points.length > 0){
	                var lstPx = map.pointToPixel(me._points[me._points.length - 1]);
	                var thisPx = map.pointToPixel(poi);
	                var dis = Math.sqrt(Math.pow(lstPx.x - thisPx.x, 2) + Math.pow(lstPx.y - thisPx.y, 2));
	                if (dis < 5) {
	                    return;
	                }
	            }

	            me._bind.x = e.layerX || e.offsetX || 0;
	            me._bind.y = e.layerY || e.offsetY || 0;
	            me._points.push(poi);
	            // 添加测距结点
	            me._addSecPoint(poi);

	            // 调整跟踪鼠标的标签
	            if (me._paths.length == 0) {
	                me._formatTitle(1, me._opts.followText, me._getTotalDistance());
	            }

	            // 修改确定线的颜色
	            if (me._paths.length > 0) {
//	                me._paths[me._paths.length - 1].show();
	                me._map.addOverlay(me._paths[me._paths.length - 1]);
	                me._paths[me._paths.length - 1].setStrokeOpacity(me._opts.opacity);
	            }

	            var path = _entity.createPolyline([poi, poi], {enableMassClear : me._enableMassClear});
	            me._map.addOverlay(path);
	            me._paths.push(path);
	            me._overlays.push(path);

	            // 测距模式下线样式固定
	            path.setStrokeWeight(me._opts.lineStroke);
	            path.setStrokeColor(me._opts.lineColor);
	            path.setStrokeOpacity(me._opts.opacity / 2);
	            path.setStrokeStyle(me._opts.lineStyle);           

	            // 如果地图正在移动则隐藏掉
	            if (me._mapMoving){
//	                path.hide();
	            	me._map.removeOverlay(path);
	            }

	            if (me._points.length > 1) {
	                var siblingPath = me._paths[me._points.length - 2];
	                siblingPath.setPositionAt(1, poi);
	            }

	            // 生成节点旁边的距离显示框
	            var disText = "";
	            if (me._points.length > 1) {
	                // 非起点的节点，显示当前的距离
	                var segDis = me._setSegDistance(me._points[me._points.length - 2], me._points[me._points.length - 1]);
	                var meters = me._getTotalDistance();
	                disText = me._formatDisStr(meters);
	            } else {
	                disText = "起点";
	            }                
	            var disLabel = _entity.createLabel(disText, {offset : _entity.createSize(10, -5), enableMassClear : me._enableMassClear});
	            disLabel.setStyle({color : "#333", borderColor : "#ff0103"});
	            me._map.addOverlay(disLabel);
	            me._formatSegLabel(disLabel, disText);
	            me._overlays.push(disLabel);
	            poi.disLabel = disLabel;
	            disLabel.setPosition(poi);

	            /**
	             * 测距过程中，每次点击底图添加节点时，派发事件的接口
	             * @name DistanceTool#onaddpoint
	             * @event
	             * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
	             * <br />{"<b>point</b> : {BMap.Point} 最新添加上的节点BMap.Point对象,
	             * <br />"<b>pixel</b>：{BMap.pixel} 最新添加上的节点BMap.Pixel对象,
	             * <br />"<b>index</b>：{Number} 最新添加的节点的索引,
	             * <br />"<b>distance</b>：{Number} 截止最新添加的节点的总距离}
	             *
	             * @example <b>参考示例：</b><br />
	             * myDistanceToolObject.addListener("addpoint", function(e) {  alert(e.distance);  });
	             */

	            // 生成名为onaddpoint的对象
	            // 并给该event对象添加上point、pixel、index和distance等属性字段
	            // 然后在此刻，将绑定在onaddpoint上事件，全部赋予event参数，然后派发出去
	            var event = new scmapEvent.Event("onaddpoint");
	            event.point = poi;
	            event.pixel = me._map.pointToPixel(poi);
	            event.index = me._points.length - 1;
	            event.distance = me._getTotalDistance().toFixed(0);
	            me.dispatch(event);
	        };

	        /**
	         * 测距过程中，鼠标在地图上移动时，触发的操作
	         * @ignore
	         * @param {Object} e event对象
	         */
	        var distMove = function(e) {
	            if (!me._isOpen){
	                return;
	            }
	            // 通过判断数组me._paths的长度，判断当前是否已经有测量节点
	            // 也就是，如果没有节点，则还没有开始测量
	            if (me._paths.length > 0) {
	                // 通过event参数，计算当前点的位置
	                e = window.event || e;
	                var curX = e.pageX || e.clientX || 0;
	                var curY = e.pageY || e.clientY || 0;
	                if (typeof me._bind.initX == "undefined") {
	                    me._bind.x = e.layerX || e.offsetX || 0;
	                    me._bind.y = e.layerY || e.offsetY || 0;
	                    me._bind.initX = curX;
	                    me._bind.initY = curY;
	                }
	                var x = me._bind.x + curX - me._bind.initX;
	                var y = me._bind.y + curY - me._bind.initY;

	                // 修改最后一条折线的终点位置，使之随着鼠标移动画线
	                var path = me._paths[me._paths.length - 1];
	                var poi = me._map.pixelToPoint(_entity.createPixel(x, y));
	                path.setPositionAt(1, poi);

//	                if (!me._mapMoving) {
//	                    path.show();
//	                }
	                var dx = 0;
	                var dy = 0;
	                // 计算当前鼠标位置，是否靠近边界、或者已经出了边界
	                // 如果在边界位置，则需要向对应的方向移动地图，来进行测量
	                // 每次移动的距离，设定为8
	                if (x < 10) {
	                    dx = 8;
	                } else if (x > me._map.getSize().width - 10){
	                    dx = -8;
	                }
	                if (y < 10) {
	                    dy = 8;
	                } else if (y > me._map.getSize().height - 10){
	                    dy = -8;
	                }
	                // 如果dx和dy都等于0，表明不需要移动地图
	                if (dx != 0 || dy != 0){
	                    // 此时需要向一个方向，平移地图
	                    if (!distMove._movingTimerId){
	                        me._mapMoving = true;
	                        me._map.panBy(dx, dy, {noAnimation : true});                        
	                        me._movingTimerId = distMove._movingTimerId = setInterval(function(){
	                            me._map.panBy(dx, dy, {noAnimation : true});
	                        }, 30);
	                        // 地图移动过程中，隐藏线段和标签
//	                        path.hide();
	                        me._map.removeOverlay(path)
	                        me._followTitle && me._followTitle.hide();
	                    }
	                } else {
	                    if (distMove._movingTimerId) {
	                        // 此时用户不在需要移动地图来测量，可以清除计时器
	                        clearInterval(distMove._movingTimerId);
	                        delete distMove._movingTimerId;
	                        delete me._movingTimerId;

	                        // 显示跟随提示框，并修改线路位置
	                        var lstP = me._paths[me._paths.length - 1];
	                        var poiN = me._map.pixelToPoint(_entity.createPixel(x, y));
	                        if (!lstP) {
	                            return;
	                        }
	                        lstP.setPositionAt(1, poiN);
	                        lstP.show();
	                        if (me._followTitle) {
	                            me._followTitle.setPosition(poiN);
	                            me._followTitle.show();
	                        }
	                        me._bind.i = 0;
	                        me._bind.j = 0;
	                        delete me._mapMoving;
	                    }
	                }
	                // 实时更新文字提示框中的距离
	                if (me._followTitle) {
	                    var td = me._getTotalDistance();
	                    var dis = me._map.getDistance(me._points[me._points.length - 1], poi);
	                    me._updateInstDis(me._followTitle, td + dis);
	                }
	            } else {
	                // 此时用户还没有开始测量，只是鼠标随便在地图上移动
	                if (me._followTitle) {
	                    me._followTitle.show();
	                    e = window.event || e;
	                    var t = e.target || e.srcElement;
	                    if (t != OperationMask.getDom()) {
	                        me._followTitle.hide();
	                    }
	                }        
	            }
	        };

	        /**
	         * 测距要结束时，双击地图，触发的操作
	         * @ignore
	         * @param {Object} e event对象
	         */
	        var distDblclick = function(e) {
	            if (!me._isOpen) {
	                return;
	            }
	            // 结束时，删除绑定的事件
	            $(OperationMask.getDom(me._map)).off("click", distClick);
	            $(document).off("mousemove", distMove);
	            $(OperationMask.getDom(me._map)).off( "dblclick", distDblclick);            
	            $(document).off( "keydown", distKeyDown);
	            $(OperationMask.getDom(me._map)).off("mouseup", distMouseUp);

	            // 调用close()关闭测距状态
	            setTimeout(function(){
	                me.close();
	            }, 50);
	        };
	        
	        /**
	         * 测距时的键盘操作
	         * @ignore
	         * @param {Object} e event对象
	         */
	        var distKeyDown = function(e){
	            e = window.event || e;
	            if (e.keyCode == 27){ 
	                // [ESC]退出本次测距
	                me._clearCurData();
	                setTimeout(function(){
	                    me.close();
	                }, 50);
	            }
	        };

	        /**
	         * 测距过程中，鼠标弹起时，触发的操作
	         * @ignore
	         * @param {Object} e event对象
	         */
	        var distMouseUp = function(e) {
	            e = window.event || e;
	            var ieVersion = 0;
	            if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
	               ieVersion = document.documentMode || + RegExp['\x241'];
	            }
	            if (ieVersion && 
	                e.button != 1 || 
	                e.button == 2){
	                    me.close();
	            }
	        };

	        // 初始化存储数据
	        me._initData();

	        // 调整title的内容
	        this._formatTitle();

	        // 创建透明覆盖层，并设置鼠标样式
	        OperationMask.show(this._map);
	        this._setCursor(this._opts.cursor);

	        // 绑定全部事件
	        $(OperationMask.getDom(this._map)).on("click", distClick);
	        $(document).on("mousemove", distMove);
	        $(OperationMask.getDom(this._map)).on("dblclick", distDblclick);
	        $(document).on("keydown", distKeyDown);
	        $(OperationMask.getDom(this._map)).on("mouseup", distMouseUp);
	        
	        // 将绑定的事件、和对应的绑定对象，记录在数组中
	        this.bindFunc = [
	            {elem : OperationMask.getDom(this._map), type : "click", func : distClick}, 
	            {elem : OperationMask.getDom(this._map), type : "dblclick", func : distDblclick},
	            {elem : document, type : "mousemove", func : distMove},
	            {elem : document, type : "keydown", func : distKeyDown},
	            {elem : OperationMask.getDom(this._map), type : "mouseup", func : distMouseUp}];
	        return true;
	    };

	    /**
	     * 画线结束时，派发drawend事件
	     * @return 无返回值
	     */
	    DistanceTool.prototype._dispatchLastEvent = function() {
	        /**
	         * 测距时，每次双击底图结束当前测距折线时，派发事件的接口
	         * @name DistanceTool#ondrawend
	         * @event
	         * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
	         * <br />{"<b>points</b> : {Point} 所有测量时，打下的节点Point对象,
	         * <br />"<b>overlays</b>：{Array} 所有测量时，生成的线段Overlay对象,
	         * <br />"<b>distance</b>：{Number} 测量解释时的最终距离}
	         *
	         * @example <b>参考示例：</b><br />
	         * myDistanceToolObject.addListener("drawend", function(e) {  alert(e.distance);  });
	         */

	        // 生成名为ondrawend的Event对象
	        // 并给该event对象添加上points、overlays和distance等属性字段
	        // 然后在此刻，将绑定在ondrawend上事件，全部赋予event参数，然后派发出去
	        var event = new scmapEvent.Event("ondrawend");
	        event.points = 
	            this._points ? 
	                this._points.slice(0) : 
	                [];
	        event.overlays = 
	            this._paths ? 
	                this._paths.slice(0, this._paths.length - 1) : 
	                [];
	        event.distance = this._getTotalDistance().toFixed(0);
	        this.dispatch(event);
	    };

	    /**
	     * 关闭测距状态
	     * @return 无返回值
	     *
	     * @example <b>参考示例：</b><br />
	     * myDistanceToolObject.close();
	     */
	    DistanceTool.prototype.close = function(){
	        if (this._isOpen == false){
	            return;
	        }
	        this._isOpen = false;

	        if (this._mapMoving){
	            delete this._mapMoving;
	        }
	        var me = this;
	        me._dispatchLastEvent();
	        if (me._points.length < 2){
	            // 不是有效绘制，清除所有内容
	            me._clearCurData();
	        } else {
	            me._map.removeOverlay(me._paths[me._paths.length - 1]);
	            me._paths[me._paths.length - 1] = null;
	            me._paths.length = me._paths.length - 1;
	            // 移除最近一次标记
	            var pt = me._points[me._points.length - 1];
	            if (pt.disLabel){
	            	me._map.removeOverlay(pt.disLabel);
	            }
	            me._processLastOp();
	        }
	        OperationMask.hide();

	        // 删除绑定的事件
	        for (var i = 0, l = this.bindFunc.length; i < l; i ++){
	            $(this.bindFunc[i].elem).off(this.bindFunc[i].type, this.bindFunc[i].func);
	        }

	        // 停止地图移动
	        if (me._movingTimerId){
	            clearInterval(me._movingTimerId);
	            me._movingTimerId = null;
	        }

	        if (this._followTitle){
	            this._followTitle.hide();
	        }
	    };

	    /**
	     * 清除本次测距的暂存数据
	     * @return 无返回值
	     */
	    DistanceTool.prototype._clearCurData = function(){
	        for (var i = 0, l = this._points.length; i < l; i ++){
	            if (this._points[i].disLabel){
	            	this._map.removeOverlay(this._points[i].disLabel);
	            }
	        }
	        for (var i = 0, l = this._paths.length; i < l; i ++){
	        	this._map.removeOverlay(this._paths[i]);
	        }
	        for (var i = 0, l = this._dots.length; i < l; i ++){
	        	this._map.removeOverlay(this._dots[i]);
	        }
	        this._initData();
	    };

	    /**
	     * 初始化存储数组
	     * @return 无返回值
	     */
	    DistanceTool.prototype._initData = function(){
	        // 初始化point数组
	        this._points.length = 0;
	        // 初始化path数组
	        this._paths.length = 0;
	        // 初始化分段距离数组
	        this._segDistance.length = 0;
	        // 初始化结点图像数组
	        this._dots.length = 0;
	    };

	    /**
	     * 计算两点之间距离并存放在分段距离数组中
	     * @param {Point}
	     * @param {Point}
	     * @return {Number} 两个地理点之间的距离
	     */
	    DistanceTool.prototype._setSegDistance = function(pt0, pt1){
	        if (!pt0 || !pt1){
	            return;
	        }
	        var dis = this._map.getDistance(pt0, pt1);
	        this._segDistance.push(dis);
	        return dis;
	    };

	    /**
	     * 获得总距离
	     * @return {Number} 总距离
	     */
	    DistanceTool.prototype._getTotalDistance = function(){
	        var totalDis = 0;
	        for (var i = 0, l = this._segDistance.length; i < l; i ++){
	            totalDis += this._segDistance[i];
	        }
	        return totalDis;
	    };

	    /**
	     * 将米制单位的数值换算成为目标单位下的数值
	     * @type {Number} 需要转换的数值
	     * @type {String} 字符串描述的目标单位，
	     * "metric" 表示米制单位，
	     * "us" 表示美国传统单位制
	     * @return {Number} 转换后的数值
	     */
	    DistanceTool.prototype._convertUnit = function(num, unit){
	        unit = unit || "metric";
	        if (this._units[unit]){
	            return num * this._units[unit].conv;
	        }
	        return num;
	    };

	    /**
	     * 添加测距结点
	     * @param {Point} 节点
	     * @return 无返回值
	     */
	    DistanceTool.prototype._addSecPoint = function(pt){
	        var ico = 
	            this._opts.secIcon ? 
	                this._opts.secIcon :
	                _entity.createIcon("../images/scmap/mapctrls.png", _entity.createSize(11, 11),_entity.createSize(5.5, 5.5));
	        var secPt = _entity.createMarker(pt, {
	            icon : ico, 
	            clickable : false, 
	            baseZIndex : 3500000, 
	            zIndexFixed : true,
	            enableMassClear : this._enableMassClear
	        });
	        this._map.addOverlay(secPt);
	        this._dots.push(secPt);
	    };

	    /**
	     * 格式化距离字符串
	     * @param {Number} 距离
	     * @return {String} 格式化的字符串
	     */
	    DistanceTool.prototype._formatDisStr = function(distance){
	        var u = this._opts.unit;
	        var unit = this._units[u].u1;
	        var dis = this._convertUnit(distance, u);

	        if (dis > this._units[u].incon){
	            dis = dis / this._units[u].incon;
	            unit = this._units[u].u2;
	            dis = dis.toFixed(1);
	        } else {
	            dis = dis.toFixed(0); 
	        }
	        return dis + unit;
	    };

	    /**
	     * 设置鼠标样式
	     * @param {String} cursor 鼠标样式
	     * @return 没有返回值
	     */
	    DistanceTool.prototype._setCursor = function(cursor){
	        // 由于webkit内核浏览器下，cursor设置后默认不会居中，所以需要对偏移值进行设置
	        var csr = 
	            /webkit/.test(navigator.userAgent.toLowerCase()) ?
	                "url(" + this._opts.cursor + ") 3 6, crosshair" :
	                "url(" + this._opts.cursor + "), crosshair"
	        OperationMask._setCursor(csr);
	    };

	    /**
	     * 获取鼠标样式
	     * @return {String} 跟随的鼠标样式
	     */
	    DistanceTool.prototype._getCursor = function(){
	        return this._opts.cursor;
	    };

	    /**
	     * 调整分段距离样式
	     * @param {Label} label 提示框的Label
	     * @param {String} 需要填入的文字
	     * @return 没有返回值
	     */
	    DistanceTool.prototype._formatSegLabel = function(label, text){
	        label.setStyle({"border" : "none", "padding" : "0"});
	        label.setContent("<span style='" + this._styles.BMapLib_diso + "'><span style='" + this._styles.BMapLib_disi + "'>" + text + "</span></span>");
	    };

	    /**
	     * 处理最后一次操作，当用户双击或测距被强行退出时调用
	     * @return 没有返回值
	     */
	    DistanceTool.prototype._processLastOp = function() {
	        var me = this;
	        // 删除上次移动临时数据
	        delete me._bind.x;
	        delete me._bind.y;
	        delete me._bind.initX;
	        delete me._bind.initY;
	        // 验证路径
	        if (me._paths.length > me._points.length - 1){
	            var l = me._paths.length - 1;
	            me._map.removeOverlay(me._paths[l]);
	            me._paths[l] = null;
	            me._paths.length = l;
	        }
	        // 保存本次测距对象
	        var disObj = {};
	        disObj.points = me._points.slice(0);
	        disObj.paths  = me._paths.slice(0);
	        disObj.dots   = me._dots.slice(0);
	        disObj.segDis = me._segDistance.slice(0);
	        // 判断总距离和按钮位置
	        var lstPx = me._map.pointToPixel(disObj.points[disObj.points.length - 1]);
	        var prePx = me._map.pointToPixel(disObj.points[disObj.points.length - 2]);
	        var btnOffset = [0, 0];
	        var disOffset = [0, 0];
	        if (lstPx.y - prePx.y >= 0){
	            // 距离位于下端
	            disOffset = [-5, 11];
	        } else {
	            // 距离位于上端
	            disOffset = [-5, -35];
	        }
	        if (lstPx.x - prePx.x >= 0){
	            // 按钮位于右侧
	            btnOffset = [14, 0];
	        } else {
	            // 按钮位于左侧
	            btnOffset = [-14, 0];
	        }
	        // 显示总距离
	        var pt = disObj.points[disObj.points.length - 1];
	        pt.disLabel = _entity.createLabel("", {offset: _entity.createSize(-15, -40), enableMassClear: me._enableMassClear});
	        pt.disLabel.setStyle({color: "#333", borderColor: "#ff0103"});
	        me._map.addOverlay(pt.disLabel);
	        pt.disLabel.setOffset(_entity.createSize(disOffset[0], disOffset[1]));
	        pt.disLabel.setPosition(pt);
	        me._formatTitle(2, "", "", pt.disLabel);
	        // 添加关闭按钮
	        var bico = 
	            this._opts.closeIcon ? 
	                this._opts.closeIcon :
	                	_entity.createIcon("../images/scmap/distance_close.png", _entity.createSize(12, 12), _entity.createSize(6, 6));
	        disObj.closeBtn = _entity.createMarker(disObj.points[disObj.points.length - 1], 
	            {icon : bico, 
	            offset : _entity.createSize(btnOffset[0], btnOffset[1]), 
	            baseZIndex : 3600000,
	            enableMassClear : me._enableMassClear}
	        );
	        me._map.addOverlay(disObj.closeBtn);
//	        disObj.closeBtn.setTitle("清除本次测距");
	        // 点击关闭按钮，绑定关闭按钮事件
	        disObj.closeBtn.addListener("click", function(e){
	            // 关闭本次测距，清除相关存储和变量
	            for (var i = 0, l = disObj.points.length; i < l; i ++){
	            	me._map.removeOverlay(disObj.points[i].disLabel);
	                disObj.points[i].disLabel = null;
	            }
	            for (var i = 0, l = disObj.paths.length; i < l; i ++){
	            	me._map.removeOverlay(disObj.paths[i]);
	                disObj.paths[i] = null;
	            }
	            for (var i = 0, l = disObj.dots.length; i < l; i ++){
	            	me._map.removeOverlay(disObj.dots[i]);
	                disObj.dots[i] = null;
	            }
	            me._map.removeOverlay(disObj.closeBtn);
	            disObj.closeBtn = null;
	            scmapEvent.stopBubble(e);
	            
	            /**
	             * @ignore
	             * 测距结束后，点击线段上最后一个节点旁的关闭按钮时，派发事件的接口
	             * @name DistanceTool#onremovepolyline
	             * @event
	             * @param {Event Object} e 回调函数会返回event参数
	             *
	             * @example <b>参考示例：</b><br />
	             * myDistanceToolObject.addListener("removepolyline", function(e) {  alert(e.type);  });
	             */

	            // 生成名为onremovepolyline的Event对象
	            // 然后在此刻，将绑定在onremovepolyline上事件，全部赋予event参数，然后派发出去
	            var event = new scmapEvent.Event("onremovepolyline");
	            me.dispatch(event);
	        });        
	        me._initData();
	    };

	    /**
	     * 生成测距过程中的文字提示框
	     * @param {String} type
	     * @param {String} text 
	     * @param {String} distance
	     * @param {Label} label
	     * @return 无返回值
	     */
	    DistanceTool.prototype._formatTitle = function(type, text, distance, label){
	        var title = label || this._followTitle;
	        if (!title){
	            return;
	        }
	        title.setStyle({"lineHeight" : "16px", "zIndex" : "85", "padding" : "3px 5px"});
	        var t = this._startFollowText || "";
	        var htmls = [];
	        if (type == 1){
	            // 测距过程中的提示
	            title.setOffset(_entity.createSize(0, 25));
	            var u = this._opts.unit;
	            var unit = this._units[u].u1;
	            var dis = this._convertUnit(distance, u);
	            if (dis > this._units[u].incon){
	                dis = dis / this._units[u].incon;
	                unit = this._units[u].u2;
	                dis = dis.toFixed(1);
	            } else {
	                dis = dis.toFixed(0);
	            }
	            htmls.push("<span>总长：<span style='" + this._styles.BMapLib_disBoxDis+"'>" + dis + "</span>" + unit + "</span><br />");
	            htmls.push("<span style='color:#7a7a7a'>" + text + "</span>");
	        } else if (type == 2) {
	            // 结束时的总距离展示
	            var u = this._opts.unit;
	            var unit = this._units[u].u1;
	            var dis = this._convertUnit(this._getTotalDistance(), u);
	            if (dis > this._units[u].incon){
	                dis = dis / this._units[u].incon;
	                unit = this._units[u].u2;
	                dis = dis.toFixed(1);
	            } else{
	                dis = dis.toFixed(0);
	            }
	            htmls.push("总长：<span style='" + this._styles.BMapLib_disBoxDis + "'>" + dis + "</span>" + unit);
	        } else {
	            title.setOffset(_entity.createSize(0, 25));
	            htmls.push(t);
	        }
	        title.setContent(htmls.join(""));
	    };

	    /**
	     * 更新label的距离
	     * @param HTMLElement label的DOM元素
	     * @param Number 距离
	     */
	    DistanceTool.prototype._updateInstDis = function(label, dis){
	        // 换算距离
	        var u = this._opts.unit;
	        var unit = this._units[u].u1;
	        if (dis > this._units[u].incon){
	            dis = dis / this._units[u].incon;
	            unit = this._units[u].u2;
	            dis = dis.toFixed(1);
	        } else {
	            dis = dis.toFixed(0);
	        }
	        // 修改Label的内容
	        if (label) {
	            var htmls = [];
	            htmls.push("<span>总长：<span style='" + this._styles.BMapLib_disBoxDis + "'>" + dis + "</span>" + unit + "</span><br />");
	            htmls.push("<span style='color:#7a7a7a'>" + this._opts.followText + "</span>");
	            label.setContent(htmls.join(""));
	        }
	    };

	    /**
	     * 隐藏相关的线段和提示框文字
	     * @return 无返回值
	     */
	    DistanceTool.prototype._hideCurrent = function(){
	        if (!this._isOpen){
	            return;
	        }
	        if (this._paths.length > 0){
	            var p = this._paths[this._paths.length - 1];
	            me._map.removeOverlay(p);
//	            p.hide();
	        }
	        this._followTitle && this._followTitle.hide();
	    };

	    /**
	     * 验证传入点的位置合理性
	     * @param {Point} pt 需要被验证的point点
	     * @return 无返回值
	     */
	    DistanceTool.prototype._isPointValid = function(pt){
	        if (!pt){
	            return false;
	        }
	        var mapBounds = this._map.getBounds();
	        var sw = mapBounds.getSouthWest(),
	              ne = mapBounds.getNorthEast();
	        if (pt.lng < sw.lng ||
	            pt.lng > ne.lng ||
	            pt.lat < sw.lat ||
	            pt.lat > ne.lat) {
	                return false;
	        }
	        return true;
	    };


	    /**
	     * OperationMask，透明覆盖层，在地图上进行鼠标绘制操作时使用，
	     * 闭包，对外不暴露
	     */
	    var OperationMask = {
	        /**
	         * map对象
	         * @type {Map}
	         */
	        _map : null,

	        /**
	         * HTML字符串
	         * @type {String}
	         */
	        _html : "<div style='background:transparent;position:absolute;left:0;top:0;width:100%;height:100%;z-index:1000' unselectable='on'></div>",

	        /**
	         * html元素
	         * @type {HTMLElement}
	         */
	        _maskElement : null,

	        /**
	         * 鼠标指针
	         * @type {String}
	         */
	        _cursor: 'default',

	        /**
	         * 操作层是否在使用中
	         * @type {Boolean}
	         */
	        _inUse: false,

	        /**
	         * 透明覆盖层的显示
	         *
	         * @param {Map} map map对象
	         * @return 无返回值
	         */
	        show : function(map) {
	            if (!this._map) {
	                this._map = map;
	            }
	            this._inUse = true;
	            if (!this._maskElement) {
	                this._createMask(map);
	            }
	            this._maskElement.style.display = 'block';
	        },

	        /**
	         * 创建覆盖层
	         *
	         * @param {Map} map map对象
	         * @return 无返回值
	         */
	        _createMask : function(map) {
	            this._map = map;
	            if (!this._map) {
	                return;
	            }
	            $(this._map.getContainer()).append(this._html);
	            var elem = this._maskElement = this._map.getContainer().lastChild;

	            var stopAndPrevent = function(e) {
	            	scmapEvent.stopBubble(e);
	                return scmapEvent.preventDefault(e);
	            };
	            $(elem).on('mouseup', function(e) {
	                if (e.button == 2) {
	                    stopAndPrevent(e);
	                }
	            });
	            $(elem).on('contextmenu', stopAndPrevent);//TODO
	            elem.style.display = 'none';
	        },

	        /**
	         * 获取当前绘制点的地理坐标
	         *
	         * @param {Event} e e对象
	         * @param {Boolean} n 是否向上查到相对于地图container元素的坐标位置
	         * @return Point对象的位置信息
	         */
	        getDrawPoint : function(e, n) {
	            e = window.event || e;
	            var x = e.layerX || e.offsetX || 0;
	            var y = e.layerY || e.offsetY || 0;
	            var t = e.target || e.srcElement;
	            if (t != OperationMask.getDom(this._map) && n == true) {
	                while (t && t != this._map.getContainer()) {
	                    if (!(t.clientWidth == 0 && 
	                         t.clientHeight == 0 && 
	                         t.offsetParent && 
	                         t.offsetParent.nodeName.toLowerCase() == 'td')) {
	                            x += t.offsetLeft;
	                            y += t.offsetTop;
	                    }
	                    t = t.offsetParent;
	                }
	            }

	            if (t != OperationMask.getDom(this._map) && 
	                t != this._map.getContainer()) {
	                    return;
	            }
	            if (typeof x === 'undefined' || 
	                typeof y === 'undefined') {
	                    return;
	            }
	            if (isNaN(x) || isNaN(y)) {
	                return;
	            }
	            return this._map.pixelToPoint(_entity.createPixel(x, y));
	        },

	        /**
	         * 透明覆盖层的隐藏
	         *
	         * @return 无返回值
	         */
	        hide : function() {
	            if (!this._map) {
	                return;
	            }
	            this._inUse = false;
	            if (this._maskElement) {
	                this._maskElement.style.display = 'none';
	            }
	        },

	        /**
	         * 获取HTML容器
	         *
	         * @param {Map} map map对象
	         * @return HTML容器元素
	         */
	        getDom : function(map) {
	            if (!this._maskElement) {
	                this._createMask(map);
	            }
	            return this._maskElement;
	        },

	        /**
	         * 设置鼠标样式
	         *
	         * @type {String} cursor 鼠标样式
	         * @return 无返回值
	         */
	        _setCursor : function(cursor) {
	            this._cursor = cursor || 'default';
	            if (this._maskElement) {
	                this._maskElement.style.cursor = this._cursor;                
	            }
	        }
	    };

		
		
	    /**
	     * 计算多边形面或点数组构建图形的面积,注意：坐标类型只能是经纬度，且不适合计算自相交多边形的面积
	     * @param {Polygon|Array<Point>} polygon 多边形面对象或者点数组
	     * @returns {Number} 多边形面或点数组构成图形的面积
	     */
	    var AreaTool = function (map){
	    	this.init(map);
	    	this._followTitle = null;//跟随的title覆盖物
	    	this._isOpen = false;//是否已经开启了测距状态
	    	this.temps = [];
	    	this._startFollowText = "单击确定点位,双击结束";
	    };
	    AreaTool.prototype = {
	    		init:function(map){
	    			this.drawingTool = new DrawManager(map,{
	    	    		drawType:Enum.drawType.POLYGON,//标绘工具类型
	                    isOpen:false,//标绘工具是否开启
	                    polygonOptions:{
	                    	strokeColor:"#ff6319",
	                    	strokeOpacity:0.8,
	                    	fillColor:"#ff6319",
	                    	fillOpacity:0.2
	                    }//绘制多边形样式
	    	    	});
	    			var self = this;
	    			this.drawingTool.addListener('polygoncomplete',function(event) {
	    				self.drawingTool.close();
	    				var _path = event.overlay.getPath();
	    				
	    			    var _text = getPolygonArea(event.overlay);
	    			    if(_text > 10000){//大于0.01km2时显示km2
	    			    	_text = (_text / 1000000).toFixed(2) + '平方千米';
	    			    }else{
	    			    	_text = _text.toFixed(2) + '平方米';
	    			    }
	    			    var areaLabel = _entity.createLabel(_text, {offset : _entity.createSize(10, -5)});
	    			    areaLabel.setStyle({color : "#333", borderColor : "#ff0103"});
	    			    areaLabel.setPosition(_path[_path.length - 1]);
	    			    map.addOverlay(areaLabel);
	    			    
	    			    var closeBtn = _entity.createMarker(_path[_path.length - 1],{
	    					icon : _entity.createIcon("../images/scmap/distance_close.png", _entity.createSize(12, 12), _entity.createSize(6, 6)), 
	    			    });
	    			    map.addOverlay(closeBtn);
	    			    
	    			    closeBtn.addListener('click',function(){
	    			    	map.removeOverlay(event.overlay);
	    			    	map.removeOverlay(areaLabel);
	    			    	map.removeOverlay(closeBtn);
	    			    });
	    			    
	                });
	    		},
	    		open:function(){
	    			this.drawingTool.open();
	    		},
	    		close:function(){
	    			this.drawingTool.close();
	    		}
	    };
	    
	    var EARTHRADIUS = 6370996.81; 
	    function getPolygonArea(polygon){
	        //检查类型
//	        if(!(polygon instanceof BMap.Polygon) &&
//	            !(polygon instanceof Array)){
//	            return 0;
//	        }
	        var pts;
//	        if(polygon instanceof BMap.Polygon){
	            pts = polygon.getPath();
//	        }else{
//	            pts = polygon;    
//	        }
	        
	        if(pts.length < 3){//小于3个顶点，不能构建面
	            return 0;
	        }
	        
	        var totalArea = 0;//初始化总面积
	        var LowX = 0.0;
	        var LowY = 0.0;
	        var MiddleX = 0.0;
	        var MiddleY = 0.0;
	        var HighX = 0.0;
	        var HighY = 0.0;
	        var AM = 0.0;
	        var BM = 0.0;
	        var CM = 0.0;
	        var AL = 0.0;
	        var BL = 0.0;
	        var CL = 0.0;
	        var AH = 0.0;
	        var BH = 0.0;
	        var CH = 0.0;
	        var CoefficientL = 0.0;
	        var CoefficientH = 0.0;
	        var ALtangent = 0.0;
	        var BLtangent = 0.0;
	        var CLtangent = 0.0;
	        var AHtangent = 0.0;
	        var BHtangent = 0.0;
	        var CHtangent = 0.0;
	        var ANormalLine = 0.0;
	        var BNormalLine = 0.0;
	        var CNormalLine = 0.0;
	        var OrientationValue = 0.0;
	        var AngleCos = 0.0;
	        var Sum1 = 0.0;
	        var Sum2 = 0.0;
	        var Count2 = 0;
	        var Count1 = 0;
	        var Sum = 0.0;
	        var Radius = EARTHRADIUS; //6378137.0,WGS84椭球半径 
	        var Count = pts.length;        
	        for (var i = 0; i < Count; i++) {
	            if (i == 0) {
	                LowX = pts[Count - 1].lng * Math.PI / 180;
	                LowY = pts[Count - 1].lat * Math.PI / 180;
	                MiddleX = pts[0].lng * Math.PI / 180;
	                MiddleY = pts[0].lat * Math.PI / 180;
	                HighX = pts[1].lng * Math.PI / 180;
	                HighY = pts[1].lat * Math.PI / 180;
	            }
	            else if (i == Count - 1) {
	                LowX = pts[Count - 2].lng * Math.PI / 180;
	                LowY = pts[Count - 2].lat * Math.PI / 180;
	                MiddleX = pts[Count - 1].lng * Math.PI / 180;
	                MiddleY = pts[Count - 1].lat * Math.PI / 180;
	                HighX = pts[0].lng * Math.PI / 180;
	                HighY = pts[0].lat * Math.PI / 180;
	            }
	            else {
	                LowX = pts[i - 1].lng * Math.PI / 180;
	                LowY = pts[i - 1].lat * Math.PI / 180;
	                MiddleX = pts[i].lng * Math.PI / 180;
	                MiddleY = pts[i].lat * Math.PI / 180;
	                HighX = pts[i + 1].lng * Math.PI / 180;
	                HighY = pts[i + 1].lat * Math.PI / 180;
	            }
	            AM = Math.cos(MiddleY) * Math.cos(MiddleX);
	            BM = Math.cos(MiddleY) * Math.sin(MiddleX);
	            CM = Math.sin(MiddleY);
	            AL = Math.cos(LowY) * Math.cos(LowX);
	            BL = Math.cos(LowY) * Math.sin(LowX);
	            CL = Math.sin(LowY);
	            AH = Math.cos(HighY) * Math.cos(HighX);
	            BH = Math.cos(HighY) * Math.sin(HighX);
	            CH = Math.sin(HighY);
	            CoefficientL = (AM * AM + BM * BM + CM * CM) / (AM * AL + BM * BL + CM * CL);
	            CoefficientH = (AM * AM + BM * BM + CM * CM) / (AM * AH + BM * BH + CM * CH);
	            ALtangent = CoefficientL * AL - AM;
	            BLtangent = CoefficientL * BL - BM;
	            CLtangent = CoefficientL * CL - CM;
	            AHtangent = CoefficientH * AH - AM;
	            BHtangent = CoefficientH * BH - BM;
	            CHtangent = CoefficientH * CH - CM;
	            AngleCos = (AHtangent * ALtangent + BHtangent * BLtangent + CHtangent * CLtangent) / (Math.sqrt(AHtangent * AHtangent + BHtangent * BHtangent + CHtangent * CHtangent) * Math.sqrt(ALtangent * ALtangent + BLtangent * BLtangent + CLtangent * CLtangent));
	            AngleCos = Math.acos(AngleCos);            
	            ANormalLine = BHtangent * CLtangent - CHtangent * BLtangent;
	            BNormalLine = 0 - (AHtangent * CLtangent - CHtangent * ALtangent);
	            CNormalLine = AHtangent * BLtangent - BHtangent * ALtangent;
	            if (AM != 0)
	                OrientationValue = ANormalLine / AM;
	            else if (BM != 0)
	                OrientationValue = BNormalLine / BM;
	            else
	                OrientationValue = CNormalLine / CM;
	            if (OrientationValue > 0) {
	                Sum1 += AngleCos;
	                Count1++;
	            }
	            else {
	                Sum2 += AngleCos;
	                Count2++;
	            }
	        }        
	        var tempSum1, tempSum2;
	        tempSum1 = Sum1 + (2 * Math.PI * Count2 - Sum2);
	        tempSum2 = (2 * Math.PI * Count1 - Sum1) + Sum2;
	        if (Sum1 > Sum2) {
	            if ((tempSum1 - (Count - 2) * Math.PI) < 1)
	                Sum = tempSum1;
	            else
	                Sum = tempSum2;
	        }
	        else {
	            if ((tempSum2 - (Count - 2) * Math.PI) < 1)
	                Sum = tempSum2;
	            else
	                Sum = tempSum1;
	        }
	        totalArea = (Sum - (Count - 2) * Math.PI) * Radius * Radius;

	        return totalArea; //返回总面积
	    }
			
		
		/**
		 * 热力图覆盖物
		 * @class
		 * 
		 * 实例化后用map.addOverlay() 添加
		 * 
		 * 参数说明列表：
		 * 	gradient 热力图的渐变区间  默认{ 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"} 根据权重计算
		 * 	radius 点位半径
		 * 	maxOpacity 最高的透明度
		 * 	minOpacity 最低透明度
		 *  blur 模糊度
		 */
		function HeatmapOverlay(options) {
			this._conf = options;
			this._standardZoom = options.standardZoom;
			this._heatmap = null;
			this._data = [];
			this._transformData = {data:[]};
			this._bounds = null;
			this.overlay = this;
		}
		
		
		function heatmapAdd(map) {
			this._map = map;
			var div = this._container = $('<div>').css({
				'position': 'absolute',
				'top': 0,
				'left': 0,
				'border': 'none',
				'width': this._map.getSize().width + 'px',
				'height': this._map.getSize().height + 'px'
			})[0];
			this._map.getPanes().mapPane.appendChild(div);
			this._conf.container = div;
			this._heatmap = heatmapFactory.create(this._conf);
			return div;
		}
		
		function heatmapDraw() {
			if (this._transformData.data.length) {
				this._transform();
				return;
			}
			
			var bounds = this._map.getBounds();
			if (bounds.equals(this._bounds)) {
				return;
			}
			
			var origin = this._getOrigin(bounds);
	        
	        var len = this._data.length;
	        if (len > 0) {
	        	var d = { 
	        			max: this._transformData.max,
	        			min: this._transformData.min,
	        			data:[]
	        	};
	        	while (len--) {
	        		var preExitData = this._data[len];
	        		if (!this._bounds.containsPoint(preExitData.point)) {
	        			continue;
	        		}
	        		
	        		d.data.push(this._pointToHeatmapData(preExitData,origin.x,origin.y));
	        	}
	        	this._heatmap.setData(d);
	        }

		}
		
		_entity.extendOverlay(HeatmapOverlay,heatmapAdd,heatmapDraw);
		
		
		
		HeatmapOverlay.prototype.setData = function(data) {
			
			this._transformData = data;
			this._data = [];
			this._map && this.draw();
		};
		
		HeatmapOverlay.prototype.addData = function(data) {
			if (!this._map) {
				this._transformData.data.push(data);
				return;
			}
			var _data = this._push(data);
			this._heatmap.addData(this._pointToHeatmapData(_data,
					this._map.pointToOverlayPixel(this._bounds.getSouthWest()).x,
					this._map.pointToOverlayPixel(this._bounds.getNorthEast()).y));
		};
		
		
		HeatmapOverlay.prototype._transform = function() {
			var d = {
					min: this._transformData.min,
					max: this._transformData.max,
					data: []
			};
			var origin = this._getOrigin();
			
			var len = this._transformData.data.length;
			while (len--) {
				var data = this._push(this._transformData.data[len]);
				if (!this._bounds.containsPoint(data.point)) {
					return;
				}
				d.data.push(this._pointToHeatmapData(data,origin.x,origin.y));
			}
			this._heatmap.setData(d);
			this._transformData.data = [];
		};
		
		HeatmapOverlay.prototype._pointToHeatmapData = function(data,leftX,topY) {
			var divPixel = this._map.pointToOverlayPixel(data.point);
			var	heatmapData = {
				x: (divPixel.x  - leftX) >> 0,
				y: (divPixel.y - topY) >> 0,
				value: data.value,
				radius: data.radius
			};
			
			if (this._standardZoom) {
				var diff = this._map.getZoom() - this._standardZoom;
				var radius = Math.pow(2,diff) * (data.radius || this._conf.radius || 10);
				heatmapData.radius = radius;
			}
			
			return heatmapData;
		};
		
		HeatmapOverlay.prototype._push = function(data) {
			var point = _entity.createPoint(data.lng,data.lat);
			var _data = {
					point: point,
					value: data.value,
					radius: data.radius
			};
			this._data.push(_data);
			return _data;
		};
		
		HeatmapOverlay.prototype._getOrigin = function(bounds) {
			this._bounds = bounds || this._map.getBounds();
			
	        var ne = this._map.pointToOverlayPixel(this._bounds.getNorthEast()),
	    		sw = this._map.pointToOverlayPixel(this._bounds.getSouthWest()),
	    		topY = ne.y,
	    		leftX = sw.x;
	        
	        $(this._container).css({
	        	left: leftX + 'px',
	        	top: topY + 'px'
	        });
	        
	        return {
	        	y: ne.y,
	        	x: sw.x
	        };
		};
		
		/******************************************************/
		
		return{
			DrawManager: DrawManager,
			InfoBox: InfoBox,
			TextIcon: TextIcon,
			MarkerClusterer: MarkerClusterer,
			HeatmapOverlay: HeatmapOverlay,
			Enum: Enum,
			DistanceTool:DistanceTool,
			AreaTool:AreaTool
		};
	}
	return Tools;
}));