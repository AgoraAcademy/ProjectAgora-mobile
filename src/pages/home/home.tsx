import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import classnames from 'classnames'
import { AtButton } from 'taro-ui'
import { produce } from 'immer'
import Tips from '../../utils/tips'
import { MAINHOST } from '../../config'
import { homeProps, homeState } from './home.interface'
import './home.scss'
import ComponentBaseNavigation from '../../components/ComponentHomeNavigation/componentHomeNavigation'
import Avatar from '../../components/Avatar'
import { formatDate } from '../../utils/common'

class home extends Component<homeProps, homeState> {
    constructor(props: homeProps) {
        super(props)
        this.state = {
            pushList: [],
            chooseType: 'push',
            noticeList: [],
            members: [],
            statusBarHeight: 0,
            isIPX: false,
            refreshing: false, // 将refreshing设为true，可支持自动触发下拉刷新的场景。同样会触发refresh事件
            refreshed: false, // 将本属性设置为true，收起下拉刷新，可多次设置为true（即便原来已经是true了）
        }
    }

    componentDidMount() {
        Taro.showShareMenu({
            withShareTicket: true
        })
        Taro.getSystemInfo().then(res => {
            if (res.model.search('iPhone X') > -1) {
                this.setState({
                    isIPX: true
                })
            }
            // console.log({ res })
            this.setState({
                statusBarHeight: res.statusBarHeight
            })
        })
        console.log(this.$router.params)

    }
    config: Config = {
        usingComponents: {
            "pulldown-refresh": '../../components/pullDownRefresh/pullDownRefresh'
        },
        navigationBarTitleText: '首页',
        disableScroll: true
    }
    onShareAppMessage(): any {
        // 自定义分享内容
        var shareObj = {
            title: '首页'
        }
        return shareObj
    }
    finishRefresh() {
        // console.log('refresh')
        this.setState({
            refreshed: true
        }, () => {
            this.setState({
                refreshed: false,
                refreshing: false
            })
        })
    }
    async _renderNoticeList() {
        const res = await this.$api({
            url: `${MAINHOST}/notification`
        })
        // console.log({
        //     res
        // })
        const noticeList = res.data
        noticeList.forEach(item => {
            item['status'] = false
        })
        this.setState({
            noticeList
        }, () => {
            this.finishRefresh()
        })
    }
    async _renderPushList() {
        try {
            const res = await this.$api({
                url: `${MAINHOST}/pushMessage`
            })
            // console.log({
            //     res
            // })
            const pushList = res.data

            pushList.forEach(item => {
                item['status'] = false
            })

            this.setState({
                pushList
            }, () => {
                this.finishRefresh()
            })
        } catch (error) {
            console.log(error)
            return Promise.reject()
        }
    }
    async componentDidShow() {
        await this._renderPushList()
        this._renderNoticeList()
    }

    goEdit(type, item, event) {
        event.stopPropagation()
        Taro.navigateTo({
            url: '/pages/eventCard/eventCard?type=edit&id=' + item.entityId
        })
    }
    goDetail(type, item) {
        console.log({
            item
        })
        Taro.navigateTo({
            url:
                '/pages/eventCardDetail/eventCardDetail?type=' +
                type +
                '&id=' +
                item.entityId
        })
    }
    async cancel(item, event) {
        event.stopPropagation()
        event.stopPropagation()
        if (await this.change('不参加', item)) {
            Tips.toast('取消成功')
            Taro.navigateBack()
        }
        this._renderPushList()
    }
    async change(status, item) {
        const sendData = {
            rsvp: status
        }
        const id = item.id
        try {
            await this.$api({
                url: `${MAINHOST}/event/${id}/patch`,
                data: sendData,
                method: 'POST'
            })
            return true
        } catch (error) {
            return false
        }
    }
    async join(item, event) {
        event.stopPropagation()
        if (await this.change('参加', item)) {
            Tips.toast('参加成功')
            this._renderPushList()
        }
    }
    async del(item, event) {
        event.stopPropagation()
        try {
            await this.$api({
                url: `${MAINHOST}/event/${item.id}`,
                // data:{
                //     eventId:item.id
                // },
                method: 'DELETE'
            })
            this._renderPushList()
        } catch (err) { }
    }
    toggle(item, event) {
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
    hadJoin(rsvp) {
        if (!rsvp || !rsvp.accept) {
            return false
        }
        return rsvp.accept.some(item => {
            item.id === +Taro.getStorageSync('learnerId')
        })
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
    toggleBottomTab(type) {
        if (this.state.chooseType === type) {
            return
        }
        this.setState({ chooseType: type }, () => {
            switch (type) {
                case 'push':
                    this._renderPushList()
                    break
                case 'notice':
                    this._renderNoticeList()
                    break
            }
        })

    }
    render() {
        const data =
            this.state.chooseType === 'push'
                ? this.state.pushList
                : this.state.noticeList
        const listComponent =
            data.length > 0 ? (
                data.map(item => {
                    const time = item.content.timeInfo ? item.content.timeInfo.split('-') : ['0', '0']
                    const startTime = formatDate(time[0]).simpleTimes
                    const endTime = formatDate(time[1]).simpleTimes
                    return (
                        <View
                          key={item.id}
                          className={classnames('li-ele card', {
                                active: this.hadJoin(item.rsvp)
                            })}
                          onClick={() => {
                                this.goDetail(this.state.chooseType, item)
                            }}
                        >
                            <View className='main-panel'>
                                <View
                                  className={classnames(
                                        'tag',
                                        this.getBg(item.content.tagInfo)
                                    )}
                                >
                                    {item.content.tagInfo}
                                </View>
                                <View className='left-panel'>
                                    <View className='avatar'>
                                        <Avatar text={item.content.title} />
                                    </View>
                                    {/* <ImageView img-class="avatar" pathId=""></ImageView> */}
                                </View>
                                <View className='infoPanel'>
                                    <View className='title'>
                                        {item.content.title}
                                    </View>
                                    <View className='date'>
                                        {startTime + '-' + endTime}
                                    </View>
                                    <View className='desc'>
                                        {item.content.description}
                                    </View>
                                </View>
                                {item.senderId ===
                                    +Taro.getStorageSync('learnerId') ? (
                                        <View
                                          onClick={this.goEdit.bind(
                                                this,
                                                this.state.chooseType,
                                                item
                                            )}
                                        >
                                            <AtButton className='sub-button'>
                                                编辑
                                        </AtButton>
                                        </View>
                                    ) : this.hadJoin(item.rsvp) ? (
                                        <View
                                          onClick={this.toggle.bind(this, item)}
                                        >
                                            <AtButton className='sub-button'>
                                                已报名
                                        </AtButton>
                                        </View>
                                    ) : (
                                            <View onClick={this.join.bind(this, item)}>
                                                <AtButton className='sub-button'>
                                                    报名
                                        </AtButton>
                                            </View>
                                        )}

                                <View className='at-icon at-icon-chevron-right icon-right' />
                            </View>
                            {item.status &&
                                item.senderId !==
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

        const noticeListComponent =
            data.length > 0 ? (
                data.map(item => {
                    // const time = item.content.timeInfo.split('-')
                    const startTime = formatDate(new Date(item.content.startDateTime)).simpleTimes
                    const endTime = formatDate(new Date(item.content.endDateTime)).simpleTimes
                    return (
                        <View
                          key={item.id}
                          className={classnames('li-ele card', {
                                active: this.hadJoin(item.rsvp)
                            })}
                          onClick={() => {
                                this.goDetail(this.state.chooseType, item)
                            }}
                        >
                            <View className='main-panel'>
                                <View
                                  className={classnames(
                                        'tag',
                                        this.getBg(item.content.tagInfo)
                                    )}
                                >
                                    {item.content.tagInfo}
                                </View>
                                <View className='left-panel'>
                                    <View className='avatar'>
                                        <Avatar text={item.title} />
                                    </View>
                                    {/* <ImageView img-class="avatar" pathId=""></ImageView> */}
                                </View>
                                <View className='infoPanel'>
                                    <View className='title'>
                                        {item.title}
                                    </View>
                                    <View className='date'>
                                        {startTime + '-' + endTime}
                                    </View>
                                    <View className='desc'>
                                        {item.description}
                                    </View>
                                </View>
                                <View
                                  onClick={this.goEdit.bind(
                                        this,
                                        this.state.chooseType,
                                        item
                                    )}
                                >
                                    <AtButton className='sub-button'>
                                        改期
                                        </AtButton>
                                </View>

                                <View className='at-icon at-icon-chevron-right icon-right' />
                            </View>
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
                <pulldown-refresh refreshing={this.state.refreshing} refreshed={this.state.refreshed} onRefresh={() => this._renderPushList()}>
                    <ScrollView
                      className='scrollview'
                      scrollY
                      style={
                            this.state.chooseType === 'push'
                                ? 'height:calc(100vh - ' +
                                '134rpx' +
                                ' - ' +
                                this.state.statusBarHeight +
                                'px' +
                                //   (this.state.isIPX ? " - 44rpx " : '') +
                                ' - 88rpx' +
                                ')'
                                : 'display:none;'
                        }
                    >
                        <View className='ul-ele'>{listComponent}</View>
                    </ScrollView>
                </pulldown-refresh>
                <pulldown-refresh refreshing={this.state.refreshing} refreshed={this.state.refreshed} onRefresh={() => this._renderNoticeList()}>
                    <ScrollView
                      className='scrollview'
                      scrollY
                      style={
                            this.state.chooseType === 'notice'
                                ? 'height:calc(100vh - ' +
                                '134rpx' +
                                ' - ' +
                                this.state.statusBarHeight +
                                'px' +
                                ' - 88rpx' +
                                ')'
                                : 'display:none;'
                        }
                    >
                        <View className='ul-ele'>{noticeListComponent}</View>
                    </ScrollView>
                </pulldown-refresh>
                <View className='bottom-tab-panel-container'>
                    <View className='bottom-tab-panel'>
                        {tabList.map(item => {
                            return (
                                <View
                                  className={classnames('tab-item', {
                                        active:
                                            this.state.chooseType === item.type
                                    })}
                                  onClick={() => {
                                        this.toggleBottomTab(item.type)
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
            </View>
        )
    }
}

export default home
