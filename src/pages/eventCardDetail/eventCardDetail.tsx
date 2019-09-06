import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtForm, AtButton } from 'taro-ui'
import Tips from '../../utils/tips'
import { formatDateFromStr } from '../../utils/common'
import { propsInterface, stateInterface } from './interface'
import './eventCardDetail.scss'
import { MAINHOST } from '../../config'
import ComponentBaseNavigation from '../../components/ComponentHomeNavigation/componentHomeNavigation'

class EventCardDetail extends Component<propsInterface, stateInterface> {
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
            },
            joinStatus: true
        }
    }
    componentDidMount() {
        this.getData()
        Taro.showShareMenu({
            withShareTicket: true
        })
    }
    config: Config = {
        disableScroll: true
    };
    onShareAppMessage(): any {
        // 自定义分享内容
        var shareObj = {
            title: this.state.pageInfo.initiatorDisplayName + "发起了活动:" + this.state.pageInfo.eventInfo.title + ",快参加吧~"
        }
        return shareObj
    }
    getJoinStatus() {
        let flag = false
        if (
            this.state.pageInfo.initiatorId ===
            +Taro.getStorageSync('learnerId')
        ) {
            flag = true
        }
        this.state.pageInfo.rsvp.accept.forEach(item => {
            if (item.id && item.id === Taro.getStorageSync('learnerId')) {
                flag = true
            }
        })
        this.setState({
            joinStatus: flag
        })
    }
    joinList() {
        const acceptList = this.state.pageInfo.rsvp.accept
        return acceptList
            .map(item => {
                return item.fullname
            })
            .filter(n => n)
            .join(',')
    }
    async getData() {
        const { id } = this.$router.params
        Taro.showLoading({ title: '加载中…' })
        const res = await this.$api({
            url: `${MAINHOST}/event/${id}`
        })
        Taro.hideLoading()
        this.setState(
            {
                pageInfo: res.data
            },
            () => {
                this.getJoinStatus()
            }
        )
    }
    formatDate(str) {
        return formatDateFromStr(str).text
    }
    goEdit() {
        Taro.navigateTo({
            url: '/pages/eventCard/eventCard?type=edit&id=' + this.$router.params.id
        })
    }

    async change(status) {
        const sendData = {
            rsvp: status
        }
        const { id } = this.$router.params
        Taro.showLoading({ title: '提交中…' })
        try {
            await this.$api({
                url: `${MAINHOST}/event/${id}/patch`,
                data: sendData,
                method: 'POST'
            })
            Taro.hideLoading()
            return true
        } catch (error) {
            Taro.hideLoading()
            return false
        }
    }
    async join() {
        if (await this.change('参加')) {
            Tips.toast('参加成功')
            setTimeout(() => {
                Taro.navigateBack()
            }, 1000)
        }
    }
    async maybeJoin() {
        if (await this.change('待定')) {
            Tips.toast('设置成功')
            setTimeout(() => {
                Taro.navigateBack()
            }, 1000)
        }
    }
    async cancel() {
        if (await this.change('不参加')) {
            Tips.toast('取消成功')
            setTimeout(() => {
                Taro.navigateBack()
            }, 1000)
        }
    }
    async del() {
        const { id } = this.$router.params
        try {
            await this.$api({
                url: `${MAINHOST}/event/${id}`,
                method: 'DELETE'
            })
            Tips.toast('删除成功')
            setTimeout(() => {
                Taro.navigateBack()
            }, 1000)
        } catch (error) {
            Tips.toast('删除失败')
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
                            {this.state.pageInfo.eventInfo.location[0] ? this.state.pageInfo.eventInfo.location[0].name : ''}
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
                    {this.state.pageInfo.initiatorId ===
                        +Taro.getStorageSync('learnerId') ? (
                            <View>
                                <AtButton
                                  onClick={() => this.goEdit()}
                                  className='sub-button'
                                >
                                    编辑
                                 </AtButton>
                                <AtButton
                                  className='sub-button red'
                                  onClick={() => this.del()}
                                >
                                    删除
                            </AtButton>
                            </View>
                        ) : null}
                    {this.state.joinStatus ?
                        (
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
                        ) : (
                            <View>
                                <AtButton
                                  className='sub-button'
                                  onClick={() => this.join()}
                                >
                                    确认报名
                                </AtButton>
                                <View className='action-panel'>

                                    <View
                                      className='action-item'
                                      onClick={() => this.maybeJoin()}
                                    >
                                        <View className='at-icon at-icon-help icon-help' />
                                        <Text className='text'>可能参加</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                </AtForm>
            </View>
        )
    }
}

export default EventCardDetail
