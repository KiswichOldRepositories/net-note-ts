/**
 * @file 基础地图类接口
 * @version 1.1.3
 * @update 2017-05-3
 * 
 * 增加marker setTop方法，将maker置顶
 * 修复谷歌地图无法设置边线透明度
 * 修复多边形事件绑定bug
 * 修复谷歌地图label偏移量错误
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

        root.scooper.SCMap = factory(root.jQuery);
    }
}(this, function ($) {
	"use strict";
	
	
	/**
     * 枚举对象
     * <li> mapServer:地图服务器
     * <li> mapType:地图类型
     * <li> controlAnchor:控件锚点
     * <li> PanZoomControl:鱼骨控件类型
	 */
	var Enum = {
			mapServer: {
				BAIDU: 'baidu',
				GOOGLE: 'google',
				SUPER: 'super'
			}
	};
	
	
	var _nowMapEntity;
	/**
	 * 根据类型获取，地图对象
	 * 
	 * @param {String} type 地图服务器类型
	 * @return {Object} map 返回一个地图实例
	 * @throw 当类型不匹配的时候抛出异常
	 */
	function createMapEntity(type) {
		switch (type) {
			case 'baidu':
				Enum.mapType = {
					NORMAL_MAP: {mapType: BMAP_NORMAL_MAP},
					SATELLITE_MAP: {mapType:BMAP_SATELLITE_MAP}
				};
				this._type = 'baidu';
				_nowMapEntity = new BaiduMap();
				break;

			case 'google':
				Enum.mapType = {
					NORMAL_MAP: google.maps.MapTypeId.ROADMAP,
					SATELLITE_MAP: google.maps.MapTypeId.SATELLITE
				};
				this._type = 'google';
				_nowMapEntity = new GoogleMap();
				break;
			case 'super':
				return new SuperMap();
			default:
				throw new Error("type is undefined");
		}
		return _nowMapEntity;
	}
	
	/**
	 * 私有方法
	 */
	var fnc = {
		isIE: function() {
			return !!window.ActiveXObject || "ActiveXObject" in window
		},
		mapToScmapPath: function(path) {
            var temp = []
			$.each(path,function(i,point){
				temp.push(_nowMapEntity.createPoint(point));
			});
            return temp;
		},
		
		scmapToMapPath: function(path) {
			var temp = [];
			$.each(path,function(i,point){
				temp.push(point.point);
			});
			return temp;
		},
	}

	
	
	/**
	 * 百度地图对象
	 * @class
	 */
	function BaiduMap() {
		//基础类
		
		/**
		 * 坐标点
		 * 
		 * @param {Number} lng 经度
		 * @param {Number} lat 维度
		 * @param {BMap.Point} point 百度源生类
		 * @class
		 */
		function Point(lng,lat) {
			
			if (typeof lng === 'object') {
				this.point = lng;
				this.lng = this.point.lng;
				this.lat = this.point.lat;
			} else {
				this.lng = lng;
				this.lat = lat;
				this.point = new BMap.Point(lng,lat);
			}
			
		}
		
		Point.prototype = {
				equals: function(other) {
					return this.lng === other.lng && this.lat === other.lat;
				}
		}
		
		/**
		 * 像素点，坐标原点在地图窗口的左上角
		 * 
		 * @param {Number} x
		 * @param {Number} y
		 * @param {BMap.Pixel} pixel 百度源生类
		 * @class
		 */
		function Pixel(x,y) {
			
			if (typeof x === 'object') {
				this.pixel = x;
				this.x = this.pixel.x;
				this.y = this.pixel.y;
			} else {
				this.x = x;
				this.y = y;
				this.pixel = new BMap.Pixel(x,y);
			}
		}
		
		Pixel.prototype = {
				equals: function(other) {
					return this.x === other.x&&this.y === other.y;
				}
		}
		
		/**
		 * 矩形边界范围
		 * 
		 * @param {Point} ne 区域的东北角
		 * @param {Point} sw 区域的西南角
		 * @param {BMap.Bounds} bounds 百度源生类
		 * @class
		 */
		function Bounds(sw,ne) {
			if (sw instanceof BMap.Bounds) {
				this.bounds = sw;
				sw = this.bounds.getSouthWest();
				ne = this.bounds.getNorthEast();
			}else {
				if(ne.lng < sw.lng || ne.lat<sw.lat){
					throw new Error("Point is error");
				}
				this.bounds = new BMap.Bounds(sw.point,ne.point);
			}
			if(ne.lng < sw.lng || ne.lat<sw.lat){
				throw new Error("Point is error");
			}
			this.minX = sw.lat;
			this.minY = sw.lng;
			this.maxX = ne.lat;
			this.maxY = ne.lng;
		}
		
		Bounds.prototype = {
				equals: function(other) {
					return this.bounds.equals(other.bounds);
				},
				containsPoint: function(point) {
					return  this.bounds.containsPoint(point.point);
				},
				containsBounds: function(bounds) {
					return this.bounds.containsBounds(bounds.bounds);
				},
				intersects: function(other) {
					return this.bouns.intersects(other.bounds) != null;
				},
				extend: function(point) {
					this.bounds.extend(point.point);
					var sw = this.bounds.getSouthWest();
					var ne = this.bounds.getNorthEast();
					this.minX = sw.lat;
					this.minY = sw.lng;
					this.maxX = ne.lat;
					this.maxY = ne.lng;
				},
				getCenter: function() {
					return new Point(this.bounds.getCenter());
				},
				getNorthEast: function() {
					return new Point(this.bounds.getNorthEast());
				},
				getSouthWest: function() {
					return new Point(this.bounds.getSouthWest());
				}
		}
		
		/**
		 * 像素坐标表示的矩形大小
		 * 
		 * @param {Number} width 宽
		 * @param {Number} height 高
		 * @class
		 */
		function Size(width,height) {
			if (typeof width === 'object') {
				this.size = width;
				this.width = this.size.width;
				this.height = this.size.height;
			} else {
				this.width = width;
				this.height = height;
				this.size = new BMap.Size(width,height);
			}
		}
		
		Size.prototype = {
				equals: function(other) {
					return this.size.equals(other.size);
				}
		}
		
		//地图类
		/**
		 * 地图对象
		 * 
		 * @param {String} div 放置地图对象的容器id
		 * @param {Object} opt 地图设置属性
		 * 		<li>minZoom: 最小缩放级别
		 * 		<li>maxZoom: 最大缩放级别
		 * 		<li>mapType: 地图显示类型
		 * @class
		 */
		function Map(div,opt) {
			var me = this;
			me._div = $('#'+div)[0];
			opt = opt || {};
			me._overlays = new Array();
			me._minZoom = opt.minZoom ? opt.minZoom : 3;
			me._maxZoom = opt.maxZoom ? opt.maxZoom : 19;
			me._mapType = opt.mapType ? opt.mapType : Enum.mapType.NORMAL_MAP;
			
			me.map = new BMap.Map(me._div,{
				minZoom: me._minZoom,
				maxZoom: me._maxZoom,
				mapType: me._mapType.mapType,
				enableMapClick: false
			});
			me.map.__parent__ = this; 
			
			me._afterBoundsChange();
			me._doCenterChange();
			me._isMapLoaded();
			
			if(opt.controls){
				me._addControl(opt.controls);
			}
		}
			
		Map.prototype = {
				
				constructor:Map,
				
				/**
				 * 获取地图缩放最小级别
				 */
				getMinZoom: function() {
					return this._minZoom;
				},
				/**
				 * 获取地图缩放最大级别
				 */
				getMaxZoom: function() {
					return this._maxZoom;
				},
				
				/**
				 * 设置地图缩放最小级别，不得小于地图类型的最小级别
				 */
				setMinZoom: function(num) {
					this.map.setMinZoom(num);
					this._minZoom = num;
				},
				/**
				 * 设置地图缩放最大级别，不得大于地图类型的最大级别
				 */
				setMaxZoom: function(num) {
					this.map.setMaxZoom(num);
					this._maxZoom = num;
				},
				/**
				 * 改变鼠标样式
				 */
				setDefaultCursor: function(css) {
					this.map.setDefaultCursor(css);
				},
				/**
				 * 开启滚轮
				 */
				enableScrollWheelZoom: function() {
					this.map.enableScrollWheelZoom();
				},
				/**
				 * 关闭滚轮
				 */
				disableScrollWheelZoom: function() {
					this.map.disableScrollWheelZoom();
				},
				/**
				 * 获取当前视野的边界
				 * @return {Bounds}
				 */
				getBounds: function() {
					return new Bounds(this.map.getBounds());
				},
				/**
				 * 获取中心点
				 * @returns {Point}
				 */
				getCenter: function() {
					return new Point(this.map.getCenter());
				},
				/**
				 * 获取当前视野的大小，单位像素
				 * @returns {Size}
				 */
				getSize: function() {
					return new Size(this.map.getSize());
				},
				/**
				 * 返回当前地图的缩放级别
				 * @returns {Number}
				 */
				getZoom: function() {
					return this.map.getZoom();
				},
				/**
				 * 返回当前地图的地图类型
				 * @returns {MapType}
				 */
				getMapType: function() {
					return new MapType(this.map.getMapType());
				},
				/**
				 * 设置地图中心点和缩放级别，初始化地图
				 * @param {Point} point 中心点经纬度
				 * @param {Number} zoom 缩放级别
				 */
				centerAndZoom: function(point,zoom) {
					this.map.centerAndZoom(point.point,zoom);
				},
				/**
				 * 移动地图
				 * @param {Point} point 地图移动到该点
				 */
				panTo: function(point) {
					this.map.panTo(point.point);
				},
				/**
				 * 移动地图
				 * @param {Number} x x轴方向
				 * @param {Number} y y轴方向
				 */
				panBy: function(x,y,flag) {
					this.map.panBy(-x,-y,{'noAnimation': !!flag});
				},
				/**
				 * 重置地图
				 */
				reset: function() {
					this.map.reset();
				},
				/**
				 * 设置地图中心点
				 * @param {Point} point 中心点坐标
				 */
				setCenter: function(point) {
					this.map.setCenter(point.point);
				},
				/**
				 * 设置地图类型
				 * @param {MapType} mapType 地图类型
				 */
				setMapType: function(mapType) {
					this.map.setMapType(mapType.mapType);
				},
				/**
				 * 设置地图缩放级别
				 * @param {Number} zoom 缩放级别
				 */
				setZoom: function(zoom) {
					this.map.setZoom(zoom);
				},

				/**
				 * 添加覆盖物
				 * @param {Overlay} overlay
				 */
				addOverlay: function(overlay) {
					if (!overlay || !overlay.overlay || this._overlays.indexOf(overlay) > 0) {
						return;
					}

					this.map.addOverlay(overlay.overlay);
					this._overlays.push(overlay);
				},
				/**
				 * 添加一组覆盖物
				 * @param {Array<Overlay>} overlays 覆盖物组
				 */
				addOverlays: function(overlays) {
					var me = this;
					if (!overlays) {
						return;
					}
					$.each(overlays,function(i,overlay){
						me.addOverlay(overlay);
					});
				},
				
				/**
				 * 在固定点，打开信息窗口
				 * @param {InfoWindow} infoWindow 信息窗口
				 * @param {Point} point 经纬度
				 */
				openInfoWindow: function(infoWindow,point) {
					this.map.openInfoWindow(infoWindow.info,point.point);
				},
				/**
				 * 移除覆盖物
				 * @param {Overlay} overlay 覆盖物
				 */
				removeOverlay: function(overlay) {
					
					//TODO 注意下label的问题
					
					this.map.removeOverlay(overlay.overlay);
					var index = this._overlays.indexOf(overlay);
					this._overlays.splice(index,1);
				},
				/**
				 * 清除所有覆盖物
				 */
				clearOverlays: function() {
					this.map.clearOverlays();
					this._overlays = [];
				},
				/**
				 * 关闭打开的信息窗口
				 */
				closeInfoWindow: function() {
					this.map.closeInfoWindow();
				},
				/**
				 * 获取地图容器
				 * @returns {DOMObject}
				 */
				getContainer: function() {
					return this._div
				},
				/**
				 * 获取地图上打开的信息窗口
				 * @return {InfoWindow}
				 */
				getInfoWindow: function() {
					return new InfoWindow(this.map.getInfoWindow());
				},
				/**
				 * 获取地图上所有覆盖物
				 * @returns {Array<Overlay>}
				 */
				getOverlays: function() {
					return this._overlays;
				},
				/**
				 * 获取地图容器
				 * @returns {Array<DOMObject>}
				 */
				getPanes: function() {
					return this.map.getPanes();
				},
				/**
				 * 像素转经纬度
				 * @param {Pixel} pixel 像素坐标
				 * @returns {Point}
				 */
				pixelToPoint: function(pixel) {
					return new Point(this.map.pixelToPoint(pixel.pixel));
				},
				/**
				 * 经纬度转像素
				 * @param {Point} point 经纬度坐标
				 * @returns {Pixel}
				 */
				pointToPixel: function(point) {
					return new Pixel(this.map.pointToPixel(point.point));
				},
				/**
				 * 经纬度转像素【坐标原点是地图的中心点】
				 * @param {Point} point 经纬度坐标
				 * @returns {Pixel}
				 */
				pointToOverlayPixel: function(point) {
					return new Pixel(this.map.pointToOverlayPixel(point.point));
				},
				/**
				 * 两点间距离
				 * @param {Point} start 起始点经纬度
				 * @param {Point} end 借宿点经纬度
				 * @returns {Number}
				 */
				getDistance: function(start,end) {
					return this.map.getDistance(start.point,end.point);
				},
				
				_eventHandler: function(callback,eventName) {
					var me = this;
		        	return function(e){
		    			var _event = {};
		    			e ? _event.mapEvent = e : e = {};
		    			_event.type = eventName;
		    			e.point && (_event.point = new Point(e.point));
		    			e.pixel && (_event.pixel = new Pixel(e.pixel));
		    			var res = callback.call(me,_event)
		    			if(e.domEvent && typeof res == 'boolean' && !res) {
		    				e.domEvent.stopPropagation();
		    			}
		        	}
				},
				
				
				_doCenterChange: function() {
					var me = this;
					if (me._centerChangeTimer){
						return;
					}
					var lastCenter = me.getCenter();
					me._centerChangeTimer = setInterval(function() {
						if(!lastCenter.equals(me.getCenter())){
							me.map.dispatchEvent('centerchanged');
							lastCenter = me.getCenter();
						}
					}, 100);
				},
				_afterBoundsChange: function() {
					var me = this;
					me.map.addEventListener('zoomend',function() {
						me.map.dispatchEvent('boundschanged');
					});
					
					me.map.addEventListener('moveend',function() {
						me.map.dispatchEvent('boundschanged');
					});
				},
				
				_isMapLoaded: function() {
					this.map.addEventListener('tilesloaded',function handler() {
						this.dispatchEvent('maploaded');
						this.removeEventListener('tilesloaded',handler);
					});
				},
				
				//加载控件
				_addControl:function (controls){
					for(var i = 0; i < controls.length; i++){
						this.map.addControl(controls[i].$control);

					}
				},
				
				/**
				 * 注册事件
				 * @param {String} eventName 事件名称
				 * @param {function} callback 回调函数
				 */
				addListener: function(eventName,callback){
					
					var me = this;
					var event = 'click dblclick maptypechange mousemove zoomend '
						+'dragstart dragging dragend resize centerchanged boundschanged maploaded'.split(' ');
					if((event.indexOf(eventName)>-1 && typeof(callback)==='function')){
						var handler = me._eventHandler(callback,eventName);
						me.map.addEventListener(eventName,handler);
						return {type:eventName,handler:handler}
					}
				},
				/**
				 * 销毁事件
				 */
				removeListener: function(mapsEventListener){
					this.map.removeEventListener(mapsEventListener.type,mapsEventListener.handler);
				},
				
				/**
				 * 派发事件
				 */
				dispatch: function(type) {
					this.map.dispatchEvent(type);
				}
				
		}
		
		function MapType(name,opts) {
			if (name instanceof BMap.MapType) {
				this.mapType = name;
				this.tileLayer = this.mapType.getTileLayer();
				this._name = this.mapType.getName();
			}else {
				this._name = name;
				this.tileLayer = new BMap.TileLayer({transparentPng:true});
				var _opts = {
						minZoom: opts.minZoom?opts.minZoom:3,
						maxZoom: opts.maxZoom?opts.maxZoom:19
				}
				this.mapType = new BMap.MapType(name,this.tileLayer,_opts); 
				_opts = null;
				
			}
		}
		
		MapType.prototype = {
				constructor: MapType,
				/**
				 * 设置瓦片图片地址
				 * @param url 瓦片地图地址 eg：'/scgis/satellite?'
				 */
				setTilesUrl: function(url){
					this.tileLayer.getTilesUrl = function(tileCoord, zoom) {
						var x = tileCoord.x;
						var y = tileCoord.y; 
						return url+'?zoom='+zoom+'&x='+x+'&y='+y;
					};
				},
				
				getName: function() {
					return this._name;
				},
				
				getMinZoom: function() {
					return this.mapType.getMinZoom();
				},
				
				getMaxZoom: function() {
					return this.mapType.getMaxZoom();
				}
		}
		

        /**
         * 所有覆盖物类的父类
         * @class
         */
        function Overlay(){

        }

		//覆盖物类
		function Icon(url,size,offset) {
            if (url instanceof BMap.Icon){
                this.overlay = url;
            } else {
                var anchor = offset || new Size(Math.floor(size.width / 2),size.height);
                this.overlay = new BMap.Icon(url,size.size,{anchor: anchor});
            }

		}
        Icon.prototype = new Overlay();
        
        Icon.prototype.constructor = Icon;
        /**
         * 设置图片地址
         * @param {String} url
         */
		Icon.prototype.setUrl = function(url) {
            this.overlay.setImageUrl(url);
        }
        /**
         * 设置图片大小
         * @param {Size} size 
         */
        Icon.prototype.setSize = function(size) {
            this.overlay.setSize(size.size);
        }
        /**
         * 设置偏移量
         * @param {Size} anchor
         */
        Icon.prototype.setOffset = function(offset) {
            this.overlay.setAnchor(offset.size);
        }
        /**
         * 获取url
         */
        Icon.prototype.getUrl = function() {
            return this.overlay.imageUrl;
        }
        /**
         * 获取图片大小
         */
        Icon.prototype.getSize = function() {
            return new Size(this.overlay.size);
        }
        /**
         * 获取图标偏移量
         */
        Icon.prototype.getOffset = function() {
            return new Size(this.overlay.anchor);
        }
        
		/**
		 * 地图上的标注
		 * 
		 * @param {Point} point 坐标点
		 * @param {} markerOptions 定义标注参数 
		 */
		function Marker(point,opt) {
			
            if (point instanceof BMap.Marker) {
            	
                this.overlay = point;
                
            } else {
            	opt || (opt = {});
                var _opt = {
        			enableDragging:  !!opt.enableDragging,
                };
            	opt.icon && (_opt.icon = opt.icon.overlay);
                this.overlay = new BMap.Marker(point.point,_opt);
                _opt = null;
                opt.label && (this._label = opt.label , this.overlay.setLabel(opt.label.overlay));

				opt.shadow = '';
            }
        }
		
        Marker.prototype = new Overlay();
        
        Marker.prototype.constructor = Marker;

        /**
         * 打开信息窗口
         * @param {InfoWindow} infoWindow
         */
        Marker.prototype.openInfoWindow = function(infoWindow) {
            this.overlay.openInfoWindow(infoWindow.overlay);
        }

        /**
         * 关闭信息窗口
         */
        Marker.prototype.closeInfoWindow = function() {
            this.overlay.closeInfoWindow();
        }

        /**
         * 获取标注位置
         */
        Marker.prototype.getPosition = function() {
            return new Point(this.overlay.getPosition());
        }

        /**
         * 设置标注位置
         * @param {Point} point
         */
        Marker.prototype.setPosition = function(point) {
            this.overlay.setPosition(point.point);
        }

        /**
         * 获取标签
         */
        Marker.prototype.getLabel = function() {
            return this._label;
        }

        /**
         * 设置标签
         * @param {Label} label
         */
        Marker.prototype.setLabel = function(label) {
        	this._label = label;
            this.overlay.setLabel(label.overlay);
        }

        /**
         * 设置叠加优先级
         * @param {Number} index
         */
        Marker.prototype.setZIndex = function(index) {
            this.overlay.setZIndex(index);
        }

        /**
         * 可以拖拽
         */
        Marker.prototype.enableDragging = function() {
            this.overlay.enableDragging();
        }

        /**
         * 不能拖拽
         */
        Marker.prototype.disableDragging = function() {
            this.overlay.disableDragging();
        }

        /**
         * 设置图标
         * @param {Icon} icon
         */
        Marker.prototype.setIcon = function(icon) {
            this.overlay.setIcon(icon.overlay);
        }

        /**
         * 获取标签
         */
        Marker.prototype.getIcon = function() {
            return new Icon(this.overlay.getIcon());
        }
        
        /**
         * 封装事件处理函数
         * @param callback
         * @returns {Function}
         */
        Marker.prototype._eventHandler = function(callback,eventName) {
        	var me = this;
        	return function(e){
    			var _event = {};
    			e ? _event.mapEvent = e : e = {};
    			_event.type = eventName;
    			e.point && (_event.point = new Point(e.point));
    			e.pixel && (_event.pixel = new Pixel(e.pixel));
    			var res = callback.call(me,_event)
    			if(e.domEvent && typeof res == 'boolean' && !res) {
    				e.domEvent.stopPropagation();
    			}
        	}
		}
        
        /**
         * 添加事件
         * @param eventName
         * @param callback
         */
        Marker.prototype.addListener = function(eventName,callback){
        	var me = this;
            var eventNames = 'click dblclick mousedown mouseup mouseout mouseover dragstart dragging dragend'.split(' ');
			if (eventNames.indexOf(eventName)>-1 && typeof(callback)==='function'){
				var handler = me._eventHandler(callback,eventName);
				me.overlay.addEventListener(eventName,handler);
				return {type:eventName,handler:handler}
			}
				

        }
        
        /**
         * 删除事件
         * @param mapsEventListener
         */
        Marker.prototype.removeListener = function(mapsEventListener) {
        	this.overlay.removeEventListener(mapsEventListener.type,mapsEventListener.handler);
        }
        
        
		/**
		 * 派发事件
		 */
        Marker.prototype.dispatch = function(type) {
			this.overlay.dispatchEvent(type);
		}
        
        /**
		 *s marker置顶。只支持百度
		 */
        Marker.prototype.setTop = function(Boolean) {
			this.overlay.setTop(Boolean);
		}
        
        
		/**
		 * 标签
		 */
		function Label(content,opts) {
			opts = opts || {};
            if (content instanceof BMap.Label) {
                this.overlay = content;
            } else {
	            var _opts = {}
	            opts.offset && (_opts.offset = opts.offset.size);
	            opts.position && (_opts.position = opts.position.point);
				this.overlay = new BMap.Label(content,_opts);
            }
		}
		
        Label.prototype = new Overlay();
        
        Label.prototype.setTitle = function(title){
        	this.overlay.setTitle(title);
        };
        
        Label.prototype.constructor = Label;

        /**
         * 设置css样式
         * @param {object} styles {fontSize: "16px"}
         */
        Label.prototype.setStyle = function(styles) {
            this.overlay.setStyle(styles);
        }
        /**
         * 设置标注的内容
         * @param {String} content
         */
        Label.prototype.setContent = function(content) {
            this.overlay.setContent(content);
        }

        /**
         * 设置偏移量
         * @param {Size} offset
         */
        Label.prototype.setOffset = function(offset) {
            this.overlay.setOffset(offset.size);
        }
        /**
         * 获取偏移量
         */
        Label.prototype.getOffset = function() {
            return this._offset;
        }
        /**
         * 设置地理位置
         * @param {Point} position
         */
        Label.prototype.setPosition = function(position) {
        	this.overlay.setPosition(position.point);
        }
        /**
         * 获取地理位置
         */
        Label.prototype.getPosition = function() {
            return new Point(this.overlay.getPosition());
        }
        /**
         * 显示标签
         */
        Label.prototype.show = function(index) {
        	this.overlay.show();
        }
        /**
         * 隐藏标签
         */
        Label.prototype.hide = function(index) {
        	this.overlay.hide();
        }
        /**
         * 设置叠放顺序
         * @param {Number} index
         */
        Label.prototype.setZIndex = function(index) {
            this.overlay.setZIndex(index);
        }


        /**
         * 几何图形类父类
         * @class
         */
        function Geometry(opt){
        	if (arguments.length == 0) {
            	return
            } else if (opt instanceof BMap.Overlay) {
            	this.overlay = opt;
            } else {
                this._opts = {
            		strokeColor: opt.strokeColor ? opt.strokeColor : '#333',
					strokeWeight: opt.strokeWeight ? opt.strokeWeight : 1,
					strokeOpacity: opt.strokeOpacity ? opt.strokeOpacity : 1,
                    strokeStyle: opt.strokeStyle ? opt.strokeStyle : 'solid',
                    enableEditing: opt.enableEditing ? opt.enableEditing : false
                }
            }
        }
        
		Geometry.prototype = new Overlay();

		Geometry.prototype.constructor = Geometry;
		Geometry.prototype.show = function() {
			this.overlay.show();
		};
		Geometry.prototype.hide = function() {
			this.overlay.hide();
		};
		
		 /**
         * 设置画笔颜色
         */
		Geometry.prototype.setStrokeColor = function(color) {
			this.overlay.setStrokeColor(color);
		}
		
		/**
         * 获取画笔颜色
         */
		Geometry.prototype.getStrokeColor = function() {
			return this.overlay.getStrokeColor();
		}
		
		/**
         * 设置画笔透明度
         */
		Geometry.prototype.setStrokeOpacity = function(opacity) {
			this.overlay.setStrokeOpacity(opacity);
		}
		
		/**
		 * 获取画笔透明度
		 */
		Geometry.prototype.getStrokeOpacity = function() {
			return this.overlay.getStrokeOpacity();
		}
		
		/**
		 * 设置画笔粗度
		 */
		Geometry.prototype.setStrokeWeight = function(weight) {
			this.overlay.setStrokeWeight(weight);
		}
		
		/**
		 * 获取画笔粗度
		 */
		Geometry.prototype.getStrokeWeight = function() {
			return this.overlay.getStrokeWeight();
		}
		
		/**
		 * 设置画笔格式
		 */
		Geometry.prototype.setStrokeStyle = function(style) {
			this.overlay.setStrokeStyle(style);
		}
		
		/**
		 * 获取画笔格式
		 */
		Geometry.prototype.getStrokeStyle = function() {
			return this.overlay.setStrokeStyle();
		}
		
		/**
		 * 开启编辑
		 */
		Geometry.prototype.enableEditing = function() {
			this.overlay.enableEditing();
		}
		
		/**
		 * 关闭编辑
		 */
		Geometry.prototype.disableEditing = function() {
			this.overlay.disableEditing();
		}
		/**
		 * 事件处理函数封装
		 * @param callback
		 * @returns {Function}
		 */
		Geometry.prototype._eventHandler = function(callback,eventName) {
			var me = this;
        	return function(e){
    			var _event = {};
    			e ? _event.mapEvent = e : e = {};
    			_event.type = eventName;
    			e.point && (_event.point = new Point(e.point));
    			e.pixel && (_event.pixel = new Pixel(e.pixel));
    			var res = callback.call(me,_event);
    			if(e.domEvent && typeof res == 'boolean' && !res) {
    				e.domEvent.stopPropagation();
    			}
        	};
		};
		
		/**
		 * 添加监听
		 */
		Geometry.prototype.addListener = function(eventName,callback) {
			var me = this;
			var event = 'click dblclick mousedown mouseup mouseout mouseover mousemove'.split(' ');
			if (event.indexOf(eventName)>-1 && typeof(callback)==='function') {
				var handler = me._eventHandler(callback,eventName);
				me.overlay.addEventListener(eventName,handler);
				return {type:eventName,handler:handler}
			}
		};
		
		/**
		 * 删除监听
		 */
		Geometry.prototype.removeListener = function(mapsEventListener) {
			this.overlay.removeEventListener(mapsEventListener.type,mapsEventListener.handler);
		};
		
		/**
		 * 派发
		 */
		Geometry.prototype.dispatch = function(type) {
			this.overlay.dispatchEvent(type);
		};

		/**
		 * 
		 */
		function Polyline(path,opt) {
			if (arguments.length == 0) {
                return;
            } else if (path instanceof BMap.Polyline) {
				Geometry.call(this,path);
            } else {
            	opt = opt || {};
				Geometry.call(this,opt);
				var temp = fnc.scmapToMapPath(path);
                this.overlay = new BMap.Polyline(temp,this._opts);
				temp = null;
				delete this._opts;
            }
		}
        Polyline.prototype = new Geometry();

        Polyline.prototype.constructor = Polyline;

		Polyline.prototype.setPath = function(path) {
			var temp = fnc.scmapToMapPath(path);
			this.overlay.setPath(temp);
			temp = null;
		};
		Polyline.prototype.getPath = function() {
			return fnc.mapToScmapPath(this.overlay.getPath());
		};
		
		Polyline.prototype.setPositionAt = function(index,point) {
            this.overlay.setPositionAt(index,point.point);
        };
		
		/**
		 * 
		 */
		function LineRing(path,opt) {
			path instanceof BMap.Polyline || path.push(path[0]);
			Polyline.call(this,path,opt);
		}

		LineRing.prototype = new Polyline();
		
        LineRing.prototype.constructor = LineRing;

		LineRing.prototype.setPath = function(path) {
			path.push(path[0]);
			var temp = fnc.scmapToMapPath(path);
			this.overlay.setPath(temp);
			temp = null;
		};
		
		LineRing.prototype.getPath = function(path) {
			return this.overlay.getPath().splice(-1,1);
		};
		
		LineRing.prototype.setPositionAt = function(index,point) {
            
            if (index >= this.overlay.getPath().length - 1) {
                this.overlay.setPath(this.overlay.getPath().splice(-1,0,point.point));
            } else {
            	this.overlay.setPositionAt(index,point.point);
            }
        }
		/**
		 * 
		 */
		function Polygon(path,opt) {
			if (path instanceof BMap.Polygon) {
				Geometry.call(this,path);
            }else {
            	opt = opt || {};
				Geometry.call(this,opt);
				this._opts.fillColor = opt.fillColor ? opt.fillColor : '#fff';
				this._opts.fillOpacity = opt.fillOpacity ? opt.fillOpacity : 0.8;

				var temp = fnc.scmapToMapPath(path);
                this.overlay = new BMap.Polygon(temp,this._opts);
				temp = null;
				delete this._opts;
            }
			
		}
		
		Polygon.prototype = new Polyline();
        
		Polygon.prototype.constructor = Polygon;


		Polygon.prototype.setFillColor = function(color) {
			this.overlay.setFillColor(color);
		}
		
		Polygon.prototype.getFillColor = function() {
			return this.overlay.getFillColor();
		}
		
		Polygon.prototype.setFillOpacity = function(opacity) {
			this.overlay.setFillOpacity(opacity);
		};
		
		Polygon.prototype.getFillOpacity = function() {
			return this.overlay.getFillOpacity();
		};


		function Circle(center,radius,opt) {
			if (center instanceof BMap.Circle) {
				Geometry.call(this,center);
				this.overlay = center;
            }else {
            	opt = opt || {};
				Geometry.call(this,opt);
				this._opts.fillColor = opt.fillColor ? opt.fillColor : '#fff';
				this._opts.fillOpacity = opt.fillOpacity ? opt.fillOpacity : 0.8;
                this.overlay = new BMap.Circle(center.point,radius,this._opts);
                delete this._opts;
            }
			
		}
        Circle.prototype = new Geometry();
        
        Circle.prototype.constructor = Circle;
        
        Circle.prototype.getBounds = function() {
        	return new Bounds(this.overlay.getBounds());
        }

		Circle.prototype.getCenter = function(){
			return new Point(this.overlay.getCenter());
		};
		Circle.prototype.setRadius = function(radius){
			this.overlay.setRadius(radius);
		};
		Circle.prototype.getRadius = function(){
			return this.overlay.getRadius();
		};
		Circle.prototype.setFillColor = function(color) {
			this.overlay.setFillColor(color);
		};
		
		Circle.prototype.getFillColor = function() {
			return this.overlay.getFillColor();
		};
		
		Circle.prototype.setFillOpacity = function(opacity) {
			this.overlay.setFillOpacity(opacity);
		};
		
		Circle.prototype.getFillOpacity = function() {
			return this.overlay.getFillOpacity();
		};

		/**
		 * 信息框
		 */
		function InfoWindow(content,opt) {
			if (content instanceof BMap.InfoWindow) {
				this.overlay = content;
			} else {
				opt = opt || {};
				var _opts = {
						enableAutoPan: opt.enableAutoPan ? opt.enableAutoPan : true,
						enableCloseOnClick: false,
						enableMessage: false
				}
				opt.offset && (_opts.offset = opt.offset.size);
				this.overlay = new BMap.InfoWindow(content,_opts);
				_opts = null;
			}
		}
		
		InfoWindow.prototype = new Overlay();
		
		InfoWindow.prototype.constructor = InfoWindow;
		
		InfoWindow.prototype.setContent = function(content){
			this.overlay.setContent(content);
		};
		
		InfoWindow.prototype.getContent = function(){
			return this.overlay.getContent();
		};
		
		InfoWindow.prototype.getPosition = function(){
			return new Point(this.overlay.getPosition());
		};
		
		InfoWindow.prototype.enableAutoPan = function(){
			this.overlay.enableAutoPan();
		};
		
		InfoWindow.prototype.disableAutoPan = function(){
			this.overlay.disableAutoPan();
		};
		
		InfoWindow.prototype._eventHandler = function(callback,eventName) {
        	var me = this;
        	return function(e){
    			var _event = {};
    			e ? _event.mapEvent = e : e = {};
    			_event.type = eventName;
    			e.point && (_event.point = new Point(e.point));
    			e.pixel && (_event.pixel = new Pixel(e.pixel));
    			var res = callback.call(me,_event)
    			if(e.domEvent && typeof res == 'boolean' && !res) {
    				e.domEvent.stopPropagation();
    			}
        	};
		};
		
		/**
		 * 添加监听
		 */
		InfoWindow.prototype.addListener = function(eventName,callback) {
			var me = this;
			var event = 'open close'.split(' ');
			if (event.indexOf(eventName)>-1 && typeof(callback)==='function') {
				var handler = me._eventHandler(callback,eventName);
				me.overlay.addEventListener(eventName,handler);
				return {type:eventName,handler:handler}
			}
		};
		
		/**
		 * 删除监听
		 */
		InfoWindow.prototype.removeListener = function(mapsEventListener) {
			this.overlay.removeEventListener(mapsEventListener.type,mapsEventListener.handler);
		};
		
		/**
		 * 派发
		 */
		InfoWindow.prototype.dispatch = function(type) {
			this.overlay.dispatchEvent(type);
		};
		
		 
		/**
		 * 控件
		 */
		
		/**
		 * 平移缩放控件（鱼骨）
		 */
		function PanzoomControl(){
			this.$control = new BMap.NavigationControl({"anchor":BMAP_ANCHOR_BOTTOM_LEFT});
		}
		
		/**
		 * 比例尺控件
		 */
		
		function ScaleControl(){
			this.$control = new BMap.ScaleControl();
		}
		
		/**
		 * 鹰眼控件
		 */
		function OverviewMapControl(opts){
			var _opts = {
					isOpen:true
			};
			
			if(opts){
	            opts.offset && (_opts.offset = opts.offset.size);
			}
			
			this.$control = new BMap.OverviewMapControl(_opts);
		}
		
		//生成函数
		this.createPoint = function(lng,lat) {
			return new Point(lng, lat);
		};
		this.createPixel = function(x,y) {
			return new Pixel(x,y);
		};
		this.createBounds = function(nw,se) {
			return new Bounds(nw, se);
		};
		this.createSize = function(width,height) {
			return new Size(width,height);
		};
		this.createMap = function(div,opt) {
			return new Map(div, opt);
		};
		this.createMapType = function(name,layer,opts) {
			return new MapType(name, layer, opts);
		};
		this.createIcon = function(url, size, offset) {
			return new Icon(url, size, offset);
		};
		this.createMarker = function(point, opt) {
			return new Marker(point, opt);
		};
		this.createLabel = function(content, offset) {
			return new Label(content, offset);
		};
		this.createPolyline = function(path,opt) {
			return new Polyline(path, opt);
		};
		this.createLineRing = function(path, opt) {
			return new LineRing(path, opt);
		};
		this.createPolygon = function(path, opt) {
			return new Polygon(path, opt);
		};
		this.createCircle = function(center, radius, opt) {
			return new Circle(center, radius, opt);
		};

		this.createInfoWindow = function(content, opt) {
			return new InfoWindow(content, opt);
		};
		
		this.createScaleControl = function (){
			return new ScaleControl();
		};
		this.createOverviewMapControl = function (opts){
			return new OverviewMapControl();
		};
		this.createPanzoomControl = function (opts){
			return new PanzoomControl();
		};
		
		this.extendOverlay = function(Constructor,add,draw) {
			Constructor.prototype = new BMap.Overlay();
			Constructor.prototype.initialize = function(map) {
				return add.call(this,map.__parent__);
			}
			Constructor.prototype.draw = draw;

		};
	}
	
	
	
	


	/**
	 * 谷歌地图对象
	 * @class
	 */
	function GoogleMap() {
		//基础类
		
		/**
		 * 坐标点
		 * 
		 * @param {Number} lng 经度
		 * @param {Number} lat 维度
		 * @param {BMap.Point} point 谷歌源生类
		 * @class
		 */
		function Point(lng,lat) {
			if (typeof lng === 'object') {
				this.point = lng;
				this.lng = this.point.lng();
				this.lat = this.point.lat();
			} else {
				this.lng = lng;
				this.lat = lat;
				this.point = new google.maps.LatLng(this.lat,this.lng);
			}
		}
		
		Point.prototype = {
			equals: function(other) {
				return this.lng === other.lng&&this.lat === other.lat;
			}
		}
		
		/**
		 * 像素点，坐标原点在地图窗口的左上角
		 * 
		 * @param {Number} x
		 * @param {Number} y
		 * @param {BMap.Pixel} pixel 谷歌源生类
		 * @class
		 */
		function Pixel(x,y) {
			
			if (typeof x === 'object') {
				this.pixel = x;
				this.x = this.pixel.x
				this.y = this.pixel.y
			} else {
				this.x = x;
				this.y = y;
				this.pixel = new google.maps.Point(x,y);
			}
						
		}
		
		Pixel.prototype = {
				equals: function(other) {
					return this.x === other.x&&this.y === other.y;
				}
		}
		
		/**
		 * 矩形边界范围
		 * 
		 * @param {Point} ne 区域的东北角
		 * @param {Point} sw 区域的西南角
		 * @param {BMap.Bounds} bounds 谷歌源生类
		 * @class
		 */
		function Bounds(sw,ne) {
			if (sw instanceof google.maps.LatLngBounds) {
				this.bounds = sw;
				sw = new Point(this.bounds.getSouthWest());
				ne = new Point(this.bounds.getNorthEast());
			} else {
				if(ne.lng < sw.lng || ne.lat<sw.lat){
					throw new Error("Point is error");
				}
				this.bounds = new google.maps.LatLngBounds(sw.point,ne.point);
			}
			this.minX = sw.lat;
			this.minY = sw.lng;
			this.maxX = ne.lat;
			this.maxY = ne.lng;
			
		}
		
		Bounds.prototype = {
				equals: function(other) {
					return this.bounds.equals(other.bounds);
				},
				containsPoint: function(point) {
					return  this.bounds.contains(point.point);
				},
				containsBounds: function(bounds) {
					return this.minX <= bounds.minX && this.maxX >= bounds.maxX && this.minY <= bounds.minY && this.maxY >= bounds.maxY;
				},
				intersects: function(other) {
					return this.bouns.intersects(other.bounds);
				},
				extend: function(point) {
					this.bounds.extend(point.point);
					var sw = this.bounds.getSouthWest();
					var ne = this.bounds.getNorthEast();
					this.minX = sw.lat();
					this.minY = sw.lng();
					this.maxX = ne.lat();
					this.maxY = ne.lng();
				},
				getCenter: function() {
					return new Point(this.bounds.getCenter());
				},
				getNorthEast: function() {
					return new Point(this.bounds.getNorthEast());
				},
				getSouthWest: function() {
					return new Point(this.bounds.getSouthWest());
				}
		}
		
		/**
		 * 像素坐标表示的矩形大小
		 * 
		 * @param {Number} width 宽
		 * @param {Number} height 高
		 * @class
		 */
		function Size(width,height) {
			if (typeof width === 'object') {
				this.size = width;
				this.width = this.size.width;
				this.height = this.size.height;
			} else {
				this.width = width;
				this.height = height;
				this.size = new google.maps.Size(width,height);
			}
		}
		
		Size.prototype = {
				equals: function(other) {
					return this.width === other.width&&this.height === other.height;
				}
		}
		
		//地图类
		/**
		 * 地图对象
		 * 
		 * @param {String} div 放置地图对象的容器id
		 * @param {Object} opt 地图设置属性
		 * 		<li>minZoom: 最小缩放级别
		 * 		<li>maxZoom: 最大缩放级别
		 * 		<li>mapType: 地图显示类型
		 * 		<li>controls: 地图控件
		 * @class
		 */
		function Map(div,opt) {
			var me = this;
			me.__eventNames = {
					click: 'click',
					dblclick: 'dbclick', 
					maptypechange: 'maptypeid_changed',
					mousemove: 'mousemove',
					zoomend: 'zoom_changed',
					dragstart: 'dragstart',
					dragging: 'drag',
					dragend: 'dragend',
					resize: 'resize',
					centerchanged: 'center_changed',
					boundschanged: 'boundschanged',
					maploaded: 'maploaded'
			}
			me._div = $('#'+div)[0];
			me._overlays = new Array();
			me._minZoom = opt.minZoom ? opt.minZoom : 3;
			me._maxZoom = opt.maxZoom ? opt.maxZoom : 19;
			me._initCenter = null;
			me._initZoom = null;
			
			var initOpts = {
					minZoom: me._minZoom,
					maxZoom: me._maxZoom,
					disableDefaultUI: true,
			};
			
			if(opt.controls){
				for(var i = 0; i<opt.controls.length; i++){
					initOpts[opt.controls[i].type] = true;
					initOpts[opt.controls[i].type + "Options"] = opt.controls[i].options;
				}
				if(initOpts.panControl){
					initOpts.zoomControl = true;
				}
			}
			
			me.map = new google.maps.Map(me._div,initOpts);
			me.map._infoWindows = new Array();
			
			var _mapType = opt.mapType ? opt.mapType : Enum.mapType.NORMAL_MAP;
			if (typeof _mapType === 'string'){
				me.map.setMapTypeId(_mapType);
			} else {
				me.map.mapTypes.set(_mapType._name,_mapType.mapType);
				me.map.setMapTypeId(_mapType._name);
			}
			_mapType = null;
			
			//投影
			var project = new google.maps.OverlayView();
			project.onAdd = function(){
				me._project = this.getProjection();
				var tempPan = this.getPanes();
				me._mapPans = {
						floatPane: tempPan.floatPane,
						markerMouseTarget: tempPan.overlayMouseTarget,
						floatShadow: tempPan.floatShadow,
						markerPane: tempPan.overlayImage,
						markerShadow: tempPan.overlayShadow,
						mapPane: tempPan.overlayLayer,
				}
			};
			project.onRemove = function(){};
			project.draw = function(){};
			project.setMap(me.map);
			
			me.map.__parent__ = this;
			
			me._doResize();
			me._afterBoundsChange();
			me._isMapLoaded();
		}
			
		Map.prototype = {
				
				constructor:Map,
				
				
				
				/**
				 * 获取地图缩放最小级别
				 */
				getMinZoom: function() {
					return this._minZoom;
				},
				/**
				 * 获取地图缩放最大级别
				 */
				getMaxZoom: function() {
					return this._maxZoom;
				},
				
				
				
				/**
				 * 设置地图缩放最小级别，不得小于地图类型的最小级别
				 */
				setMinZoom: function(num) {
					this.map.setOptions({minZoom: num});
					this._minZoom = num;
				},
				/**
				 * 设置地图缩放最大级别，不得大于地图类型的最大级别
				 */
				setMaxZoom: function(num) {
					this.map.setOptions({maxZoom: num});
					this._maxZoom = num;
				},
				/**
				 * 改变鼠标样式
				 * 
				 */
				setDefaultCursor: function(css) {
					this.map.setOptions({draggableCursor:css});
				},
				/**
				 * 开启滚轮
				 */
				enableScrollWheelZoom: function() {
					if (!fnc.isIE) {
						return;
					}
					var flage =true;
					var me = this;
					this._div.onmousewheel = function(e){
						if(flage){
							if(e.wheelDelta>0){
								me.map.setZoom(me.map.getZoom()+1);
							}else{
								me.map.setZoom(me.map.getZoom()-1);
							}
							flage = false;
							setTimeout(function(){
								flage = true;
							}, 400);
						}
					}
				},
				/**
				 * 关闭滚轮
				 */
				disableScrollWheelZoom: function() {
					this._div.onmousewheel = null;
				},
				/**
				 * 获取当前视野的边界
				 * @return {Bounds}
				 */
				getBounds: function() {
					return new Bounds(this.map.getBounds());
				},
				/**
				 * 获取中心点
				 * @returns {Point}
				 */
				getCenter: function() {
					return new Point(this.map.getCenter());
				},
				/**
				 * 获取当前视野的大小，单位像素
				 * @returns {Size}
				 */
				getSize: function() {
					var $div = $(this._div);
					if($div.is(':hidden')){
						return new Size(0,0);
					}
					return new Size($div.width(),$div.height());
				},
				/**
				 * 返回当前地图的缩放级别
				 * @returns {Number}
				 */
				getZoom: function() {
					return this.map.getZoom();
				},
				/**
				 * 返回当前地图的地图类型
				 * @returns {MapType}
				 */
				getMapType: function() {
					return new MapType(this.map.mapTypes[this.map.getMapTypeId()]);
				},
				/**
				 * 设置地图中心点和缩放级别，初始化地图
				 * @param {Point} point 中心点经纬度
				 * @param {Number} zoom 缩放级别
				 */
				centerAndZoom: function(point,zoom) {
					this.setCenter(point);
					this.setZoom(zoom);
					this._initCenter = point;
					this._initZoom = zoom;
				},
				/**
				 * 移动地图
				 * @param {Point} point 地图移动到该点
				 */
				panTo: function(point) {
					this.map.panTo(point.point);
				},
				/**
				 * 移动地图
				 * @param {Number} x x轴方向
				 * @param {Number} y y轴方向
				 */
				panBy: function(x,y) {
					this.map.panBy(x,y);
				},
				/**
				 * 重置地图
				 */
				reset: function() {
					this.centerAndZoom(this._initCenter, this._initZoom);
				},
				/**
				 * 设置地图中心点
				 * @param {Point} point 中心点坐标
				 */
				setCenter: function(point) {
					this.map.setCenter(point.point);
				},
				/**
				 * 设置地图类型
				 * @param {MapType} mapType 地图类型
				 */
				setMapType: function(mapType) {
					if (typeof mapType === 'string'){
						this.map.setMapTypeId(mapType);
						return;
					}
					this.map.mapTypes.set(mapType._name,mapType.mapType);
					this.map.setMapTypeId(mapType._name);
				},
				/**
				 * 设置地图缩放级别
				 * @param {Number} zoom 缩放级别
				 */
				setZoom: function(zoom) {
					this.map.setZoom(zoom);
				},
				/**
				 * 添加覆盖物
				 * @param {Overlay} overlay
				 *
				 */
				addOverlay: function(overlay) {
					if(!overlay || overlay.overlay.getMap()) {
						return;
					}
					overlay.overlay.setMap(this.map);
					overlay.overlay._label && overlay.overlay._label.setMap(this.map);
					this._overlays.push(overlay);
				},
				/**
				 * 添加一组覆盖物
				 * @param {Array<Overlay>} overlays 覆盖物组
				 */
				addOverlays: function(overlays) {
					var me = this;
					if (!overlays) {
						return;
					}
					$.each(overlays,function(i,overlay){
						me.addOverlay(overlay);
					});
				},
				
				/**
				 * 在固定点，打开信息窗口
				 * @param {InfoWindow} infoWindow 信息窗口
				 * @param {Point} point 经纬度
				 */
				openInfoWindow: function(infoWindow,point) {
					infoWindow.overlay.setPosition(point.point);
					infoWindow._open(this.map);
					this.map._infoWindows.push(infoWindow);
				},
				/**
				 * 移除覆盖物
				 * @param {Overlay} overlay 覆盖物
				 */
				removeOverlay: function(overlay) {
					overlay.overlay.setMap(null);
					overlay.overlay._label && overlay.overlay._label.setMap(null);
					var index = this._overlays.indexOf(overlay);
					this._overlays.splice(index,1);
				},
				/**
				 * 清除所有覆盖物
				 */
				clearOverlays: function() {
					var me = this;
					$.each(me._overlays,function(i,overlay){
						overlay.overlay.setMap(null);
						overlay._label && overlay._label.setMap(null);
					});
					this._overlays = [];
					this.closeInfoWindow();
				}, 
				/**
				 * 关闭打开的信息窗口
				 */
				closeInfoWindow: function() {
					
					$.each(this.map._infoWindows,function(i,infoWindow){
						infoWindow._close();
					});
					this.map._infoWindows = [];
				},
				/**
				 * 获取地图容器
				 * @returns {DOMObject}
				 */
				getContainer: function() {
					return this._div;
				},
				/**
				 * 获取地图上打开的信息窗口
				 * @return {InfoWindow}
				 */
				getInfoWindow: function() {
					return this.map._infoWindows;
				},
				/**
				 * 获取地图上所有覆盖物
				 * @returns {Array<Overlay>}
				 */
				getOverlays: function() {
					return this._overlays;
				},
				/**
				 * 获取地图容器
				 * @returns {Array<DOMObject>}  
				 */
				getPanes: function() {
					return this._mapPans;
				},  
				/**
				 * 像素转经纬度
				 * @param {Pixel} pixel 像素坐标
				 * @returns {Point}
				 */
				pixelToPoint: function(pixel) {
					return new Point(this._project.fromContainerPixelToLatLng(pixel.pixel));
				},
				/**
				 * 经纬度转像素
				 * @param {Point} point 经纬度坐标
				 * @returns {Pixel}
				 */
				pointToPixel: function(point) {
					return new Pixel(this._project.fromLatLngToContainerPixel(point.point));
				},
				/**
				 * 经纬度转像素【坐标原点是地图的中心点】
				 * @param {Point} point 经纬度坐标
				 * @returns {Pixel}
				 */
				pointToOverlayPixel: function(point) {
					return new Pixel(this._project.fromLatLngToDivPixel(point.point));
				},
				/**
				 * 两点间距离
				 * @param {Point} start 起始点经纬度
				 * @param {Point} end 借宿点经纬度
				 * @returns {Number}
				 */
				//d(x1,y1,x2,y2)=r*arccos(sin(x1)*sin(x2)+cos(x1)*cos(x2)*cos(y2-y1))
				getDistance: function(start,end) {
					var lat = [Math.PI/180*start.lat, Math.PI/180*end.lat];
					var lng = [Math.PI/180*start.lng, Math.PI/180*end.lng];
					var R = 6378137;
					var x = Math.acos(Math.sin(lat[0]) * Math.sin(lat[1]) + Math.cos(lat[0]) * Math.cos(lat[1]) *Math.cos(lng[1]-lng[0]))
					var d = R * x;
					return Math.round(d);
				},
				/**
				 * 注册事件
				 * @param {String} eventName 事件名称
				 * @param {function} callback 回调函数
				 */ 
				_doResize: function() {
					var me = this;
					var lastSize = me.getSize();
					setInterval(function(){
						if (!lastSize.equals(me.getSize())) {
							google.maps.event.trigger(me.map, 'resize');
							lastSize = me.getSize();
						}
					},80)
				},
				
				_afterBoundsChange: function() {
					var me = this;
					var isActive = false,isFree = true;
					google.maps.event.addListener(me.map,'bounds_changed',function(e) {
						isActive = true;
						if (!isFree) {
							return
						}
						isFree = false;
						var count = 0;
						var timer = setInterval(function(){
							if(isActive) {
								count = 0;
								isActive = false;
							} else {
								if(++count > 3) {
									google.maps.event.trigger(me.map,'boundschanged');
									isFree = true
									window.clearInterval(timer);
								}
							}
						},100);
					});
				},
				
				_isMapLoaded: function() {
					google.maps.event.addListenerOnce(this.map,'idle',function(e) {
						google.maps.event.trigger(this,'maploaded');
					});
				},
					
				addListener: function(eventName,callback){
					var me = this;

					
					if(( !!me.__eventNames[eventName] && typeof(callback)==='function')){
						return google.maps.event.addListener(me.map,me.__eventNames[eventName],function(e){
							var _event = {};
							e ? _event.mapEvent = e : e = {};
							_event.type = me.__eventNames[eventName];
							e.latLng && (_event.point = new Point(e.latLng));
							e.pixel && (_event.pixel = new Pixel(e.pixel));
							
							if(me.__eventNames[eventName] === 'resize'){
								_event.size = me.getSize();								
							}
							callback.call(me,_event);
						});
						
					}   
					
				},
				removeListener: function(mapsEventListener) {
		        	google.maps.event.removeListener(mapsEventListener);
		        },
		        dispatch: function(type) {
		        	google.maps.event.trigger(this.map,this.__eventNames[type]);
		        }
		}
		
		
		function MapType(name,opts){
			if (typeof name === 'object') {
				this.maptype = name;
				this._name = this.maptype.name;
				return;
			} 
			this._name = name;
			function _MapType(){};
			_MapType.prototype.tileSize = new google.maps.Size(256, 256);
			_MapType.prototype.maxZoom = opts.maxZoom ? opts.maxZoom : 18;
			_MapType.prototype.minZoom = opts.minZoom ? opts.minZoom : 2;
			_MapType.prototype.name = name;
			_MapType.prototype.alt = "显示地图";
			this.mapType = new _MapType();
		}
		
		MapType.prototype = {
				constructor: MapType,
				/**
				 * 设置瓦片图片地址
				 * @param url 瓦片地图地址 eg：'/scgis/satellite?'
				 */
				setTilesUrl: function(url){
					this.mapType.getTile = function(coord, zoom, ownerDocument){
						var img = ownerDocument.createElement("img");
					  	img.style.width = this.tileSize.width + "px";
					  	img.style.height = this.tileSize.height + "px";
					  	img.src = url+ 'level=' + zoom + '&col=' + coord.x + '&row=' + coord.y ;
					  	return img;
					};
				},
				
				getName: function() {
					return this._name;
				},
				
				getMinZoom: function() {
					return this.mapType.minZoom;
				},
				
				getMaxZoom: function() {
					return this.mapType.maxZoom;
				}
		}
 

		//覆盖物类 
		//TODO setSize
		function Icon(url,size,offset) {
            if (typeof url === 'object') {
                this.overlay = url;
            } else {
            	
            	this.overlay = new google.maps.MarkerImage(url,
            			size ? size.size: null,
            			null,
            			offset ? new Pixel(offset.width, offset.height).pixel:new Pixel(Math.floor(size.width / 2), size.height));
            }
		}
        /**
         * 设置图片地址
         * @param {String} url
         */
		Icon.prototype.setUrl = function(url) {
            this.overlay.url = url;
        }
        /**
         * 设置图片大小
         * @param {Size} size 
         */
        Icon.prototype.setSize = function(size) {
            this.overlay.size = size.size;
            
        }
        /**
         * 设置偏移量
         * @param {Size} anchor
         */
        Icon.prototype.setOffset = function(offset) {
            this.overlay.anchor = new Pixel(offset.width, offset.height).pixel;
        }
        /**
         * 获取url
         */
        Icon.prototype.getUrl = function() {
            return this.overlay.url;
        }
        /**
         * 获取图片大小
         */
        Icon.prototype.getSize = function() {
            return new Size(this.overlay.size);
        }
        /**
         * 获取图标偏移量
         */
        Icon.prototype.getOffset = function() {
            return new Size(this.overlay.anchor.x,this.overlay.anchor.y);
        }
        
		/**
		 * 地图上的标注 
		 * 
		 * @param {Point} point 坐标点
		 * @param {} markerOptions 定义标注参数 
		 */
		function Marker(point,opt) {
			
        	this.__eventNames = {
					click: 'click',
					dblclick: 'dbclick',
					mousedown: 'mousedown',
					mouseup: 'mouseup',
					mouseout: 'mouseout',
					mouseover: 'mouseover',
					dragstart: 'dragstart',
					dragging: 'drag',
					dragend: 'dragend',
						
			}
			
			
			if (point instanceof google.maps.Marker) {
				this.overlay = point;
			} else {
				opt || (opt = {});
                var _opt = {
                        draggable: !!opt.enableDragging,
                        position: point.point
                };
                
                opt.icon && (_opt.icon = opt.icon.overlay);
            	
                this.overlay = new google.maps.Marker(_opt);
                
            	opt.label && (this.overlay._label = opt.label,this.overlay._label.setPosition(point),this.overlay._label.setMap(null));
            	
                _opt = null;
			}
			this._event();
        }
        /**
         * 打开信息窗口
         * @param {InfoWindow} infoWindow
         */
        Marker.prototype.openInfoWindow = function(infoWindow) {
        	infoWindow.overlay.setPosition(this.overlay.getPosition());
			infoWindow._open(this.overlay.getMap());
			this.overlay._infoWindow = infoWindow;
			this.overlay.getMap()._infoWindows.push(infoWindow);
        }

        /**
         * 关闭信息窗口
         */
        Marker.prototype.closeInfoWindow = function() {
        	this.overlay._infoWindow._close();
        	
        	var index = this.overlay.getMap()._infoWindows.indexOf(this.overlay._infoWindow);
        	this.overlay.getMap()._infoWindows.splice(index,1);
        }

        /**
         * 获取标注位置
         */
        Marker.prototype.getPosition = function() {
            return new Point(this.overlay.getPosition());
        }
        /**
		 *s marker置顶。
		 */
        Marker.prototype.setTop = function(Boolean) {
			Boolean?this.overlay.setZIndex(999):this.overlay.setZIndex(0);
		}

        /**
         * 设置标注位置
         * @param {Point} point
         */
        Marker.prototype.setPosition = function(point) {
            this.overlay.setPosition(point.point);
            this.overlay._label && this.overlay._label.setPosition(point);
        }

        /**
         * 获取标签
         */
        Marker.prototype.getLabel = function() {
            return this.overlay._label;
        }

		/**
		 *s marker置顶。
		 */
        Marker.prototype.setTop = function(Boolean) {
			Boolean?this.overlay.setZIndex(999):this.overlay.setZIndex(0);
		}

        /**
         * 设置标签
         * @param {Label} label
         */
        Marker.prototype.setLabel = function(label) {
            this.overlay._label = label;
            this.overlay._label.setPosition(new Point(this.overlay.getPosition()));
            this.overlay._label.setMap(this.overlay.getMap());
        }

        /**
         * 设置叠加优先级
         * @param {Number} index
         */
        Marker.prototype.setZIndex = function(index) {
            this.overlay.setZIndex(index);
        }

        /**
         * 可以拖拽
         */
        Marker.prototype.enableDragging = function() {
            this.overlay.setDraggable(true);
        }

        /**
         * 不能拖拽
         */
        Marker.prototype.disableDragging = function() {
        	this.overlay.setDraggable(false);
        }

        /**
         * 设置图标
         * @param {Icon} icon
         */
        Marker.prototype.setIcon = function(icon) {
            this.overlay.setIcon(icon.overlay);
        }

        /**
         * 获取标签
         */
        Marker.prototype.getIcon = function() {
            return new Icon(this.overlay.getIcon());
        }
        
        Marker.prototype._event = function() {
        	var me = this;
        	google.maps.event.addListener(this.overlay,'drag',function(e) {
        		if (this._label) {
        			this._label.setPosition(new Point(e.latLng));
        		}
        	});
        	
        }
        /**
         * 注册事件
         */
        
        Marker.prototype.addListener = function(eventName,callback){
        	var me = this;

        	if (me.__eventNames[eventName] && typeof(callback)==='function') {
        		return google.maps.event.addListener(me.overlay,me.__eventNames[eventName],function(e){
        			
        			var _event = {};
					e ? _event.mapEvent = e : e = {};
					_event.type = me.__eventNames[eventName];
					e.latLng && (_event.point = new Point(e.latLng));
					e.pixel && (_event.pixel = new Pixel(e.pixel));
					callback.call(me,_event);
        		
        		});
        	}
        }
        
        /**
         * 删除事件
         */
        Marker.prototype.removeListener = function(mapsEventListener) {
        	google.maps.event.removeListener(mapsEventListener);
        }
        
        /**
         * 派发事件
         */
        Marker.prototype.dispatch = function(type) {
        	google.maps.event.trigger(this.overlay, this.__eventNames[type]);
        } 
        
    	function Label(content,opts){
    		opts = opts || {};
    		this._content = content;
    		this._offset = opts.offset ? opts.offset : new Size(0,0);
    		this._position = opts.position;
    		
    		this._project;
    		this._style = {
    				'position': 'absolute',
    				'background-color': '#fff', 
    				'padding': '5px',
    				'border-radius': '2px',
    				'font-size': '16px',
    				'cursor': 'pointer',
    				'white-space':'nowrap'
    		}
    		this.overlay = this;
    	}
    	Label.prototype = new google.maps.OverlayView();
    	
    	Label.prototype.onAdd = function(){
    		var me = this,
    		label = this._container = document.createElement('label'),
    		style = me._style;
    		$(label).html(me._content);
    		$(label).css(style);
    		me.getPanes().overlayImage.appendChild(label);
    		me._project = me.getProjection();
    	}
    	
    	Label.prototype.onRemove = function(){
    		$(this._container).remove();
    		this._container = null;
    	}
    	
    	Label.prototype.draw = function(){
    		if (!this._position) {
    			return;
    		}
    		var pixel = this._project.fromLatLngToDivPixel(this.overlay._position.point),
    			top = pixel.y + this._offset.height + 'px',
    			left = pixel.x + this._offset.width + 'px';
    		$(this._container).css({'top':top,'left':left});
    	}
        /**
         * 设置css样式
         * @param {object} styles {fontSize: "16px"}
         */
        Label.prototype.setStyle = function(styles) {
        	$.extend(this._style,styles);
        	this._container && $(this._container).css(styles);
        }
        /**
         * 设置标注的内容
         * @param {String} content
         */
        Label.prototype.setContent = function(content) {
        	this._content = content;
        	this._container && $(this._container).html(content);
        	
        }
        /**
         * 获取标注内容
         */
        Label.prototype.getContent = function() {
        	return this._content;
        }

        /**
         * 设置偏移量
         * @param {Size} offset
         */
        Label.prototype.setOffset = function(offset) {
        	this._offset = offset;
//        	var _project = this._project || this.getProjection();
//			var pixel = _project.fromLatLngToDivPixel(this.overlay._position.point),
//			top = pixel.y + this._offset.height + 'px',
//			left = pixel.x + this._offset.width + 'px';
//			$(this._container).css({'top':top,'left':left});
        }
        /**
         * 获取偏移量
         */
        Label.prototype.getOffset = function() {
            return this._offset;
        }
        /**
         * 设置地理位置
         * @param {Point} position
         */
        Label.prototype.setPosition = function(position) {
        	this._position = position;
        	this._project && this.draw();
        }
        /**
         * 获取地理位置
         */
        Label.prototype.getPosition = function() {
            return this._position;
        }
        /**
         * 显示标签
         */
        Label.prototype.show = function(index) {
        	this._container && $(this._container).show();
        }
        /**
         * 隐藏标签
         */
        Label.prototype.hide = function(index) {
        	this._container && $(this._container).hide();
        }
        
        /**
         * 设置叠放顺序
         * @param {Number} index
         */
        Label.prototype.setZIndex = function(index) {
        	this._container && $(this._container).css('z-index',index);
        }


        /**
         * 几何图形类父类
         * @class
         */
        function Geometry(opt){
        	
            if (arguments.length == 0) {
            	return
            } else if (opt instanceof google.maps.MVCObject) {
				this.overlay = opt;
               
            } else {
                this._opts = {
					strokeColor: opt.strokeColor ? opt.strokeColor : '#333',
					strokeWeight: opt.strokeWeight ? opt.strokeWeight : 1,
					strokeOpacity: opt.strokeOpacity ? opt.strokeOpacity : 1,
					editable: opt.enableEditing ? opt.enableEditing : false
                }
            }
        }
        
        /**
         * 设置画笔颜色
         */
        Geometry.prototype.setStrokeColor = function(color) {
			this.overlay.setOptions({strokeColor:color});
		}
        
        /**
         * 获取画笔颜色
         */
        Geometry.prototype.getStrokeColor = function() {
			return this.overlay.strokeColor;
		}
        
        /**
         * 设置画笔透明度
         */
		Geometry.prototype.setStrokeOpacity = function(opacity) {
			this.overlay.setOptions({strokeOpacity:opacity});
		}
		
		/**
		 * 获取画笔透明度
		 */
		Geometry.prototype.getStrokeOpacity = function() {
			return this.overlay.strokeOpacity;
		}
		
		/**
		 * 设置画笔粗度
		 */
		Geometry.prototype.setStrokeWeight = function(weight) {
			this.overlay.setOptions({strokeWeight:weight});
		}
		
		/**
		 * 获取画笔粗度
		 */
		Geometry.prototype.getStrokeWeight = function() {
			return this.overlay.strokeWeight;
		}
		
		/**
		 * 开启编辑
		 */
		Geometry.prototype.enableEditing = function() {
			this.overlay.setEditable(true);
		}
		
		/**
		 * 关闭编辑
		 */
		Geometry.prototype.disableEditing = function() {
			this.overlay.setEditable(false);
		}
		
		/**
		 * 添加监听
		 */
		Geometry.prototype.addListener = function(eventName,callback) {
			var me = this;
			var event = 'click dblclick mousedown mouseup mouseout mouseover mousemove'.split(' ');
			if (event.indexOf(eventName)>-1 && typeof(callback)==='function') {
				return google.maps.event.addListener(me.overlay,eventName,function(e){
					var _event = {};
					e ? _event.mapEvent = e : e = {};
					_event.type = event[eventName];
					e.latLng && (_event.point = new Point(e.latLng));
					e.pixel && (_event.pixel = new Pixel(e.pixel));
					callback.call(me,_event);
        		});
			}
		}
		
		/**
		 * 删除监听
		 */
		Geometry.prototype.removeListener = function(mapsEventListener) {
			google.maps.event.removeListener(mapsEventListener);
		}
		/**
		 * 派发事件
		 */
		Geometry.prototype.dispatch = function(type) {
        	google.maps.event.trigger(this.overlay, type);
        }
		

		function Polyline(path,opt) {
            if (arguments.length == 0) {
                return;
            }
            opt = opt || {};
            
            this._lineSymbol = {  
				path: 'M 0,-1 0,1',  
				strokeOpacity: opt.strokeOpacity,  
				scale: 3  
			};
			
			if (path instanceof google.maps.Polyline) {
				
				Geometry.call(this,path);
				
            } else {
				Geometry.call(this,opt);
				var temp = fnc.scmapToMapPath(path);
				this._opts.path = temp;
				
                if (opt.strokeStyle === 'dashed') {
                	this._opts.icons = [{icon:this._lineSymbol,offset: '0',repeat: '20px'}];
                	this._opts.strokeOpacity = 0;
                }
                
                this.overlay = new google.maps.Polyline(this._opts);
                this.overlay.strokeStyle = opt.strokeStyle;
				temp = null;
				delete this._opts;
            }
		}
		
        Polyline.prototype = new Geometry();

        Polyline.prototype.constructor = Polyline;

		Polyline.prototype.setPath = function(path) {
			var temp = fnc.scmapToMapPath(path);
			this.overlay.setPath(temp);
			temp = null;
		}
		Polyline.prototype.getPath = function() {
			return fnc.mapToScmapPath(this.overlay.getPath().getArray());
		}
        Polyline.prototype.setPositionAt = function(index,point) {
            this.overlay.getPath().setAt(index,point.point);
        }
		
		/**
		 * 设置画笔风格
		 */
		Polyline.prototype.setStrokeStyle = function(style) {
			var icons = null;
			var opactiy = this.overlay.strokeOpacity;
			
			if (style === 'dashed') {
				this._lineSymbol.strokeOpacity  = this.overlay.strokeOpacity;
				icons = [{icon:this._lineSymbol,offset: '0',repeat: '20px'}];
				opactiy = 0;
			}
			
			this.overlay.setOptions({icons:icons,strokeOpacity:opactiy});
			this.overlay.strokeStyle = style;
		}
		/**
		 * 获取画笔风格
		 */
		Polyline.prototype.getStrokeStyle = function() {
			return this.overlay.strokeStyle;
		}
		
		
		
		function LineRing(path,opt) {
			path instanceof google.maps.Polyline || path.push(path[0]);
			Polyline.call(this,path,opt);
		}

		LineRing.prototype = new Polyline();
		
		LineRing.prototype.constructor = LineRing;

		LineRing.prototype.setPath = function(path) {
			path.push(path[0]);
			var temp = fnc.scmapToMapPath(path);
			this.overlay.setPath(temp);
			temp = null;
		}
		
		LineRing.prototype.setPositionAt = function(index,point) {
            
            if (index >= this.overlay.getPath().length-1) {
                index = this.overlay.getPath().length-1;
                this.overlay.getPath().insertAt(index,point.point);
            } else {
                this.overlay.getPath().setAt(index,point.point);
            }
           
        }
		
		function Polygon(path,opt) {
			if (path instanceof google.maps.Polygon) {
				Geometry.call(this,path);
				
            }else {
            	
				Geometry.call(this,opt);
				
				this._opts.fillColor = opt.fillColor ? opt.fillColor : '#fff';
				this._opts.fillOpacity = opt.fillOpacity ? opt.fillOpacity : 0.8;
				var temp = fnc.scmapToMapPath(path);
				this._opts.path = temp;
                this.overlay = new google.maps.Polygon(this._opts);
				temp = null;
				delete this._opts;
            }
			
		}
		
		Polygon.prototype = new Geometry();
		
        Polygon.prototype.constructor = Polygon;

		Polygon.prototype.setFillColor = function(color) {
			this.overlay.setOptions({'fillColor':color});
		}
		Polygon.prototype.getFillColor = function() {
			return this.overlay.fillColor;
		}
		Polygon.prototype.setFillOpacity = function(opacity) {
			this.overlay.setOptions({'fillOpacity ':opacity});
		}
		Polygon.prototype.getFillOpacity = function() {
			return this.overlay.fillOpacity;
		}
		Polygon.prototype.setPath = function(path) {
			
			var temp = fnc.scmapToMapPath(path);
			this.overlay.setPath(temp);
			temp = null;
		}
		Polygon.prototype.getPath = function() {
			return fnc.mapToScmapPath(this.overlay.getPath().getArray());
		}
		Polygon.prototype.setPositionAt = function(index,point) {
            this.overlay.getPath().setAt(index,point.point);
        }
		


		function Circle(center,radius,opt) {
			if (center instanceof google.maps.Circle) {
				Geometry.call(this,center);
				this.overlay = center;
            }else {
				Geometry.call(this,opt);
				this._opts.center = center.point;
				this._opts.radius = radius;
				this._opts.fillColor = opt.fillColor ? opt.fillColor : '#fff';
				this._opts.fillOpacity = opt.fillOpacity ? opt.fillOpacity : 0.8;
                this.overlay = new google.maps.Circle(this._opts);
                delete this._opts;
            }
			
		}
        Circle.prototype = new Geometry();
        
        Circle.prototype.constructor = Circle;
        
        Circle.prototype.getBounds = function() {
        	return new Bounds(this.overlay.getBounds());
        }

		Circle.prototype.getCenter = function(){
			return new Point(this.overlay.center);
		}
		Circle.prototype.setRadius = function(radius){
			this.overlay.setRadius(radius);
		}
		Circle.prototype.getRadius = function(){
			return this.overlay.radius;
		}
		Circle.prototype.setFillColor = function(color) {
			this.overlay.setOptions({'fillColor':color});
		}
		Circle.prototype.getFillColor = function() {
			return this.overlay.fillColor;
		}
		Circle.prototype.setFillOpacity = function(opacity) {
			this.overlay.setOptions({'fillOpacity ':opacity});
		}
		Circle.prototype.getFillOpacity = function() {
			return this.overlay.fillOpacity;
		}


		function InfoWindow(content,opts) {
			if (typeof content === 'object') {
				this.overlay = content;
			} else {
				var _opts = {
					content: content,
					disableAutoPan: opts.enableAutoPan ? !opts.enableAutoPan : true,
				}
				opts.offset && (_opts.pixelOffset = opts.offset.size );
				this.overlay = new google.maps.InfoWindow(_opts);
				_opts = null;
			}
			this.__eventNames = {
					open: 'open',
					close: 'close'
			}
			this._event();
		}
		
		InfoWindow.prototype.constructor = InfoWindow;
		
		InfoWindow.prototype.setContent = function(content){
			this.overlay.setContent(content);
		}
		
		InfoWindow.prototype._open = function(map){
			this.overlay.open(map);
			google.maps.event.trigger(this,'open');
		}
		
		InfoWindow.prototype._close = function(content){
			this.overlay.close();
			google.maps.event.trigger(this,'close');
		}
		
		
		InfoWindow.prototype.getContent = function(){
			return this.overlay.content;
		}
		
		InfoWindow.prototype.getPosition = function(){
			return new Point(this.overlay.getPosition());
		}
		
		InfoWindow.prototype.enableAutoPan = function(){
			this.overlay.setOptions({'disableAutoPan':false});
		}
		
		InfoWindow.prototype.disableAutoPan = function(){
			this.overlay.setOptions({'disableAutoPan':true});
		}
		
		InfoWindow.prototype._event = function() {
			var me = this;
			google.maps.event.addListener(me, 'closeclick', function(e) {
				google.maps.event.trigger(me,'close');
			});
		},
			
		InfoWindow.prototype.addListener = function(eventName,callback){
			var me = this;

			
			if(( !!me.__eventNames[eventName] && typeof(callback)==='function')){
				return google.maps.event.addListener(me.map,me.__eventNames[eventName],function(e){
					var _event = {};
					e ? _event.mapEvent = e : e = {};
					_event.type = me.__eventNames[eventName];
					e.latLng && (_event.point = new Point(e.latLng));
					e.pixel && (_event.pixel = new Pixel(e.pixel));
					
					if(me.__eventNames[eventName] === 'resize'){
						_event.size = me.getSize();								
					}
					callback.call(me,_event);
				});
				
			}   
			
		}
		InfoWindow.prototype.removeListener = function(mapsEventListener) {
        	google.maps.event.removeListener(mapsEventListener);
        }
        InfoWindow.prototype.dispatch = function(type) {
        	google.maps.event.trigger(this.map,this.__eventNames[type]);
        }
		
        /**
		 * 控件
		 */
		
		/**
		 * 平移缩放控件（鱼骨）
		 */
		function PanzoomControl(opt){
			this.type = "panControl";
			this.option = opt || {};
		}
		
		/**
		 * 比例尺控件
		 */
		
		function ScaleControl(opt){
			this.type = "scaleControl";
			this.option = opt || {};
		}
		
		/**
		 * 鹰眼控件
		 */
		function OverviewMapControl(opts){
			var _opts = {
					isOpen:true
			};
			
			if(opts){
	            opts.offset && (_opts.offset = opts.offset.size);
			}
			
//			this.$control = new BMap.OverviewMapControl(_opts);
		}
		
		//生成函数
		this.createPoint = function(lng,lat) {
			return new Point(lng, lat);
		}
		this.createPixel = function(x,y) {
			return new Pixel(x,y);
		}
		this.createBounds = function(nw,se) {
			return new Bounds(nw, se);
		}
		this.createSize = function(width,height) {
			return new Size(width,height);
		}
		this.createMap = function(div,opt) {
			return new Map(div, opt);
		}
		this.createMapType = function(name,layer,opts) {
			return new MapType(name, layer, opts);
		}

		this.createIcon = function(url, size, offset) {
			return new Icon(url, size, offset);
		}
		this.createMarker = function(point, opt) {
			return new Marker(point, opt);
		}
		this.createLabel = function(content, offset) {
			return new Label(content, offset);
		}
		this.createPolyline = function(path,opt) {
			return new Polyline(path, opt);
		}
		this.createLineRing = function(path, opt) {
			return new LineRing(path, opt);
		}
		this.createPolygon = function(path, opt) {
			return new Polygon(path, opt);
		}
		this.createCircle = function(center, radius, opt) {
			return new Circle(center, radius, opt);
		}
		
		this.createScaleControl = function (){
			return new ScaleControl();
		};
		this.createOverviewMapControl = function (opts){
			return new OverviewMapControl();
		};
		this.createPanzoomControl = function (opts){
			return new PanzoomControl();
		};
		
		this.createInfoWindow = function(content, opt) {
			return new InfoWindow(content, opt);
		}
		/**
		 * 实现自己的自定义覆盖物。
		 * 用例
		 * function add(map){...}
		 * funciton draw(){}
		 * function Test(){}
		 * extendOverlay(Test,add,draw);
		 * Test.prototype.action = function(){}
		 * ....
		 * 
		 */
		this.extendOverlay = function(Constructor,add,draw) {
			Constructor.prototype = new google.maps.OverlayView();
			Constructor.prototype.onAdd = function(){
				var map = this.getMap().__parent__;
				this.__dom = add.call(this,map);
				
				var zoom = map.getZoom();
				var me = this;
				map.addListener('boundschanged',function() {
					if(map.getZoom() == zoom){
						me.draw();
					} else {
						zoom = map.getZoom();
					}
				});
			},
			Constructor.prototype.draw = function(){
				var me = this;
				draw.call(me);
			};
			Constructor.prototype.onRemove = function(){
				$(this.__dom).remove();
				this.__dom = null;
				
			}
		}
		
	}

	/*****************************************************/
	//定义公开的接口
	return {
		createMapEntity:createMapEntity,
		Enum:Enum,
    }
}));
 