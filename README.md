# WPM-router
wpm-router 沿用Vue-router 的调用方式，实现在微信小程序跳转页面的封装

## 安装
```
npm install wpm-router --save
cnpm install wpm-router --save
```

## 引用
```
import router from 'wpm-router';
const router = require("wpm-router").default;
```

## 示例
```
import router from 'wpm-router';
router.push({
  path:'',
  query:{},
})

```
## 简介
wpm-router  可单独引入  直接router调用所有内置方法
也可以挂载再[wpm-wx](https://www.npmjs.com/package/wpm-wx)依赖中,
内置支持wpm 引入方式
```
import router from 'wpm-router';
import wpm from 'wpm-wx';

wpm.use(router);

new  wpm();
```
use引入后this对象中新增两个对象，$router  页面跳转 $route 页面基本信息 </br>

## api
```
<!-- 对应 wx.navigateTo  打开新页面 -->
router.push({
  path:'',
  query:{},
})
router.push('')   

<!-- 对应 wx.reLaunch  关闭当前页面，跳转到应用内的某个页面。 -->
router.replace({
  path:'',
  query:{},
})
router.replace('')   

<!-- 对应 wx.redirectTo  关闭所有页面，打开到应用内的某个页面 -->
router.reLaunch(-1)
router.reLaunch(1) 

<!-- 对应 wx.navigateTo  返回上X页 正/负均可 -->
router.go(-1)
router.go(1) 

<!-- 对应 wx.navigateTo  返回上一页 无传参  -->
router.back()

<!-- route 当前页面基本信息,所有内容均是只读，不可通过此对象进行修改 -->
router.route
{
  app:{}, // app.js 的所有内容
  path:'', // 当前页面路径
  query:{}, // 当前页面的传参
}
```
ps: 关于replace 有个特殊实现功能，使用replace去跳转页面时候如果跳转的页面在历史页面栈中有记录 则不会执行关闭当前页面打开新页面，执行结果是，返回的跳转页面的历史页面栈中，即返回上X页，同时如果跳转页面的参数，和原页面的参数不一样则会刷新页面，即重新执行onLoad 生命周期,简单来说就是假设有A进入B页面，B页面进入C页面，C页面执行replace到A ，实际效果是返回到A页面，如果replace到A 和之前A页面的页面参数不一致就会 重新执行onLoad 生命周期。
## 配置
```

<!-- 对应 wx.navigateTo  初始化设置tabBar页面，和是否是自定义导航页面ps：非app.json 配置的导航页 -->
router.init(['/pages/main/index/index','/pages/main/mine/mine'][,true/false])

```
配置好这个函数后，所有跳转函数，都会自动判断即将跳转的路径是否是tabBar，如果是tabBar则更改为[wx.switchTab](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html)方法，



## 版本
* alpha v0.0.1
  >ts 重构原router 项目
  >实现push，replace，reLaunch，go，back方法
  >实现route 封装页面基本信息（对象内容不可被更改）