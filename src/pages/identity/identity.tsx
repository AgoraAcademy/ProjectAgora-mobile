
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { IdentityProps, IdentityState } from './identity.interface'
import './identity.scss'
// import { } from '../../components'

// @connect(({ identity }) => ({
//     ...identity,
// }))

class Identity extends Component<IdentityProps,IdentityState > {
    config:Config = {
        navigationBarTitleText: '账号'
    }
    constructor(props: IdentityProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <View className='identity-wrap'>
                <View><Text>未能获取账户信息</Text></View>
                <View><Text>如果你已注册ProjectAgora账户，请尝试一下登录一次网页端后再尝试</Text></View>
                <View><Button onClick={() => Taro.navigateTo({url: "/pages/index/index"})}>返回主页</Button></View>
            </View>
        )
    }
    }

export default Identity
