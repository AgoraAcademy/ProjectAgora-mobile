import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { StateInterface, PropsInterface } from './interface';
import './style.scss';
import { colorList } from '../../globalData';
class ComponentHomeNavigation extends Component<
    PropsInterface,
    StateInterface
> {
    constructor(props) {
        super(props);
        this.state = {
            bg: ''
        };
    }
    componentDidMount() {
        this.setState({
            bg: this.getRandomColor()
        });
    }
    getRandomColor() {
        return colorList[Math.floor(Math.random() * colorList.length)];
    }
    getFirstText(text) {
        return text ? text.slice(0, 1) : '';
    }

    render() {
        return (
            <View className='avatar' style={{ background: this.state.bg }}>
                {this.getFirstText(this.props.text)}
            </View>
        );
    }
}

export default ComponentHomeNavigation;
