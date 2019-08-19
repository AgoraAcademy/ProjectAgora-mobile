
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui';
import { AuthorizeProps, AuthorizeState } from './authorize.interface'
import './authorize.scss'
import { MAINHOST } from '../../config'
import {
    requestConfig
} from '../../config/requestConfig'
import ComponentBaseNavigation from "../../components/ComponentHomeNavigation/componentHomeNavigation";

@connect(({ authorize }) => ({
    ...authorize,
}))

class Authorize extends Component<AuthorizeProps, AuthorizeState > {
    
    constructor(props: AuthorizeProps) {
        super(props)
        this.state = {}
    }
    
    
   
    componentDidMount() {
    }
    config:Config = {
        navigationBarTitleText: '授权页面'
    }
   
    async ping() {
        await this.props.dispatch({
            type: 'authorize/ping'
        })
    }
    

    onGetUserInfo = async (userInfo) => {
        console.log('onuser', userInfo )
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
            <View className='authorize-wrap'>
                <ComponentBaseNavigation type='child-page' />
                <AtButton customStyle={{ display: Taro.getStorageSync("isAdmin") ? "block": "none" }} onClick={() => console.log(Taro.getStorageSync('token'))}>获取session_key</AtButton>
                <AtButton type='primary' openType='getUserInfo' onGetUserInfo={this.onGetUserInfo}>授权</AtButton>
                <AtButton customStyle={{ display: Taro.getStorageSync("isAdmin") ? "block": "none" }} onClick={() => console.log(Taro.getUserInfo().then((res) => console.log(res)))}>获取userInfo</AtButton>
            </View>
        )
    }
    }
export default Authorize
