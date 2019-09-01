import Taro, { PureComponent, Config } from '@tarojs/taro'
import { View, Picker, ScrollView, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { produce } from 'immer'
// import { connect } from "@tarojs/redux";
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { propsInterface, stateInterface } from './interface'
import './style.scss'
import { MAINHOST } from '../../config'
// import ComponentBaseNavigation from '../../components/ComponentHomeNavigation/componentHomeNavigation'
import Avatar from '../../components/Avatar'
import { colorList, roleSelectList } from '../../globalData'

// import { } from '../../components'

class NoticeCard extends PureComponent<propsInterface, stateInterface> {
    constructor(props: propsInterface) {
        super(props)
        this.state = {
            list: [],
            choooseList: [],
            selector: roleSelectList,
            selectorChecked: [],
            show: false,
            statusBarHeight: 0
        }
    }
    async componentDidMount() {
        await this.getData()
        if (this.props.idList) {
            this.trans(this.props.idList)
        }
        Taro.getSystemInfo().then(res => {
            
            // console.log({ res })
            this.setState({
                statusBarHeight: res.statusBarHeight
            })
        })
    }

    componentWillReceiveProps(next) {
        if (next.idList) {
            this.trans(next.idList)
        }
        this.setState({
            show: next.show
        })
    }
    config: Config = {
        usingComponents: {
            'van-popup': '../../components/vant-weapp/vant-dist/popup/index'
        }
    }
    trans(idList) {
        console.log('id trans', idList)
        let arr: Array<any> = []
        idList.forEach(item => {
            this.state.list.forEach(cell => {
                if (cell.id === item.id) {
                    arr.push(cell)
                }
            })
        })
        console.log({ arr })
        this.setState({
            choooseList: arr
        })
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
                if (cell.id === item.id) {
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
    async getData() {
        const res = await this.$api({
            url: `${MAINHOST}/learner`
        })
        console.log(res.data, '000')
        this.setState({
            list: res.data
        })
    }
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
        this.props.onShowChange(false)
    }
    async openPopup() {
        await this.getData()
        this.setState({ show: true })
        this.props.onShowChange(true)
    }
    sub() {
        this.props.onChange(this.state.choooseList)
        this.closePopup()
    }

    render() {
        return (
            <View className='members-picker-wrap'>
                <View onClick={() => this.openPopup()} className='chooseText'>
                    {this.state.choooseList
                        .map(item => item.familyName + item.givenName)
                        .join(',') || '请选择成员'}
                </View>
                <van-popup
                  position='bottom'
                  show={this.state.show}
                  onclick-overlay={() => {
                        this.closePopup()
                    }}
                >
                    <View className='picker-container' style={
                            { height: `calc(100vh - 88rpx - ${this.state.statusBarHeight}px)` }}
                    >
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
                                            <View className='avatar-container'>
                                                <Avatar
                                                  text={
                                                        item.familyName +
                                                        item.givenName
                                                    }
                                                  size='40rpx'
                                                />
                                            </View>
                                            <Text>
                                                {item.familyName +
                                                    item.givenName}
                                            </Text>
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
                        <ScrollView className='scrollview' scrollY  style={
                            { height: `calc(100vh - 88rpx - ${this.state.statusBarHeight}px - 80rpx)` }}
                        >
                            {this.state.list.map(item => {
                                return (
                                    <View
                                      className='li-item'
                                      key={item.id}
                                      onClick={() => this.pickMember(item)}
                                    >
                                        <Avatar
                                          text={
                                                item.familyName + item.givenName
                                            }
                                        />
                                        <View className='right-info'>
                                            <View className='name'>
                                                {item.familyName +
                                                    item.givenName}
                                            </View>
                                            {/* <View className='email'>
                                                {item.email}
                                            </View> */}
                                        </View>
                                    </View>
                                )
                            })}
                        </ScrollView>
                      
                    </View>
                    <View className='sub-button-container' style={{ bottom: `-${this.state.statusBarHeight}px` }}>
                            <AtButton
                              onClick={() => this.sub()}
                              className='member-sub-button'
                            >
                                确认添加
                            </AtButton>
                        </View>
                </van-popup>
            </View>
        )
    }
}

export default NoticeCard
