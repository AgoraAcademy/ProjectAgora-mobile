
// import Taro from '@tarojs/taro';
import * as authorizeApi from './service';
import Taro from '@tarojs/taro'
export default {
    namespace: 'authorize',
    state: {
    },
    effects: {
        * ping({ payload }, { select, call, put }) {
            try {
                const result = yield call(authorizeApi.ping)
                console.log(result)
            } catch(err){
                console.log("booking/ping错误", err)
            }
        },
        * onAuthorize({ payload }, { select, call, put }) {
            try {
                const result = yield call(authorizeApi.authorize, {...payload})
                console.log("执行booking/onAuthorize, result=", result)
                Taro.setStorageSync("learnerFullName", result.learnerFullName)
                Taro.setStorageSync("isAdmin", result.isAdmin)
                Taro.setStorageSync("unionid", result.unionid)
            } catch(err){
                console.log("booking/onAuthorize", err)
            }
        }
    },

    reducers: {}

}
