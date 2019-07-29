import Taro, { Component, Config } from "@tarojs/taro";
import "@tarojs/async-await";
import { Provider } from "@tarojs/redux";
import "./utils/request";
import Index from "./pages/index";
import dva from "./utils/dva";
import models from "./models";
import "./app.scss";
// import 'taro-ui/dist/style/index.scss' // 全局引入一次即可
import "./custom-theme.scss";
import { globalData } from "./utils/common";
import { MAINHOST } from "./config";
import { requestConfig } from "./config/requestConfig";

const dvaApp = dva.createApp({
    initialState: {},
    models: models
});
const store = dvaApp.getStore();

/**
 *
 *
 * @class App
 * @extends {Component}
 *
 * 本小程序为ProjectAgora的移动版，脚手架部分请参考
 *
 * https://www.jianshu.com/p/71e209987c83
 */

class App extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        pages: [
            "pages/activityCard/activityCard",
            "pages/home/home",
            "pages/noticeCard/noticeCard",
            "pages/index/index",
            "pages/booking/booking",
            "pages/authorize/authorize",
            "pages/identity/identity",
            "pages/community/community",
            
            "pages/activityCardDetail/activityCardDetail",
            
           
        ],
        window: {
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#fff",
            navigationBarTitleText: "WeChat",
            navigationBarTextStyle: "black",
            navigationStyle: "custom"
        },
        tabBar: {
            custom: true,
            list: [
                {
                    pagePath: "pages/home/home",
                    text: "我的"
                },
                {
                    pagePath: "pages/booking/booking",
                    text: "学习"
                },
                {
                    pagePath: "pages/community/community",
                    text: "社区"
                }
            ]
        }
    };

    /**
     *
     *  1.小程序打开的参数 globalData.extraData.xx
     *  2.从二维码进入的参数 globalData.extraData.xx
     *  3.获取小程序的设备信息 globalData.systemInfo
     * @memberof App
     */
    // async componentDidMount() {
    //     // 获取参数
    //     const referrerInfo = this.$router.params.referrerInfo;
    //     const query = this.$router.params.query;
    //     !globalData.extraData && (globalData.extraData = {});
    //     if (referrerInfo && referrerInfo.extraData) {
    //         globalData.extraData = referrerInfo.extraData;
    //     }
    //     if (query) {
    //         globalData.extraData = {
    //             ...globalData.extraData,
    //             ...query
    //         };
    //     }

    //     // 获取设备信息
    //     const sys = await Taro.getSystemInfo();
    //     sys && (globalData.systemInfo = sys);
    // }

    componentDidShow() {}

    componentDidHide() {}

    componentDidCatchError() {}

    componentDidMount() {}

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render() {
        return (
            <Provider store={store}>
                <Index />
            </Provider>
        );
    }
}

Taro.render(<App />, document.getElementById("app"));
