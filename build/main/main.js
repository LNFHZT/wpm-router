"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("./router"));
const route_1 = __importDefault(require("./route"));
let instance;
class Main extends router_1.default {
    constructor() {
        if (instance) {
            return instance; //防止被篡改
        }
        else {
            super();
            instance = this;
        }
        this.route = new route_1.default();
        this._watchRoute();
    }
    // 兼容 wpm 注入
    install(Wpm) {
        Wpm.prototype.$router = this;
        Wpm.prototype.$route = this.route;
    }
    _watchRoute() {
        Object.defineProperties(this.route, {
            app: {
                // Configurable:false,
                // Writable:false,
                get: function () {
                    // console.log('get------app');
                    return getApp();
                },
                set: function () {
                    // return
                    // this.query = {};
                }
            },
            query: {
                // Configurable:false,
                Writable: true,
                get: function () {
                    // console.log('get------query');
                    let pages = getCurrentPages();
                    let page = {};
                    if (pages.length) {
                        page = pages[pages.length - 1];
                    }
                    return Object.assign({}, page.options) || {};
                },
                set: function (data) {
                    // return
                }
            },
            path: {
                // Configurable:false,
                // Writable:false,
                get: function () {
                    // console.log('get------path');
                    let pages = getCurrentPages();
                    let page = {};
                    if (pages.length) {
                        page = pages[pages.length - 1];
                    }
                    return page.route || '';
                },
                set: function () {
                    // return
                }
            }
        });
    }
}
exports.default = new Main();
