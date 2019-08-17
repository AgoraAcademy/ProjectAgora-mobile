import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker, ScrollView } from '@tarojs/components'
import {  AtButton } from 'taro-ui'
import { produce } from 'immer'
// import { connect } from "@tarojs/redux";
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { propsInterface, stateInterface } from './interface'
import './style.scss'
// import { MAINHOST } from '../../config'
// import ComponentBaseNavigation from '../../components/ComponentHomeNavigation/componentHomeNavigation'
import Avatar from '../../components/Avatar'
import { colorList, roleSelectList } from '../../globalData'

// import { } from '../../components'

class NoticeCard extends Component<propsInterface, stateInterface> {
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
            selector: roleSelectList,
            selectorChecked: [],
            show: false
        }
    }
    componentDidMount() {
        if (this.$router.params.picklist) {
            const list = JSON.parse(this.$router.params.picklist)
            this.setState({
                choooseList: list
            })
        }
    }
    config: Config = {
        navigationBarTitleText: '发起活动',
        usingComponents: {
            'van-popup': '../../components/vant-weapp/vant-dist/popup/index'
        }
    }
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
    closePopup() {
        this.setState({
            show: false
        })
    }
    sub() {
        this.props.onChange(this.state.choooseList)
        this.closePopup()
    }
    
    render() {
        return (
            <View className='members-picker-wrap'>
                <View onClick={() => this.setState({ show: true })}>
                    {this.state.choooseList.map(item => item.email).join(',') ||
                        '请选择成员'}
                </View>
                <van-popup position='bottom' show={this.state.show} onclick-overlay={()=>{ this.closePopup() }}>
                    <View className='picker-container'>
                        <View className='tags-box'>
                            <View className='tags-container'>
                                {this.state.choooseList.map(item => {
                                    return (
                                        <View
                                          className='tag'
                                          onClick={() =>
                                                this.removeMember(item)
                                            }
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
                        <View className='sub-button-container'>
                            <AtButton
                              onClick={() => this.sub()}
                              className='sub-button'
                            >
                                确认添加
                            </AtButton>
                        </View>
                    </View>
                </van-popup>
            </View>
        )
    }
}

export default NoticeCard
