"use strict";
exports.__esModule = true;
exports.Details = void 0;
var Details = /** @class */ (function () {
    function Details(url, names, id, uids) {
        this.url = url;
        this.names = names;
        this.id = id;
        this.uids = uids;
        this.custom = false;
    }
    Object.defineProperty(Details.prototype, "avatar", {
        get: function () {
            return this.url;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Details.prototype, "rid", {
        get: function () {
            return this.id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Details.prototype, "unames", {
        get: function () {
            return this.names;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Details.prototype, "ids", {
        get: function () {
            return this.uids;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Details.prototype, "uNames", {
        set: function (v) {
            this.names.push(v);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Details.prototype, "idS", {
        set: function (v) {
            this.uids.push(v);
        },
        enumerable: false,
        configurable: true
    });
    return Details;
}());
exports.Details = Details;
