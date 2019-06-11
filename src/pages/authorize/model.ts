
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
                console.log("err", err)
            }
        },
        * onAuthorize({ payload }, { select, call, put }) {
            try {
                const result = yield call(authorizeApi.authorize, {...payload})
                Taro.setStorageSync("learnerFullName", result.learnerFullName)
                Taro.setStorageSync("isAdmin", result.isAdmin)
                Taro.redirectTo({
                    url: '/pages/index/index'
                })
            } catch(err){
                console.log("err", err)
            }
        }
    },

    reducers: {}

}
