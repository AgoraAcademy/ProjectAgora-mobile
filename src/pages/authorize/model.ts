
// import Taro from '@tarojs/taro';
import * as authorizeApi from './service';

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
        }
    },

    reducers: {}

}
