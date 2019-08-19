import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtIcon, AtDrawer } from 'taro-ui';
import classNames from 'classnames';
import ComponentBaseNavigation from '../navigation/navigation';
import { StateInterface, PropsInterface } from './interface';
import Overlay from '../Overlay';
import './style.scss';
import logo from '../../assets/logo.png';

class ComponentHomeNavigation extends Component<
    PropsInterface,
    StateInterface
> {
    constructor(props) {
        super(props);
        this.state = {
            routePath: '',
            overlayStatus: false
        };
    }

    componentDidMount() {
        this.setState({
            routePath: Taro.getCurrentPages()[0].route
        });
    }
    handleClick() {}
    jump(url) {
        // Taro.redirectTo({
        //     url: url
        // });
        Taro.switchTab({
            url
        });
    }
    back() {
        if (Taro.getCurrentPages().length > 1) {
            Taro.navigateBack();
        }
    }
    showOverlay() {
        this.setState({
            overlayStatus: true
        });
    }
    closeOverlay() {
        this.setState({
            overlayStatus: false
        });
    }
    render() {
        const routeMap = [
            { path: '/pages/home/home', name: '我的' },
            { path: '/pages/booking/booking', name: '学习' },
            { path: '/pages/community/community', name: '社区' }
        ];
        const type = this.props.type;
        return (
            <ComponentBaseNavigation>
                <View className='navigation-box'>
                    {
                        {
                            'normal-page': (
                                <View className='sub-box'>
                                    <AtDrawer
                                      show={this.state.overlayStatus}
                                      mask
                                      onClose={this.closeOverlay.bind(this)}
                                    >
                                        <Overlay onCloseDrawer={()=>this.setState({ overlayStatus: false })} />
                                    </AtDrawer>
                                    <View
                                      onClick={() => this.showOverlay()}
                                      className='icon-menu'
                                    >
                                        <AtIcon value='menu' />
                                        <Image src={logo} className='logo' />
                                    </View>
                                    <View className='ul'>
                                        {routeMap.map(item => {
                                            return (
                                                <View
                                                  className={classNames(
                                                        'li',
                                                        {
                                                            active: item.path.includes(
                                                                this.state
                                                                    .routePath
                                                            )
                                                        }
                                                    )}
                                                  key={item.path}
                                                  onClick={() =>
                                                        this.jump(item.path)
                                                    }
                                                >
                                                    {item.name}
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            ),
                            'child-page': (
                                <View
                                  className='back-header'
                                  onClick={() => {
                                        this.back();
                                    }}
                                >
                                    <AtIcon value='chevron-left' size='20' />
                                    <Text>返回</Text>
                                </View>
                            ),
                            'picker-page': (
                                <View
                                  className='back-header'
                                  onClick={() => {
                                        this.back();
                                    }}
                                >
                                    <AtIcon value='chevron-left' size='20' />
                                    <Text>返回</Text>
                                </View>
                            )
                        }[type]
                    }
                </View>
                {this.props.children}
            </ComponentBaseNavigation>
        );
    }
}

export default ComponentHomeNavigation;
