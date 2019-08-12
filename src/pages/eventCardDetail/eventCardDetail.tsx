import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtForm, AtButton } from 'taro-ui'
// import { connect } from "@tarojs/redux";
// import Api from '../../utils/request'
import Tips from '../../utils/tips'
import { propsInterface, stateInterface } from './interface'
import './eventCardDetail.scss'
import { MAINHOST } from '../../config'
import ComponentBaseNavigation from '../../components/ComponentHomeNavigation/componentHomeNavigation'
// import { rolesList, branchsList } from '../../globalData'
// import { } from '../../components'

class EventCardDetail extends Component<propsInterface, stateInterface> {
    config: Config = {
        navigationBarTitleText: '活动'
    }
    constructor(props: propsInterface) {
        super(props)
        this.state = {
            pageInfo: {
                eventInfo: {
                    description: '',
                    endDateTime: '',
                    title: ''
                },
                id: 0,
                initiatorDisplayName: '',
                initiatorId: 0,
                invitee: [],
                rsvp: {
                    accept: []
                },
                thumbnail: []
            }
        }
    }
    componentDidMount() {
        this.getData()
    }
    joinStatus() {
        let flag = false
        if (
            this.state.pageInfo.initiatorId ===
            +Taro.getStorageSync('learnerId')
        ) {
            flag=true
        }
        this.state.pageInfo.rsvp.accept.forEach(item => {
            // console.log(Taro.getStorageSync('learnerId'))
            if (item.id && item.id === Taro.getStorageSync('learnerId')) {
                flag = true
            }
        })
        return flag
    }
    formatDate(str) {
        if (!str) return
        const result = str
            .split('+08:00')
            .shift()
            .split('T')
            .join(' ')
            .replace(/-/g, '/')
        return result
    }
    joinList() {
        // let arr: Array<any> = []
        const acceptList = this.state.pageInfo.rsvp.accept
        // for (let key in acceptList) {
        //     arr.push(acceptList[key])
        // }
        return acceptList
            .map(item => {
                return item.fullname
            })
            .filter(n => n)
            .join(',')
    }
    async getData() {
        const { id } = this.$router.params
        const res = await this.$api({
            url: `${MAINHOST}/event/${id}`
        })
        this.setState({
            pageInfo: res
        })
    }
    async change(status) {
        const sendData = {
            rsvp: status
        }
        const { id } = this.$router.params
        const res = await this.$api({
            url: `${MAINHOST}/event/${id}/patch`,
            data: sendData,
            method: 'POST'
        })
       
        if (res.message === 'event updated') {
            return true
        }
        return false

        // if (res.statusCode === 201) {
        //     Tips.toast(res.msg)
        // }
    }
    async join() {
        if (await this.change('参加')) {
            Tips.toast('参加成功')
            setTimeout(()=>{
                Taro.navigateBack()
            },1000)
        }
    }
    async maybeJoin() {
        if (await this.change('待定')) {
            Tips.toast('设置成功')
            setTimeout(()=>{
                Taro.navigateBack()
            },1000)
        }
    }
    async cancel() {
        if (await this.change('不参加')) {
            Tips.toast('取消成功')
            setTimeout(()=>{
                Taro.navigateBack()
            },1000)
        }
    }
    render() {
        return (
            <View className='event-card-detail-wrap'>
                <ComponentBaseNavigation type='child-page' />
                <AtForm className='formPanel'>
                    <View className='act-panel'>
                        <View className='act-title'>
                            {this.state.pageInfo.eventInfo.title}
                        </View>
                    </View>
                    <View className='register-title-panel'>报名活动</View>
                    <View className='my-form-item'>
                        <View className='label-item'>活动简介</View>
                        <View className='value-item'>
                            {this.state.pageInfo.eventInfo.description}
                        </View>
                    </View>
                    <View className='my-form-item'>
                        <View className='label-item'>发起人</View>
                        <View className='value-item'>
                            {this.state.pageInfo.initiatorDisplayName}
                        </View>
                    </View>
                    <View className='my-form-item'>
                        <View className='label-item'>活动时间</View>
                        <View className='value-item'>
                            {this.formatDate(
                                this.state.pageInfo.eventInfo.startDateTime
                            )}
                        </View>
                    </View>
                    <View className='my-form-item'>
                        <View className='label-item'>活动地点</View>
                        <View className='value-item'>
                            {this.state.pageInfo.eventInfo.location}
                        </View>
                    </View>
                    <View className='my-form-item'>
                        <View className='label-item'>活动费用</View>
                        <View className='value-item'>
                            {this.state.pageInfo.eventInfo.fee}
                        </View>
                    </View>
                    <View className='my-form-item'>
                        <View className='label-item'>结束时间</View>
                        <View className='value-item'>
                            {this.formatDate(
                                this.state.pageInfo.eventInfo.endDateTime
                            )}
                        </View>
                    </View>
                    <View className='my-form-item'>
                        <View className='label-item'>截止时间</View>
                        <View className='value-item'>
                            {this.formatDate(
                                this.state.pageInfo.eventInfo.expireDateTime
                            )}
                        </View>
                    </View>
                    <View className='my-form-item'>
                        <View className='label-item'>已报名</View>
                        <View className='value-item'>{this.joinList()}</View>
                    </View>

                    {this.joinStatus() ? null : (
                        <AtButton
                            className='sub-button'
                            onClick={() => this.join()}
                        >
                            确认报名
                        </AtButton>
                    )}

                    <View className='action-panel'>
                        <View
                            className='action-item'
                            onClick={() => this.cancel()}
                        >
                            <View className='at-icon at-icon-close icon-close' />
                            <Text className='text'>取消</Text>
                        </View>
                        <View
                            className='action-item'
                            onClick={() => this.maybeJoin()}
                        >
                            <View className='at-icon at-icon-help icon-help' />
                            <Text className='text'>可能参加</Text>
                        </View>
                    </View>
                </AtForm>
            </View>
        )
    }
}

export default EventCardDetail
