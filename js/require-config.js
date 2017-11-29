
    requirejs.config({
        "baseUrl": contextPath + "../js",
        "paths": {
			// RequireJs plugins
			"text": 'lib/require/text',
			"css": 'lib/require/css',
			// other libs
			"es6-promise": "lib/es6-promise/es6-promise.auto.min",
			"jquery": 'lib/jquery/jquery-1.9.1',
	        "scooper.util": "lib/scooper.util",
	        "scooper.ajax": "scooper.ajax",
			"bootstrap":"lib/bootstrap/bootstrap.min",
			"ztree":"lib/ztree/jquery.ztree.all.min",
			"head":"view/head",
			"notePage":"page/notePage",
			"content":"view/content"
        },
		"shim":{
        	'ztree':{
        		"deps":['jquery'],
				"exports":'jQuery.fn.zTree'
			}
		}
    });