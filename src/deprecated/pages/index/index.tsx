import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabBar, AtGrid } from 'taro-ui'
import './index.less'

export interface IIndexState {
    current: number
}

export interface IIndexProps {
    main: any,
}

@connect(({ main }) => ({
    main
}))
export default class Index extends Component<IIndexProps> {

    public state: IIndexState = {
        current: 0
    }
    

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '首页'
    }

    public handleClickk(item,index) {
        Taro.redirectTo({
            url: '/pages/RequestAuth/index'
        })
    }

    componentWillMount() { }

    componentDidMount() {
        Taro.getSetting({
            success(res) {
                console.log("got setting", res)
                if (!res.authSetting['scope.userInfo']) {
                    console.log("noAuth")
                    Taro.redirectTo({
                        url: '/pages/RequestAuth/index'
                    })
                } else {
                    Taro.getUserInfo({            
                    }).then((res) => console.log(res))
                }
            }
        })
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    handleClick(value) {
        this.setState({
            current: value
        })
    }

    render() {
        return (
            <View className='index'>
                <AtGrid 
                    onClick={this.handleClickk}
                    data={
                    [
                        {
                            image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
                            value: '预约空间',
                        },
                        {
                            image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
                            value: '我的课表'
                        },
                        {
                            image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
                            value: '公告宣传'
                        },
                    ]
                } />
                <AtTabBar
                    fixed
                    tabList={[
                        { title: '首页', iconType: 'home' },
                        { title: '消息', iconType: 'mail' },
                        { title: '我的', iconType: 'user' }
                    ]}
                    onClick={this.handleClick.bind(this)}
                    current={this.state.current}
                />
            </View>
        )
    }
}


// function mapStateToProps({main}) {
//   return { main }
// }


// export default connect(mapStateToProps)(Index)