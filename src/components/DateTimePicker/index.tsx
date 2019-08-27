import Taro, { PureComponent, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

import { StateInterface, PropsInterface } from './interface'
import { formatDate, formatDateFromStr } from '../../utils/common'

class DateTimePicker extends PureComponent<PropsInterface, StateInterface> {
    

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            time: '',
            minTime: new Date().getTime()
        }
    }
    componentWillReceiveProps(next) {
        if (next.initTime) {
            this.setState({
                time: formatDateFromStr(next.initTime).timestamp
            })
        }
        this.setState({
            show: next.show
        })
    }
    config: Config = {
        usingComponents: {
            'van-datetime-picker':
                '../vant-weapp/vant-dist/datetime-picker/index',
            'van-popup': '../vant-weapp/vant-dist/popup/index'
        }
    }
    formatDate(timestamp): string {
        if (!timestamp) return ''
        return formatDate(timestamp).times
    }
    // input(val) {
    //     // console.log('input',val)
    //     // this.props.C(formatDate(val.detail).formatDate)
    //     // this.setState({
    //     //     timeStr: val.detail,
    //     //     time: val.detail
    //     // })
    // }
    closePopup() {
        this.setState({
            show: false
        })
    }
    confirm(val) {
        console.log('confirm')
        console.log(formatDate(val.detail).formatDate)
        this.props.onChange(formatDate(val.detail).formatDate)
        this.setState({
            time: val.detail
        })
        this.closePopup()
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
