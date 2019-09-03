import Taro, { PureComponent, Config } from '@tarojs/taro'
import { View, Picker, ScrollView, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { produce } from 'immer'
import { propsInterface, stateInterface } from './interface'
import './style.scss'
import { MAINHOST } from '../../config'
import Avatar from '../../components/Avatar'
import { colorList, roleSelectList } from '../../globalData'


class NoticeCard extends PureComponent<propsInterface, stateInterface> {
    constructor(props: propsInterface) {
        super(props)
        let selectList = JSON.parse(JSON.stringify(roleSelectList))
        selectList[0] = selectList[0].slice(1)
        const branchIndex = selectList[0].indexOf(Taro.getStorageSync('branch'))
        this.state = {
            list: [],
            choooseList: [],
            selector: selectList,
            selectorChecked: [branchIndex, selectList[1].length - 1],
            show: false,
            statusBarHeight: 0,
            first: true
        }
    }
    async componentDidMount() {
        await this.getData()
        if (this.props.idList) {
            this.trans(this.props.idList)
        }
        Taro.getSystemInfo().then(res => {
            console.log({ res: res.statusBarHeight })
            this.setState({
                statusBarHeight: res.statusBarHeight
            })
        })
    }

    componentWillReceiveProps(next) {
        if (this.state.first) {
            if (next.idList) {
                this.trans(next.idList)
                this.setState({
                    first: false
                })
            }
        }
    }
    config: Config = {
        usingComponents: {
            'van-popup': '../../components/vant-weapp/vant-dist/popup/index'
        }
    }
    trans(idList) {
        // console.log('id trans', idList)
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
        this.setState({
            list: res.data
        })
    }
    onChange(e) {
        console.log(e.detail.value)
        const value = e.detail.value
        this.setState(
            {
                selectorChecked: value // 数组
            }, ()=>{
                this.props.onGroupChange(value)
            }
        )
    }
    async closePopup() {
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
    getChoose(){
        let selectList = JSON.parse(JSON.stringify(roleSelectList))
        selectList[0] = selectList[0].slice(1)
        return this.state.choooseList
        .map(item => item.familyName + item.givenName)
        .join('，') + (this.state.choooseList.length > 0 ? '，' : '') + selectList[0][this.state.selectorChecked[0]] + "，" + selectList[1][this.state.selectorChecked[1]] || '请选择成员'
    }

    render() {
        return (
            <View className='members-container'>
                <View className='members-picker-wrap'>
                    <View
                      onClick={() => this.openPopup()}
                      className='chooseText'
                    >
                        {this.getChoose()}
                    </View>
                </View>
                    <View
                      className='picker-modal'
                      style={{
                            height: `calc(100vh - ${this.state.statusBarHeight}px)`,
                            paddingTop: `88rpx`,
                            marginTop: `${this.state.statusBarHeight}px`,
                            display: this.state.show ? 'block' : 'none'
                        }}
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
                        <ScrollView
                          className='scrollview'
                          scrollY
                          style={{
                                height: `calc(100vh - 88rpx - ${this.state.statusBarHeight}px - 80rpx - 100rpx)`
                            }}
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
                        <View className='sub-button-container'>
                            <AtButton
                              onClick={() => this.sub()}
                              className='member-sub-button'
                            >
                                确认添加
                            </AtButton>
                        </View>
                    </View>
                </View>
        )
    }
}

export default NoticeCard
