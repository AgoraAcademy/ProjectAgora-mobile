import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';

@connect(({BookRoom}) => ({
    ...BookRoom,
}))
export default class Bookroom extends Component {
    config = {
    navigationBarTitleText: 'BookRoom',
    };
    componentDidMount = () => {
    };
    render() {
        return (
            <View className="BookRoom-page">
                BookRoom
            </View>
        )
    }
}
