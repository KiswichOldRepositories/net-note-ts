requirejs.config({
    "baseUrl": contextPath + "/js",
    "paths": {
        // RequireJs plugins
        "text": 'lib/require/text',
        "css": 'lib/require/css',
        // other libs
        "es6-promise": "lib/es6-promise/es6-promise.auto.min",
        "jquery": 'lib/jquery/jquery-1.9.1',
        "scooper.util": "lib/scooper.util",
        "scooper.ajax": "scooper.ajax",
        "bootstrap": "lib/bootstrap/bootstrap.min",
        "ztree": "lib/ztree/jquery.ztree.all.min",
        "nicEdit": "lib/nicEditor/nicEdit",
        "Webuploader":"lib/webuploader/webuploader.min"
    },
    "shim": {
        'ztree': {
            "deps": ['jquery', 'bootstrap', "nicEdit","Webuploader"],
            "exports": 'jQuery.fn.zTree'
        },
        'nicEdit': {
            "exports":'nicEdit'
        },
        'Webuploader':{
            "deps":['jquery'],
            "exports":'WebUploader'
        },
        "bootstrap": {
            "deps": ['jquery'],
            "export": "bootstrap"
        }
    }
});

// require(['jquery'], function($) {
//     alert($().jquery);
//     window.jQuery = window.$ = jQuery;
// });