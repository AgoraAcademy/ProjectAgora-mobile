import Taro, { Component, Config } from '@tarojs/taro'
import { View, Textarea, Input } from '@tarojs/components'
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
const numReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/

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
            show: false,
            initiatorId: null
        }
    }
    onShow() {
        console.log('onshow')
    }
    componentDidMount() {
        console.log('did mount')
        this.getMember()
        console.log(this.$router.params.type)
        if (this.$router.params.type == 'edit') {
            this.getData()
        }
    }
    async getData() {
        const { id } = this.$router.params
        const res = await this.$api({
            url: `${MAINHOST}/event/${id}`
        })
        this.setState({
            description: res.eventInfo.description,
            endDateTime: res.eventInfo.endDateTime,
            fee: res.eventInfo.fee,
            startDateTime: res.eventInfo.startDateTime,
            expireDateTime: res.eventInfo.expireDateTime,
            title: res.eventInfo.title,
            thumbnail: res.thumbnail,
            membersChoose: res.invitee,
            initiatorId: res.initiatorId
        })
    }
    async submit() {
        if (!this.checkForm()) {
            return
        }

        this.setState({
            loading: true
        })

        let sendData:any = {
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
                    content: this.state.membersChoose
                        .map(item => item.id)
                        .join(','),
                    type: 'list'
                }
            ],
            thumbnail: this.state.thumbnail
        }
        if( this.$router.params.type === 'edit'){
            sendData = {
                endDateTime: this.state.endDateTime,
                expireDateTime: this.state.expireDateTime,
                fee: this.state.fee,
                invitee: this.state.membersChoose,
                startDateTime: this.state.startDateTime,
                thumbnail: this.state.thumbnail,
                title: this.state.title,
                description: this.state.description,
            }
        }
        console.log({ sendData })

        try {
            const url =
                this.$router.params.type === 'edit'
                    ? `${MAINHOST}/event/${this.$router.params.id}/patch`
                    : `${MAINHOST}/event`
            await this.$api({
                url: url,
                data: sendData,
                method: 'POST'
            })
            if (this.$router.params.type === 'edit') {
                Tips.toast('保存成功')
            } else {
                Tips.toast('创建成功')
            }

            setTimeout(() => {
                this.setState({
                    loading: false
                })
                Taro.navigateBack()
            }, 1000)
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
        // if (!this.state.expireDateTime) {
        //     Tips.toast('请选择活动过期时间')
        //     return false
        // }
        if (this.state.startDateTime > this.state.endDateTime) {
            Tips.toast('活动结束时间不能小于开始时间')
            return false
        }
        if (
            this.state.expireDateTime &&
            this.state.startDateTime > this.state.expireDateTime
        ) {
            Tips.toast('活动截止时间不能小于开始时间')
            return false
        }
        // if (!this.state.fee) {
        //     Tips.toast('请输入活动费用')
        //     return false
        // }

        if (this.state.fee && !numReg.test(this.state.fee)) {
            Tips.toast('请输入合法的金额')
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
    async del() {
        const { id } = this.$router.params
        const res = await this.$api({
            url: `${MAINHOST}/event/${id}`,
            method: 'DELETE'
        })

        Tips.toast('删除成功')
        setTimeout(() => {
            Taro.navigateBack()
        }, 1000)
    }
    render() {
        return (
            <View className='event-card-wrap'>
                <ComponentBaseNavigation type='child-page' />
                <AtForm className='formPanel'>
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

                    <View className='my-form-item'>
                        <View className='label-item'>活动简介</View>
                        <View className='value-item'>
                            <Textarea
                                placeholder='活动简介'
                                value={this.state.description}
                                onInput={val => {
                                    this.setState({
                                        description: String(val.detail.value)
                                    })
                                }}
                            />
                        </View>
                    </View>
                    <View className='my-form-item'>
                        <View className='label-item'>开始时间</View>
                        <View className='value-item'>
                            <DateTimePicker
                                onchange={val =>
                                    this.setState({ startDateTime: val })
                                }
                                initTime={this.state.startDateTime}
                                placeholder='请选择活动开始时间'
                            />
                        </View>
                    </View>

                    <View className='my-form-item'>
                        <View className='label-item'>结束时间</View>
                        <View className='value-item'>
                            <DateTimePicker
                                onchange={val =>
                                    this.setState({ endDateTime: val })
                                }
                                initTime={this.state.endDateTime}
                                placeholder='请选择活动结束时间'
                            />
                        </View>
                    </View>

                    <View className='my-form-item'>
                        <View className='label-item'>截止时间</View>
                        <View className='value-item'>
                            <DateTimePicker
                                onchange={val =>
                                    this.setState({ expireDateTime: val })
                                }
                                initTime={this.state.expireDateTime}
                                placeholder='请选择活动截止时间'
                            />
                        </View>
                    </View>

                    <View className='my-form-item'>
                        <View className='label-item'>活动费用</View>
                        <View className='value-item'>
                            <Input
                                type='text'
                                placeholder='活动费用'
                                value={this.state.fee}
                                onInput={ev => {
                                    this.setState({ fee: ev.detail.value })
                                }}
                            />
                        </View>
                    </View>

                    <View className='my-form-item'>
                        <View className='label-item'>邀请对象</View>
                        <View className='value-item'>
                            <MembersPicker
                                onChange={val =>
                                    this.setState({ membersChoose: val })
                                }
                            />
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
                        onClick={() => this.submit()}
                        className='sub-button'
                        loading={this.state.loading}
                    >
                        {this.$router.params.type === 'edit'
                            ? '保存'
                            : '确认发起'}
                    </AtButton>
                    {this.state.initiatorId ===
                    +Taro.getStorageSync('learnerId') ? (
                        <AtButton
                            onClick={() => this.del()}
                            className='sub-button red'
                            loading={this.state.loading}
                        >
                            删除
                        </AtButton>
                    ) : null}
                </AtForm>
            </View>
        )
    }
}

export default EventCard
