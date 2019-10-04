
// import Taro from '@tarojs/taro';

export default {
    namespace: 'home',
    state: {
        hadClear: ''
    },

    effects: {
        * hadClear({ payload }, { put }) {
            console.log({
                payload
            })
            yield put({ type: "setHadClear", name: "hadClear", value: payload })
        },
    },

    reducers: {
        setHadClear(state, action) {
            console.log("此处action", action)
            const { name, value } = action;
            let newState = { ...state }
            newState[name] = value
            return newState;
        },
    }

}
