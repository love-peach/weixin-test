/**
 * Created by zhangjinpei on 2017/6/22.
 */

import Hello from '../components/Hello'

import wxAuth from '../view/wxAuth/wxAuth.vue'
import wxRecord from '../view/wxRecord/wxRecord.vue'


export default [
    {
        path: '/',
        name: 'Hello',
        component: Hello
    }, {
        path: '/wx_auth',
        name: '微信授权',
        component: wxAuth
    }, {
        path: '/wx_record',
        name: '微信录音',
        component: wxRecord
    }
];