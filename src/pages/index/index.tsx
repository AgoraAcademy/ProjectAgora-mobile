
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { IndexProps, IndexState } from './index.interface'
import './index.scss'
// import { } from '../../components'
// page.js
import { AtButton, AtFab } from 'taro-ui'
// 除了引入所需的组件，还需要手动引入组件样式
// app.js

// @connect(({ index }) => ({
//     ...index,
// }))

class Index extends Component<IndexProps,IndexState > {
    config:Config = {
        navigationBarTitleText: 'ProjectAgora'
    }
    constructor(props: IndexProps) {
        super(props)
        this.state = {}
    }

    // componentDidMount() {
    //     Taro.getSetting().then((setting) => {
    //         console.log(setting)
    //         if (!setting.authSetting['scope.userInfo']) {
    //             Taro.authorize({
    //                 scope: 'scope.userInfo'
    //             }).then(
    //                 (res) => console.log(res)
    //             )
    //         }
    //     })
    // }


    handleScanCode() {
        Taro.scanCode().then(
            (res) => {
                console.log(res)
        })
    }

    render() {
        return (
            <View className='index-wrap'>
                <AtButton type='primary'
                    onClick={() => Taro.navigateTo({
                        url: '/pages/booking/booking'
                    })}>房间预约</AtButton>
                <AtButton customStyle={{display: Taro.getStorageSync("isAdmin") ? "block": "none"}} onClick={() => console.log(Taro.getStorageSync('token'), Taro.getStorageSync("isAdmin") )}>获取session_key</AtButton>
                <AtButton customStyle={{display: Taro.getStorageSync("isAdmin") ? "block": "none"}} onClick={() => Taro.navigateTo({url: "/pages/identity/identity"})}>跳转identity页</AtButton>
                <View className='bottom-bar at-row at-row__justify--center' style={{ position: "absolute", bottom: "16px", left: "50%" }}>
                    <View style={{position: "relative", left:"-50%", display: "none"}}>
                        <AtFab onClick={this.handleScanCode}>
                            <Text className='at-fab__icon at-icon at-icon-menu'/>
                        </AtFab>
                    </View>
                </View>
                <AtButton onClick={async () => {
                    await Taro.clearStorageSync()
                    Taro.navigateTo({ url: "/pages/authorize/authorize" })
                }}>清除缓存（出错时使用）</AtButton>
            </View>
        )
    }
}

export default Index
