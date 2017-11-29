define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Content = /** @class */ (function () {
        function Content(select) {
            this.$content = $("<div class=\"content\">\n                            <div class=\"container-fluid\">\n                                <div class=\"row\" id=\"content\">\n\n                                </div>\n                            </div>\n                        </div>");
            this.$content.appendTo(select);
        }
        Content.prototype.build = function () {
        };
        return Content;
    }());
    exports.Content = Content;
});
//# sourceMappingURL=content.js.map