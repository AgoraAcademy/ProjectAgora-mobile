
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { BookingProps, BookingState } from './booking.interface'
import './booking.scss'

// import { } from '../../components'

// @connect(({ booking }) => ({
//     ...booking,
// }))

class Booking extends Component<BookingProps,BookingState > {
    config:Config = {
        navigationBarTitleText: '房间预约'
    }
    constructor(props: BookingProps) {
        super(props)
        this.state = {}
    }

    

    render() {
        return (
            <View className='booking-wrap'>
            </View>
        )
    }
}

export default Booking
