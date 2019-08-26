
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui';
import { AuthorizeProps, AuthorizeState } from './authorize.interface'
import './authorize.scss'
import Logo from './logo.png'
// import { MAINHOST } from '../../config'
// import {
//     requestConfig
// } from '../../config/requestConfig'
// import ComponentBaseNavigation from "../../components/ComponentHomeNavigation/componentHomeNavigation";

@connect(({ authorize }) => ({
    ...authorize,
}))

class Authorize extends Component<AuthorizeProps, AuthorizeState> {

    constructor(props: AuthorizeProps) {
        super(props)
        this.state = {}
    }



    componentDidMount() {
    }
    config: Config = {
        navigationBarTitleText: '授权页面'
    }

    async ping() {
        await this.props.dispatch({
            type: 'authorize/ping'
        })
    }


    onGetUserInfo = async (userInfo) => {
        console.log('onuser', userInfo)
        Taro.setStorageSync("iv", userInfo.detail.iv)
        Taro.setStorageSync("encryptedData", userInfo.detail.encryptedData)
        console.log("保存iv")

        await this.$dealLogin()
        Taro.switchTab({
            url: '/pages/home/home'
        })
    }

    render() {
        return (

            <View className='warrant'>
                <View className='white'>
                    <Image src={Logo} className='pictrue'></Image>
                    <View className='tip'>您的信息和数据将受到保护</View>
                    <AtButton
                      className='but'
                      openType='getUserInfo'
                      onGetUserInfo={this.onGetUserInfo}

                    >授权并登录</AtButton>
                </View>
                <View className='mask'></View>
            </View>

        )
    }
}
export default Authorize
