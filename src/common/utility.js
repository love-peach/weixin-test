/**
 * Created by zhangjinpei on 2017/6/22.
 */
export default {
    // 获取 href 中的参数
    getUrlParam: function (href) {
        const param = {};
        const url = href || window.location.href;
        const parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            if (value.indexOf('#') > 0) {
                value = value.split('#')[0];
            }
            param[key] = value;
        });
        return param;
    },
}