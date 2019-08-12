import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
// import { connect } from "@tarojs/redux";
// import Api from '../../utils/request'
import Tips from '../../utils/tips'
import { propsInterface, stateInterface } from './interface'
import './eventCard.scss'
import { MAINHOST } from '../../config'
import ComponentBaseNavigation from '../../components/ComponentHomeNavigation/componentHomeNavigation'
import ImagePicker from '../../components/imagePicker'
import DateTimePicker from '../../components/DateTimePicker'
import MembersPicker from '../../components/MembersPicker'

// import { } from '../../components'

class EventCard extends Component<propsInterface, stateInterface> {
    config: Config = {
        navigationBarTitleText: '发起活动',
        usingComponents: {
            'van-datetime-picker':
                '../../components/vant-weapp/vant-dist/datetime-picker/index',
            'van-popup': '../../components/vant-weapp/vant-dist/popup/index'
        }
    }
    constructor(props: propsInterface) {
        super(props)
        this.state = {
            description: '',
            endDateTime: '',
            fee: '',
            location: [],
            expireDateTime: '',
            startDateTime: '',
            title: '',
            invitee: [],
            inviteeList: [],
            thumbnail: [],
            files: [],
            loading: false,
            inviteeItem: 0,
            editStatus: true,
            membersChoose: [],
            show: false
        }
    }
    onShow() {
        console.log('onshow')
    }
    componentDidMount() {
        console.log('did mount')
        this.getMember()
    }
    async onSubmit() {
        if (!this.checkForm()) {
            return
        }
       
        this.setState({
            loading: true
        })
       
        const sendData = {
            content: {
                logoInfo: {
                    type: 'string',
                    url: 'string'
                },
                operationInfo: {
                    operationType: 'string',
                    operationValue: 'string'
                },
                tagInfo: 'string',
                timeInfo: 'string',
                title: 'string'
            },
            eventInfo: {
                description: this.state.description,
                endDateTime: this.state.endDateTime,
                fee: this.state.fee,
                location: [],
                expireDateTime: this.state.expireDateTime,
                startDateTime: this.state.startDateTime,
                title: this.state.title
            },
            // initiatorDisplayName: 'binaryify',
            invitee: [
                {
                    content:  this.state.membersChoose.map(item => item.id).join(','),
                    type: 'list'
                }
            ],
            thumbnail: this.state.thumbnail
        }
        console.log({ sendData })

        try {
            await this.$api({
                url: `${MAINHOST}/event`,
                data: sendData,
                method: 'POST'
            })
            Tips.toast('创建成功')
            this.setState({
                loading: false
            })
            Taro.navigateBack()
        } catch (error) {
            this.setState({
                loading: false
            })
        }
    }
    fileChange(val) {
        console.log(val)
    }
    changeEditStatus() {
        this.setState({
            editStatus: !this.state.editStatus
        })
    }
    goChooseMembersPage() {
        Taro.navigateTo({
            url:
                '/pages/membersPicker/index?picklist=' +
                JSON.stringify(this.state.membersChoose)
        })
    }
    getMember() {
        const members = this.$router.params.members
        if (members) {
            this.setState({
                membersChoose: JSON.parse(members)
            })
        }
    }
    imagePickerChange(list) {
        console.log({ list })
        this.setState({
            thumbnail: list
        })
    }
    checkForm() {
        if (!this.state.title) {
            Tips.toast('请输入标题')
            return false
        }
        if (!this.state.description) {
            Tips.toast('请输入描述')
            return false
        } 
        if (!this.state.startDateTime) {
            Tips.toast('请选择活动开始时间')
            return false
        }
        if (!this.state.endDateTime) {
            Tips.toast('请选择活动结束时间')
            return false
        }
        if (!this.state.expireDateTime) {
            Tips.toast('请选择活动过期时间')
            return false
        }

        if (!this.state.fee) {
            Tips.toast('请输入活动费用')
            return false
        }
        return true
    }
    componentDidShow() {
        // console.log(arguments)
    }
    dateChange(val) {
        console.log(val)
    }
    render() {
        return (
            <View className='event-card-wrap'>
                <ComponentBaseNavigation type='child-page' />
                <AtForm onSubmit={() => this.onSubmit()} className='formPanel'>
                    <View className='act-panel'>
                        {this.state.editStatus ? (
                            <AtInput
                                name='value'
                                title=''
                                type='text'
                                placeholder='活动标题'
                                value={this.state.title}
                                onChange={val => {
                                    this.setState({ title: String(val) })
                                }}
                            />
                        ) : (
                            <View className='act-title'>
                                {this.state.title}
                            </View>
                        )}
                        <View
                            className='at-icon at-icon-edit'
                            onClick={() => this.changeEditStatus()}
                        />
                    </View>
                    <View className='register-title-panel'>发起活动</View>
                    <AtInput
                        name='value'
                        title='活动简介'
                        type='text'
                        placeholder='活动简介'
                        value={this.state.description}
                        onChange={val => {
                            this.setState({ description: String(val) })
                        }}
                    />

                    <View className='my-form-item'>
                        <View className='label-item'>活动开始时间</View>
                        <View className='value-item'>
                            <DateTimePicker
                                onchange={val =>
                                    this.setState({ startDateTime: val })
                                }
                                placeholder='请选择活动开始时间'
                            >
                            </DateTimePicker>
                        </View>
                    </View>

                    <View className='my-form-item'>
                        <View className='label-item'>活动结束时间</View>
                        <View className='value-item'>
                            <DateTimePicker
                                onchange={val =>
                                    this.setState({ endDateTime: val })
                                }
                                placeholder='请选择活动结束时间'
                            >
                            </DateTimePicker>
                        </View>
                    </View>

                    <View className='my-form-item'>
                        <View className='label-item'>活动过期时间</View>
                        <View className='value-item'>
                            <DateTimePicker
                                onchange={val =>
                                    this.setState({ expireDateTime: val })
                                }
                                placeholder='请选择活动过期时间'
                            >
                            </DateTimePicker>
                        </View>
                    </View>
                    <AtInput
                        name='value'
                        title='活动费用'
                        type='text'
                        placeholder='活动费用'
                        value={this.state.fee}
                        onChange={val => {
                            this.setState({ fee: String(val) })
                        }}
                    />

                    <View
                        className='my-form-item'
                    >
                        <View className='label-item'>邀请对象</View>
                        <View className='value-item'>
                           <MembersPicker onChange={val=>this.setState({membersChoose:val})} ></MembersPicker>
                        </View>
                    </View>

                    <View className='my-form-item'>
                        <View className='label-item'>附图</View>
                        <View className='value-item'>
                            <ImagePicker
                                onChange={list => this.imagePickerChange(list)}
                            />
                        </View>
                    </View>

                    <AtButton
                        formType='submit'
                        className='sub-button'
                        loading={this.state.loading}
                    >
                        确认发起
                    </AtButton>
                </AtForm>
            </View>
        )
    }
}

export default EventCard
