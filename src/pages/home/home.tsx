import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, ScrollView, Block } from '@tarojs/components'
import { AtButton } from 'taro-ui'
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
import Tips from '../../utils/tips'
import { MAINHOST } from '../../config'
import { homeProps, homeState } from './home.interface'
import './home.scss'
import ComponentBaseNavigation from '../../components/ComponentHomeNavigation/componentHomeNavigation'
// import ImageView from '../../components/ImageView/ImageView'
import produce from 'immer'
import classnames from 'classnames'
import Avatar from '../../components/Avatar'

class home extends Component<homeProps, homeState> {
    config: Config = {
        navigationBarTitleText: ''
    }
    constructor(props: homeProps) {
        super(props)
        this.state = {
            pushList: [],
            chooseType: 'push',
            noticeList: [],
            members: []
        }
    }
    async getData() {
        const res = await this.$api({
            url: `${MAINHOST}/event`
        })
        console.log({
            res
        })
        const pushList = res

        const noticeList = [
            {
                eventInfo: {
                    description: 'test desc',
                    endDateTime: '2019-08-12T17:22:00+08:00',
                    expireDateTime: '2019-08-13T17:22:00+08:00',
                    fee: '12',
                    location: [],
                    startDateTime: '2019-08-10T17:22:09+08:00',
                    title: '假数据'
                },
                id: 5,
                initiatorDisplayName: '\u8096\u6625\u817e',
                initiatorId: 1,
                invitee: [
                    {
                        content: '',
                        type: 'list'
                    }
                ]
            },
            {
                eventInfo: {
                    description: 'test desc',
                    endDateTime: '2019-08-12T17:22:00+08:00',
                    expireDateTime: '2019-08-13T17:22:00+08:00',
                    fee: '12',
                    location: [],
                    startDateTime: '2019-08-10T17:22:09+08:00',
                    title: '假数据'
                },
                id: 6,
                initiatorDisplayName: '\u8096\u6625\u817e',
                initiatorId: 1,
                invitee: [
                    {
                        content: '',
                        type: 'list'
                    }
                ]
            },
            {
                eventInfo: {
                    description: 'test desc',
                    endDateTime: '2019-08-12T17:22:00+08:00',
                    expireDateTime: '2019-08-13T17:22:00+08:00',
                    fee: '12',
                    location: [],
                    startDateTime: '2019-08-10T17:22:09+08:00',
                    title: '假数据'
                },
                id: 7,
                initiatorDisplayName: '\u8096\u6625\u817e',
                initiatorId: 1,
                invitee: [
                    {
                        content: '',
                        type: 'list'
                    }
                ]
            }
        ]

        pushList.forEach(item => {
            item['status'] = false
            item['type'] = '活动'
        })
        noticeList.forEach(item => {
            item['status'] = false
            item['type'] = '活动'
        })

        this.setState({
            pushList,
            noticeList
        })
    }
    componentDidShow() {
        console.log(this.$router.params)
        this.getData()
    }

    // componentDidMount() {
    //     this.getData();

    // }
    goDetail(type, item) {
        console.log({
            item
        })
        if(item.initiatorId===+Taro.getStorageSync('learnerId')){
            console.log("自己的")
            Taro.navigateTo({
                url:
                    '/pages/eventCard/eventCard?type=edit&id=' +
                    item.id
            })
        }else{
            Taro.navigateTo({
                url:
                    '/pages/eventCardDetail/eventCardDetail?type=' +
                    type +
                    '&id=' +
                    item.id
            })
        }
        
    }
    async cancel(item, event: React.MouseEvent) {
        event.stopPropagation()
        event.stopPropagation()
        if (await this.change('不参加', item)) {
            Tips.toast('取消成功')
            Taro.navigateBack()
        }
        this.getData()
    }
    async change(status, item) {
        const sendData = {
            rsvp: status
        }
        const id = item.id
        const res = await this.$api({
            url: `${MAINHOST}/event/${id}/patch`,
            data: sendData,
            method: 'POST'
        })
        console.log({
            res
        })
        if (res.message === 'event updated') {
            return true
        }
        return false
    }
    async join(item, event: React.MouseEvent) {
        event.stopPropagation()
        if (await this.change('参加', item)) {
            Tips.toast('参加成功')
        }

        this.toggle(item, event)
    }
    async del(item, event: React.MouseEvent) {
        event.stopPropagation()
        const res = await this.$api({
            url: `${MAINHOST}/event/${item.id}`,
            // data:{
            //     eventId:item.id
            // },
            method: 'DELETE'
        })
        this.getData()
    }
    toggle(item, event: React.MouseEvent) {
        // console.log({ event ,item});
        event.stopPropagation()
        const type =
            this.state.chooseType === 'push' ? 'pushList' : 'noticeList'
        const list = produce(this.state[type], draftState => {
            draftState.forEach(active => {
                if (active.id === item.id) {
                    active.status = !item.status
                }
            })
        })

        if (type === 'pushList') {
            this.setState({
                pushList: list
            })
        } else {
            this.setState({
                noticeList: list
            })
        }
        // do something...
    }
    getBg(type) {
        return {
            活动: 'green',
            社区: 'red',
            项目: 'blue',
            预约: 'orange',
            计划: 'yellow'
        }[type]
    }
    render() {
        const data =
            this.state.chooseType === 'push'
                ? this.state.pushList
                : this.state.noticeList
        const listComponent =
            data.length > 0 ? (
                data.map(item => {
                    return (
                        <View
                            key={item.id}
                            className={classnames('li-ele card', {
                                active: item.status
                            })}
                            onClick={() => {
                                this.goDetail(this.state.chooseType, item)
                            }}
                        >
                            <View className='main-panel'>
                                <View
                                    className={classnames(
                                        'tag',
                                        this.getBg(item.type)
                                    )}
                                >
                                    {item.type}
                                </View>
                                <View className='left-panel'>
                                    <View className='avatar'>
                                        <Avatar text={item.eventInfo.title} />
                                    </View>
                                    {/* <ImageView img-class="avatar" pathId=""></ImageView> */}
                                    <View
                                        className='status-button'
                                        style={
                                            item.type === '项目'
                                                ? ''
                                                : 'display:none'
                                        }
                                    >
                                        招募中
                                    </View>
                                </View>
                                <View className='infoPanel'>
                                    <View className='title'>
                                        {item.eventInfo.title}
                                    </View>
                                    <View className='date'>
                                        {item.eventInfo.startDate}
                                    </View>
                                    <View className='desc'>
                                        {item.eventInfo.description}
                                    </View>
                                </View>
                                {item.initiatorId ===
                                +Taro.getStorageSync('learnerId') ? (
                                    <View
                                        onClick={this.del.bind(this, item)}
                                    >
                                        <AtButton className='sub-button'>
                                            删除
                                        </AtButton>
                                    </View>
                                ) : (
                                    <View
                                        onClick={this.toggle.bind(this, item)}
                                    >
                                        <AtButton className='sub-button'>
                                            报名
                                        </AtButton>
                                    </View>
                                )}

                                <View className='at-icon at-icon-chevron-right icon-right' />
                            </View>
                            {item.status &&
                            item.initiatorId !==
                                +Taro.getStorageSync('learnerId') ? (
                                <View className='action-panel'>
                                    <View
                                        className='action-item'
                                        onClick={this.cancel.bind(this, item)}
                                    >
                                        <View className='at-icon at-icon-close icon-close' />
                                        <Text className='text'>取消</Text>
                                    </View>
                                    <View
                                        className='action-item'
                                        onClick={this.join.bind(this, item)}
                                    >
                                        <View className='at-icon at-icon-help icon-help' />
                                        <Text className='text'>可能参加</Text>
                                    </View>
                                </View>
                            ) : null}
                        </View>
                    )
                })
            ) : (
                <View className='no-data'>暂无数据</View>
            )
        const tabList = [
            {
                type: 'push',
                name: '推送',
                iconClass: 'at-icon-bookmark'
            },
            {
                type: 'notice',
                name: '提醒',
                iconClass: 'at-icon-bell'
            }
        ]
        return (
            <View className='home-wrap'>
                <ComponentBaseNavigation type='normal-page' />
                <ScrollView
                    className='scrollview'
                    scrollY
                    style={
                        this.state.chooseType === 'push' ? '' : 'display:none'
                    }
                >
                    <View className='ul-ele'>{listComponent}</View>
                </ScrollView>

                <ScrollView
                    className='scrollview'
                    scrollY
                    style={
                        this.state.chooseType === 'notice' ? '' : 'display:none'
                    }
                >
                    <View className='ul-ele'>{listComponent}</View>
                </ScrollView>

                <View className='bottom-tab-panel'>
                    {tabList.map(item => {
                        return (
                            <View
                                className={classnames('tab-item', {
                                    active: this.state.chooseType === item.type
                                })}
                                onClick={() => {
                                    this.setState({ chooseType: item.type })
                                }}
                                key={item.type}
                            >
                                <View
                                    className={classnames(
                                        'at-icon',
                                        item.iconClass
                                    )}
                                />

                                <Text>{item.name}</Text>
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }
}

export default home
