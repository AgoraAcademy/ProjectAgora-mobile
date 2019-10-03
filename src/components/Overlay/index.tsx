import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import classNames from 'classnames'
import { StateInterface, PropsInterface } from './interface'
import './style.scss'
import logo from '../../assets/logo.png'

class ComponentHomeNavigation extends Component<
    PropsInterface,
    StateInterface
> {
    constructor(props) {
        super(props)
        this.state = {
            routePath: ''
        }
    }
    componentDidMount() {
        this.setState({
            routePath: Taro.getCurrentPages()[0].route
        })
    }
    jump(item) {
        console.log({
            type: item.type
        })
        if (item.type === 'normal') {
            Taro.navigateTo({
                url: item.path
            })
        } else {
            Taro.switchTab({
                url: item.path
            })
        }
        this.props.onCloseDrawer && this.props.onCloseDrawer()
    }
    render() {
        const routeMap = [
            { path: '/pages/home/home', name: '主页' },
            { path: '/pages/booking/booking', name: '房间预订', type: 'normal' },
            // { path: '/pages/study/study', name: '学习' },
            // { path: '/pages/community/community', name: '社区' },
            {
                path: '/pages/eventCard/eventCard',
                name: '发起活动',
                type: 'normal'
            }
        ]
        return (
            <View className='overlay-box'>
                <View>
                    <Image src={logo} className='logo' />
                </View>
                {routeMap.map(item => {
                    return (
                        <View
                          className={classNames('list-item', {
                                active: item.path.includes(this.state.routePath)
                            })}
                          key={item.path}
                          onClick={() => this.jump(item)}
                        >
                            <View className='at-icon at-icon-home' />
                            <Text>{item.name}</Text>
                        </View>
                    )
                })}
            </View>
        )
    }
}

export default ComponentHomeNavigation
