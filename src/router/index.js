import Vue from 'vue'
import toPath from './toPath'
import utility from '../common/utility'
import wxUtility from '../common/wxUtility'
import storage from '../common/storage'
import Routes from './routes'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
    mode: 'hash', // history 会导致微信签名失效
    routes: Routes,
});

console.log('当前环境:',process.env.NODE_ENV)

router.beforeEach((to, from, next) => {
    const openId = storage.getOpenId();
    const param = utility.getUrlParam();
    console.log('用户openId:', openId);
    if (openId) {
        toPath(to, from, next);
    } else if (!param.code) {
        console.log('跳转获取code页面')
        var href = encodeURIComponent(location.href);
        wxUtility.getWeiXinCode(href);
    } else {
        console.log('请求 openId')
        wxUtility.getWeiXinOpenId(function() {
            console.log('我该跳转了');
            toPath(to, from, next);
        });
    }
});

export default router

