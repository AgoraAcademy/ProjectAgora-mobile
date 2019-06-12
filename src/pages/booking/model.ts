
// import Taro from '@tarojs/taro';
import * as bookingApi from './service';
import Taro from '@tarojs/taro';
import {
    ISMOCK,
    MAINHOST
} from '../../config'
import Tips from '../../utils/tips'

export default {
    namespace: 'booking',
    state: {
        isLoadingFailed: false,
        loadedEvents: []
    },

    effects: {
        * getRoomList({ payload }, { select, call, put }) {
            try {
                console.log("开始尝试获取roomList")
                const result = yield call(bookingApi.getRoomList)
                if (result.length > 0 ) {
                    return result
                } else {
                    yield put({ type: "setField", name: "isLoadingFailed", value: true})
                }
                
            } catch(err){
                console.log("err", err)
            }
        },
        * loadEvents (action, { select, call, put}) {
            // 此处由于同时需要提供query和path, 不走封装好的方法
            const { monthToLoad, roomCode } = action.payload
            const token = Taro.getStorageSync('token')
            const result = yield Taro.request({
                url: `${MAINHOST}/booking/${roomCode}`,
                data: { monthToLoad },
                header: { 'token': token }
            })
            yield put({ type: "setField", name: "loadedEvents", value: result.data || []})
        },
        * clearEvents (action, { select, call, put}) {
            yield put({ type: "setField", name: "loadedEvents", value: [] })
        },
        * createEvent (action) {
             // 此处由于同时需要提供body和path, 不走封装好的方法
            const { body, roomCode } = action.payload
            const token = Taro.getStorageSync('token')
            yield Taro.request({
                url: `${MAINHOST}/booking/${roomCode}`,
                data: { ...body },
                header: { 'token': token },
                method: "POST"
            }).then(data => {
                if (data.statusCode === 201) {
                    Tips.toast("成功")
                    Taro.redirectTo({url: `/pages/booking/booking?statusCode=${data.statusCode}&roomCode=${roomCode}&selectedDate=${body.startDate}`})
                }
            })
        },
        * deleteEvent (action) {
            const { body, roomCode, startDate } = action.payload
            const token = Taro.getStorageSync('token')
            yield Taro.request({
                url: `${MAINHOST}/booking/${roomCode}?monthToLoad=${startDate.substr(0,7)}`,
                data: { ...body },
                header: { 'token': token },
                method: "DELETE"
            }).then(data => {
                if (data.statusCode === 201) {
                    Tips.toast("成功")
                    Taro.redirectTo({url: `/pages/booking/booking?statusCode=${data.statusCode}&roomCode=${roomCode}&selectedDate=${startDate}`})
                }
            })
        }
    },

    reducers: {
        setField(state, action) {
            console.log("此处action", action)
            const {name, value} = action;
            let newState = {...state}
            newState[name] = value
            return newState;
        },
    }

}
