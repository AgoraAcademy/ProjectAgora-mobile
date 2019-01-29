import * as BookRoomApi from './service';

export default {
    namespace: 'BookRoom',
    state: {
    },
    effects: {
        * effectsDemo(_, { call, put }) {
            const { status, data } = yield call(BookRoomApi.demo, {});
            if (status === 'ok') {
                yield put({ type: 'save',
                    payload: {
                        topData: data,
                    } 
                });
            }
        },
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
