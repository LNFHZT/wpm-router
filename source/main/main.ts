import Router from './router';
import Route from './route';
let instance: Main;
class Main extends Router {
    route: any;
    constructor() {
        if (instance) {
            return instance; //防止被篡改
        } else {
            super();
            instance = this;
        }
        this.route = new Route();
        this._watchRoute();
    }
    // 兼容 wpm 注入
    install(Wpm: any) {
        Wpm.prototype.$router = this;
        Wpm.prototype.$route = this.route;
    }
    private _watchRoute() {
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
                    let page: any = {};
                    if (pages.length) {
                        page = pages[pages.length - 1]
                    }
                    return { ...page.options } || {};
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
                    let page: any = {};
                    if (pages.length) {
                        page = pages[pages.length - 1]
                    }
                    return page.route || '';
                },
                set: function () {
                    // return
                }
            }
        })
    }
}

export default new Main()