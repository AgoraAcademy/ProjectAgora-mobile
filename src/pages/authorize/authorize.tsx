
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { AuthorizeProps, AuthorizeState } from './authorize.interface'
import './authorize.scss'
import { AtButton } from 'taro-ui';
// import { } from '../../components'

@connect(({ authorize }) => ({
    ...authorize,
}))

class Authorize extends Component<AuthorizeProps,AuthorizeState > {
    config:Config = {
        navigationBarTitleText: '授权页面'
    }
    constructor(props: AuthorizeProps) {
        super(props)
        this.state = {}
    }

    async ping() {
        await this.props.dispatch({
            type:'authorize/ping'
        })
    }

    componentDidMount() {
        this.ping()
        // Taro.login()
        // .then((res) => console.log(res))
        // .catch((failRes) => {
        //     console.log(failRes)
        // })
    }

    onGetUserInfo(e) { 
        console.log(e)
    }

    render() {
        return (
            <View className='authorize-wrap'>
                <AtButton open-type="getUserInfo" onGetUserInfo={this.onGetUserInfo}>授权</AtButton>
            </View>
        )
    }
    }

export default Authorize
