import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtButton } from 'taro-ui'
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { MAINHOST } from '../../config'
import { homeProps, homeState } from './home.interface'
import './home.scss'
import ComponentBaseNavigation from '../../components/ComponentHomeNavigation/componentHomeNavigation'
import ImageView from '../../components/ImageView/ImageView'
import produce from 'immer'
import classnames from 'classnames'
import Avatar from '../../components/Avatar'
// import { } from '../../components'

// @connect(({ home }) => ({
//     ...home,
// }))

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
        // const pushList = [
        //     {
        //         type: "活动",
        //         title: "篮球",
        //         date: "7月20日",
        //         desc: "中银花园",
        //         projectStatusText: "招募中",
        //         id: 1
        //     },
        //     {
        //         type: "社区",
        //         title: "2019秋季放假安排",
        //         date: "7月20日",
        //         desc: "放假安排描述",
        //         projectStatusText: "招募中",
        //         id: 2
        //     },
        //     {
        //         type: "项目",
        //         title: "安格游戏工作室",
        //         date: "7月20日",
        //         desc:
        //             "安格游戏工作室安格游戏工作室安格游戏工作室安格游戏工作室安格游戏工作室",
        //         projectStatusText: "招募中",
        //         id: 3
        //     },
        //     {
        //         type: "社区",
        //         title: "2019秋季放假安排",
        //         date: "7月20日",
        //         desc: "放假安排描述",
        //         projectStatusText: "招募中",
        //         id: 4
        //     },
        //     {
        //         type: "项目",
        //         title: "安格游戏工作室",
        //         date: "7月20日",
        //         desc:
        //             "安格游戏工作室安格游戏工作室安格游戏工作室安格游戏工作室安格游戏工作室",
        //         projectStatusText: "招募中",
        //         id: 5
        //     }
        // ];
        const noticeList = [
            {
                type: '社区',
                title: '2019秋季放假安排',
                date: '7月20日',
                desc: '放假安排描述',
                projectStatusText: '招募中',
                id: 1
            },
            {
                type: '活动',
                title: '篮球',
                date: '7月20日',
                desc: '中银花园',
                projectStatusText: '招募中',
                id: 2
            }
        ]
        pushList.forEach(item => {
            item['status'] = false
            item['type'] = '活动'
        })
        noticeList.forEach(item => {
            item['status'] = false
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
        Taro.navigateTo({
            url:
                '/pages/eventCardDetail/eventCardDetail?type=' +
                type +
                '&id=' +
                item.id
        })
    }
    cancel(item, event: React.MouseEvent) {
        event.stopPropagation()
        this.toggle(item, event)
    }
    async join(item, event: React.MouseEvent) {
        event.stopPropagation()
        this.toggle(item, event)
    }
    async del(item, event: React.MouseEvent) {
        event.stopPropagation()
        const res = await this.$api({
            url: `${MAINHOST}/event/${item.id}`,
            // data:{
            //     eventId:item.id
            // },
            method:"DELETE"
        })

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
                                <View onClick={this.toggle.bind(this, item)}>
                                    <AtButton className='sub-button'>
                                        报名
                                    </AtButton>
                                </View>

                                <View className='at-icon at-icon-chevron-right icon-right' />
                            </View>
                            {item.status ? (
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
                                    <View
                                        className='action-item'
                                        onClick={this.del.bind(this, item)}
                                    >
                                        <View className='at-icon at-icon-help icon-help' />
                                        <Text className='text'>删除</Text>
                                    </View>
                                </View>
                            ) : null}
                        </View>
                    )
                })
            ) : (
                <View>暂无数据</View>
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
