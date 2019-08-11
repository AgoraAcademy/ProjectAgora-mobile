import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

import { StateInterface, PropsInterface } from './interface'
import { formatDate } from '../../utils/common'
class DateTimePicker extends Component<PropsInterface, StateInterface> {
    config: Config = {
        usingComponents: {
            'van-datetime-picker': '../vant-weapp/vant-dist/datetime-picker/index',
            'van-popup': '../vant-weapp/vant-dist/popup/index'
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            timeStr: '',
            time: '',
            minTime: new Date().getTime()
        }
    }
    formatDate(timestamp): string {
        return formatDate(timestamp).times
    }
    input(val) {
        console.log('input',val)
        this.props.onchange(formatDate(val.detail).formatDate)
        this.setState({
            timeStr: val.detail,
            time: val.detail
        })
    }
    closePopup() {
        this.setState({
            show: false
        })
    }
    confirm(val) {
        console.log('confirm')
        this.props.onchange(formatDate(val.detail).formatDate)
        this.closePopup()
    }
    componentWillReceiveProps(next) {
        this.setState({
            show: next.show
        })
    }
    render() {
        return (
            <View>
                <View onClick={() => this.setState({ show: true })}>
                    {this.formatDate(this.state.time) ||
                        (this.props.placeholder || '请选择时间')}
                </View>
                <van-popup position='bottom' show={this.state.show}>
                    <van-datetime-picker
                        type='datetime'
                        onInput={val => this.input(val)}
                        onConfirm={val => this.confirm(val)}
                        onCancel={() => this.closePopup()}
                        value={this.state.time}
                        min-date={this.state.minTime}
                    />
                </van-popup>
            </View>
        )
    }
}

export default DateTimePicker
