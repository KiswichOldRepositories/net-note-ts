define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Util = (function () {
        function Util() {
        }
        /**
         * 获取一个Cookie
         * @param {string} cname
         * @returns {string}
         */
        Util.prototype.getCookie = function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0)
                    return c.substring(name.length, c.length);
            }
            return "";
        };
        /**
         * 设置一个 Cookie
         * @param {string} cname
         * @param {string} cvalue
         * @param {number} exdays
         */
        Util.prototype.setCookie = function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        };
        /**
         * 删除一个Cookie
         * @param {string} cname
         */
        Util.prototype.deleteCookie = function (cname) {
            this.setCookie(cname, "", -1);
        };
        Util.signup = function (username, password, success) {
            var form = new FormData();
            form.append("username", username);
            form.append("password", password);
            $.ajax({
                url: "/net-note/v1/user/signup",
                type: "POST",
                cache: false,
                data: form,
                processData: false,
                contentType: false
            }).done(function (data) {
            }).fail(function () {
            });
        };
        return Util;
    }());
    exports.Util = Util;
});
//# sourceMappingURL=util.js.map