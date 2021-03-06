define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Foot = /** @class */ (function () {
        function Foot(select) {
            var _this = this;
            this.foot = ("<div class=\"foot centor\">\n                            <a href=\"\" style=\"margin-left: 20%\">\u5173\u4E8E\u6211\u4EEC</a>\n                            <span class=\"graytext\">|</span>\n                            <a href=\"\">\u670D\u52A1\u6761\u6B3E</a>\n                            <span class=\"graytext\">|</span>\n                            <a href=\"\">\u4F7F\u7528\u89C4\u8303</a>\n                            <span class=\"graytext\">|</span>\n                            <a href=\"\">\u5BA2\u670D\u4E2D\u5FC3</a>\n                       </div>");
            this.build = function () {
                // this.$foot.appendTo(this.select);
                $(_this.select).append(_this.foot);
            };
            this.select = select;
        }
        return Foot;
    }());
    exports.Foot = Foot;
});
//# sourceMappingURL=foot.js.map