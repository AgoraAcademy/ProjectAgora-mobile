import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import classNames from 'classnames';
import { StateInterface, PropsInterface } from './interface';
import './style.scss';
import logo from '../../assets/logo.png';

class ComponentHomeNavigation extends Component<
    PropsInterface,
    StateInterface
> {
    constructor(props) {
        super(props);
        this.state = {
            routePath: ''
        };
    }
    componentDidMount() {
        this.setState({
            routePath: Taro.getCurrentPages()[0].route
        });
    }
    jump(url) {
        Taro.switchTab({
            url
        });
    }
    render() {
        const routeMap = [
            { path: '/pages/home/home', name: '主页' },
            { path: '/pages/booking/booking', name: '房间预订' },
            { path: '/pages/community/community', name: '查看公告' }
        ];
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
                            onClick={() => this.jump(item.path)}
                        >
                            <View className='at-icon at-icon-home' />
                            <Text>{item.name}</Text>
                        </View>
                    );
                })}
            </View>
        );
    }
}

export default ComponentHomeNavigation;
