"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
const index_1 = require("../utils/index");
const [SWITCH, RELANUCH, REPLACE, PUSH, BACK] = ['switch', 'reLaunch', 'replace', 'push', 'back'];
let instance;
class Router {
    constructor() {
        this.special = true;
        // 小程序导航条
        this.tabBar = [];
        // 小程序自定义导航条  ps：非app.json 中的自定义导航条
        this.custom = false;
        if (instance) {
            return instance; //防止被篡改
        }
        else {
            instance = this;
        }
    }
    init(tabBar, custom) {
        this.tabBar = tabBar;
        this.custom = custom;
    }
    //  打卡新页面
    push(params) {
        let path = this.__handleData(params);
        this.router(path, PUSH);
    }
    // 关闭当前页面，跳转到应用内的某个页面。
    replace(params) {
        let path = this.__handleData(params);
        this.router(path, REPLACE);
    }
    // 关闭所有页面，打开到应用内的某个页面
    reLaunch(params) {
        let path = this.__handleData(params);
        this.router(path, RELANUCH);
    }
    go(index) {
        index = Math.abs(index);
        return this.router(index, BACK);
    }
    back() {
        return this.go(-1);
    }
    router(data, type) {
        //  
        if (type != SWITCH && type != BACK) {
            for (let i = 0; i < this.tabBar.length; i++) {
                let element = this.tabBar[i];
                if (data.includes(element)) {
                    return this.router(data, SWITCH);
                }
            }
        }
        if (type == SWITCH && this.custom) {
            type = RELANUCH;
        }
        if (type == SWITCH) {
            let [url, urlData] = data.split('?');
            data = url;
        }
        /**
          * 预实现功能，返回上一页，假设REPLACE情况下触发的back ，将实现如下功能：
          *  1.返回到指定页面
          *  2.如果返回到指定页面，和现在需要打开页面的参数不符合的情况，将手动更改原页面的页面参数，和手动触发onLoad事件
          *
          */
        // 仅支持绝对路径的 特殊处理
        if (type == REPLACE && /^\//.test(data)) {
            if (this.special) {
                let pages = this.getPages(), [url, urlData] = data.split('?'), index = 0;
                let page = pages.filter((item, i) => {
                    if (data.includes(item.route)) {
                        index = i;
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                if (page.length) {
                    page = page[0];
                    index = pages.length - index - 1;
                    if (qs_1.default.stringify(page.options) != urlData) {
                        page.options = qs_1.default.parse(urlData);
                        page.onLoad(page.options);
                    }
                    return this.router(index, BACK);
                }
            }
        }
        return this._router(data, type);
    }
    _router(data, type) {
        return new Promise((resolve, reject) => {
            switch (type) {
                // 打卡新页面
                case PUSH:
                    wx.navigateTo({
                        url: data,
                        success: (data) => {
                            // @ts-ignore
                            resolve(data);
                        },
                        fail: (err) => {
                            console.error(err);
                            // @ts-ignore
                            reject(err);
                        }
                    });
                    break;
                // 关闭当前页面，跳转到应用内的某个页面。
                case REPLACE:
                    wx.redirectTo({
                        url: data,
                        success: (data) => {
                            // @ts-ignore
                            resolve(data);
                        },
                        fail: (err) => {
                            console.error(err);
                            // @ts-ignore
                            reject(err);
                        }
                    });
                    break;
                // 关闭所有页面，打开到应用内的某个页面
                case RELANUCH:
                    wx.reLaunch({
                        url: data,
                        success: (data) => {
                            // @ts-ignore
                            resolve(data);
                        },
                        fail: (err) => {
                            console.error(err);
                            // @ts-ignore
                            reject(err);
                        }
                    });
                    break;
                //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
                case SWITCH:
                    wx.switchTab({
                        url: data,
                        success: (data) => {
                            // @ts-ignore
                            resolve(data);
                        },
                        fail: (err) => {
                            console.error(err);
                            // @ts-ignore
                            reject(err);
                        }
                    });
                    break;
                // 返回上x页
                case BACK:
                    wx.navigateBack({
                        delta: data,
                        success: (data) => {
                            // @ts-ignore
                            resolve(data);
                        },
                        fail: (err) => {
                            console.error(err);
                            // @ts-ignore
                            reject(err);
                        }
                    });
                    break;
                default:
                    console.error(`type:${type} 无此类型方法`);
                    break;
            }
        });
    }
    __handleData(params) {
        if (typeof params === 'string') {
            return params;
        }
        if (typeof params === 'object' && !(params instanceof Array)) {
            if (!params.path) {
                throw new Error('函数参数错误，path 是必传参数');
            }
            let [url, urlData] = params.url.split('?');
            if (urlData) {
                let data = qs_1.default.parse(urlData);
                params.query = index_1.extend(params.query, data);
            }
            let query = qs_1.default.stringify(params.query);
            if (query) {
                url = `${url}?${query}`;
            }
            return url;
        }
        throw `传参不符合规范，规定是string/object 现参数类型为 ${typeof params} :${params}`;
    }
    getPages() {
        return getCurrentPages();
    }
}
exports.default = Router;
