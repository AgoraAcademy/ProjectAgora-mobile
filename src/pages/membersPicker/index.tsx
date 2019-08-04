import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Input, Picker, ScrollView } from '@tarojs/components'
import { AtTag, AtButton } from 'taro-ui'
import produce from 'immer'
// import { connect } from "@tarojs/redux";
// import Api from '../../utils/request'
import Tips from '../../utils/tips'
import { propsInterface, stateInterface } from './interface'
import './style.scss'
import { MAINHOST } from '../../config'
import ComponentBaseNavigation from '../../components/ComponentHomeNavigation/componentHomeNavigation'
import Avatar from '../../components/Avatar'
import { colorList } from '../../globalData'

// import { } from '../../components'

class NoticeCard extends Component<propsInterface, stateInterface> {
    config: Config = {
        navigationBarTitleText: ''
    }
    constructor(props: propsInterface) {
        super(props)
        this.state = {
            list: [
                { id: 1, name: '刘德华', email: 'test@qq.com' },
                { id: 2, name: '周润发', email: 'test@qq.com' },
                { id: 3, name: '孙燕姿', email: 'test@qq.com' },
                { id: 4, name: '刘德华', email: 'test@qq.com' },
                { id: 5, name: '周润发', email: 'test@qq.com' },
                { id: 6, name: '孙燕姿', email: 'test@qq.com' },
                { id: 7, name: '刘德华', email: 'test@qq.com' },
                { id: 8, name: '周润发', email: 'test@qq.com' },
                { id: 9, name: '孙燕姿', email: 'test@qq.com' }
            ],
            choooseList: [],
            selector: [
                ['深圳.安格', '成都.先锋', '所有校区'],
                ['社区成员', '全职导师', '所有成员']
            ],
            selectorChecked: []
        }
    }
    componentDidMount() {}
    getRandomColor() {
        return colorList[Math.floor(Math.random() * colorList.length)]
    }
    pickMember(item) {
        let needChange = false
        const arr = produce(this.state.choooseList, draft => {
            const flag = draft.some(cell => {
                return cell.id === item.id
            })
            if (flag) {
            } else {
                needChange = true
                draft.push(item)
            }
            return draft
        })
        if (needChange) {
            this.setState({
                choooseList: arr
            })
        }
    }
    removeMember(item) {
        let needChange = false
        const arr = produce(this.state.choooseList, draft => {
            draft.forEach((cell, index) => {
                if (cell.id == item.id) {
                    needChange = true
                    draft.splice(index, 1)
                }
            })
            return draft
        })
        if (needChange) {
            this.setState({
                choooseList: arr
            })
        }
    }
    async getData() {}
    onChange(e) {
        this.setState(
            {
                selectorChecked: e.detail.value // 数组
            },
            () => {
                this.getData()
            }
        )
    }
    sub() {
        const pages = Taro.getCurrentPages()
        const prevPage = pages[pages.length - 2]
        // console.log({
        //     [this.$router.params.key]:  JSON.stringify(this.state.choooseList)
        // })
        // console.log(prevPage.$component,this.state.choooseList)

        Taro.navigateTo({
            url:
                '/' +
                prevPage.route +
                '?members=' +
                JSON.stringify(this.state.choooseList),
            fail: function() {
                wx.switchTab({
                    url: '/' + prevPage.route
                })
            }
        })
    }
    render() {
        return (
            <View className='members-picker-wrap'>
                <ComponentBaseNavigation type='picker-page' />
                <View>
                    <View className='tags-box'>
                        <View className='tags-container'>
                            {this.state.choooseList.map(item => {
                                return (
                                    <View
                                        className='tag'
                                        onClick={() => this.removeMember(item)}
                                        key={item.id}
                                    >
                                        {item.name}
                                    </View>
                                )
                            })}
                        </View>
                        <Picker
                            value={this.state.selectorChecked}
                            mode='multiSelector'
                            range={this.state.selector}
                            onChange={this.onChange}
                        >
                            <View className='picker-button'>添加群组</View>
                        </Picker>
                    </View>
                    <ScrollView className='scrollview' scrollY>
                        {this.state.list.map(item => {
                            return (
                                <View
                                    className='li-item'
                                    key={item.id}
                                    onClick={() => this.pickMember(item)}
                                >
                                    <Avatar text={item.name} />
                                    <View className='right-info'>
                                        <View className='name'>
                                            {item.name}
                                        </View>
                                        <View className='email'>
                                            {item.email}
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                    <AtButton className='sub-button' onClick={() => this.sub()}>
                        确认添加
                    </AtButton>
                </View>
            </View>
        )
    }
}

export default NoticeCard
