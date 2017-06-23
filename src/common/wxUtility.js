import storage from '../common/storage'
import wxEnvInfo from './wxEnvInfo'
import utility from './utility'
import axios from 'axios'

const appId = wxEnvInfo[process.env.NODE_ENV].weiXin.appID;
const secret = wxEnvInfo[process.env.NODE_ENV].weiXin.appsecret;

/**
 * 当换了微信公众号并且用户localStorage中缓存了openId，此时会导致用户使用的还是老公众号的openId，
 * 解决方案：缓存appId，通过新老appId判读是否换了公众号，如果换了则清空localStorage
 * */
const updateAppId = function () {
    try {
        console.log(`当前AppId:${appId} `);
        console.log(`之前AppId:${storage.getAppId()}`);
        if (appId !== storage.getAppId()) {
            console.log('AppId 不一致，将本地 localStorage 清空 ');
            storage.flush()
        }
        storage.setAppId(appId)
    } catch (e) {
        console.log(e);
        storage.flush()
    }
};

/**
 * 第一步
 * 微信授权,获得code, 需要从url里取出
 */
const getWeiXinCode = function (url) {
    const params = {
        appId: appId,
        redirect_uri: url, //授权后重定向的回调链接地址
        response_type: 'code', //返回类型code， 继续可获得 openId
        scope: 'snsapi_base', //snsapi_base不弹出授权页面，直接跳转，只能获取用户openid；授权页面必须为snsapi_userinfo，可通过openid拿到昵称、性别、所在地
        state: 'STATE'
    };
    location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${params.appId}&redirect_uri=${url}&response_type=${params.response_type}&scope=${params.scope}&state=${params.state}#wechat_redirect`;
};

/**
 * 第二步
 * 获取 OpenId 和 access_token
 * @param url
 * @param callback  注意数据是json串
 */
const getWeiXinOpenId = function (callback) {
    const code = utility.getUrlParam().code;
    if (!code) {
        const href = location.href.split("?")[0];
        const url = encodeURIComponent(href);
        return getWeiXinCode(url);
    }
    axios.get(`/auth?appid=${appId}&secret=${secret}&code=${code}&grant_type=authorization_code`).then(function (res) {
        console.log(res, 'res');
        // TODO
        // 获取用户信息的时候肯能会报错，应该有个统一处理的方法，不应该是一个一个错误码来提示。同时不管什么错，都应该清空storage
        if (res.data.errcode) {
            alert(res.data.errmsg);
            storage.flush();
            window.location.href = window.location.origin;
        } else {
            const openId = res.data.openid;
            storage.setOpenId(openId);
            if (callback) {
                callback(openId);
            }
        }
    }).catch(function (err) {
        console.log(err);
    });
};

export default {
    updateAppId,
    getWeiXinCode,
    getWeiXinOpenId
}
