
import Lockr from 'lockr';
Lockr.prefix = 'weixin_test_';

export default {
    setAppId(val) {
        Lockr.set('appId', val);
    },
    getAppId() {
        return Lockr.get('appId');
    },
    setOpenId(val) {
        Lockr.set('openId', val);
    },
    getOpenId() {
        return Lockr.get('openId');
    },
    flush() {
        return Lockr.flush();
    }
}
