import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
// import { connect } from "@tarojs/redux";
// import Api from '../../utils/request'
import Tips from '../../utils/tips'
import { propsInterface, stateInterface } from './interface'
import './eventCard.scss'
import { MAINHOST } from '../../config'
import ComponentBaseNavigation from '../../components/ComponentHomeNavigation/componentHomeNavigation'
import ImagePicker from '../../components/imagePicker'

// import { } from '../../components'

class EventCard extends Component<propsInterface, stateInterface> {
    config: Config = {
        navigationBarTitleText: '发起活动'
    }
    constructor(props: propsInterface) {
        super(props)
        this.state = {
            description: '',
            endDate: '',
            endTime: '',
            fee: '',
            location: [],
            recruitingUntilDate: '',
            recruitingUntilTime: '',
            startDate: '',
            startTime: '',
            title: '',
            invitee: [],
            inviteeList: [],
            thumbnail: [],
            files: [],
            loading: false,
            inviteeItem: 0,
            editStatus: true,
            membersChoose: []
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
        // const token = Taro.getStorageSync("token");
        // const iv = Taro.getStorageSync("iv");
        // const encryptedData = Taro.getStorageSync("encryptedData");
        this.setState({
            loading: true
        })
        const sendData = {
            content: {},
            eventInfo: {
                description: this.state.description,
                endDate: this.state.endDate,
                endTime: this.state.endTime,
                fee: this.state.fee,
                location: [{}],
                recruitingUntilDate: this.state.recruitingUntilDate,
                recruitingUntilTime: this.state.recruitingUntilTime,
                startDate: this.state.startDate,
                startTime: this.state.startTime,
                title: this.state.title
            },
            // initiatorDisplayName: "initiatorDisplayName",
            invitee: [
                {
                    type: 'list',
                    rules: this.state.membersChoose.map(item => item.id)
                }
            ],
            thumbnail: this.state.thumbnail
        }
        console.log({ sendData })
        return
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
        return true
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
                        <Picker
                            mode='date'
                            value={this.state.startDate}
                            onChange={e => {
                                this.setState({
                                    startDate: e.detail.value
                                })
                            }}
                        >
                            <View className='label-item'>活动时间</View>
                            <View className='value-item'>
                                {this.state.startDate || '请选择活动时间'}
                            </View>
                        </Picker>
                    </View>
                    <View className='my-form-item'>
                        <Picker
                            mode='time'
                            value={this.state.startTime}
                            onChange={e => {
                                this.setState({
                                    startTime: e.detail.value
                                })
                            }}
                        >
                            <View className='label-item'>活动时间</View>
                            <View className='value-item'>
                                {this.state.startTime || '请选择活动时间'}
                            </View>
                        </Picker>
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
                    <View className='my-form-item'>
                        <Picker
                            mode='date'
                            value={this.state.endDate}
                            onChange={e => {
                                this.setState({
                                    endDate: e.detail.value
                                })
                            }}
                        >
                            <View className='label-item'>截止时间</View>
                            <View className='value-item'>
                                {this.state.endDate || '请选择截止时间'}
                            </View>
                        </Picker>
                    </View>
                    <View className='my-form-item'>
                        <Picker
                            mode='time'
                            value={this.state.endTime}
                            onChange={e => {
                                this.setState({
                                    endTime: e.detail.value
                                })
                            }}
                        >
                            <View className='label-item'>活动结束时间</View>
                            <View className='value-item'>
                                {this.state.endTime || '请选择活动结束时间'}
                            </View>
                        </Picker>
                    </View>
                    <View className='my-form-item'>
                        <Picker
                            mode='date'
                            value={this.state.recruitingUntilDate}
                            onChange={e => {
                                this.setState({
                                    recruitingUntilDate: e.detail.value
                                })
                            }}
                        >
                            <View className='label-item'>招募截止时间</View>
                            <View className='value-item'>
                                {this.state.recruitingUntilDate ||
                                    '招募截止时间'}
                            </View>
                        </Picker>
                    </View>
                    <View className='my-form-item'>
                        <Picker
                            mode='time'
                            value={this.state.recruitingUntilTime}
                            onChange={e => {
                                this.setState({
                                    recruitingUntilTime: e.detail.value
                                })
                            }}
                        >
                            <View className='label-item'>招募截止时间</View>
                            <View className='value-item'>
                                {this.state.recruitingUntilTime ||
                                    '招募截止时间'}
                            </View>
                        </Picker>
                    </View>
                    <View
                        className='my-form-item'
                        onClick={() => this.goChooseMembersPage()}
                    >
                        <View className='label-item'>邀请对象</View>
                        <View className='value-item'>
                            {/* {this.state.inviteeItem} */}
                            {this.state.membersChoose
                                .map(item => item.name)
                                .join(',')}
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
