define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Content = /** @class */ (function () {
        function Content(select) {
            var _this = this;
            this.content = ("<div class=\"content\">\n                            <div class=\"container-fluid\">\n                                <div class=\"row\" id=\"content\">\n\n                                </div>\n                            </div>\n                        </div>");
            this.build = function () {
                $(_this.select).append(_this.content);
            };
            // this.$content.appendTo(select);
            this.select = select;
        }
        return Content;
    }());
    exports.Content = Content;
});
//# sourceMappingURL=content.js.map