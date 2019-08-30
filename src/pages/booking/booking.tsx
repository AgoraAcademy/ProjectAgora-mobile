import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker, Button, Text, Input, Textarea, Form } from '@tarojs/components'
import moment from 'moment';
import { connect } from '@tarojs/redux'
import { AtSteps, AtAvatar, AtCalendar, AtListItem, AtActivityIndicator, AtTag } from 'taro-ui'
// import Api from '../../utils/request'
import Tips from '../../utils/tips'
import { BookingProps, BookingState, RoomEvent } from './booking.interface'
import './booking.scss'
import ComponentBaseNavigation from "../../components/ComponentHomeNavigation/componentHomeNavigation";

// import { } from '../../components'

@connect(({ booking, loading }) => ({
    ...booking,
    loading
}))

class Booking extends Component<BookingProps, BookingState> {
    config: Config = {
        navigationBarTitleText: '房间预约'
    }
    constructor(props: BookingProps) {
        super(props)
        this.state = {
            currentStep: 0,
            roomlistData: [],
            selectedListname: "",
            selectedListnameIndex: 0,
            selectedRoomCode: "",
            selectedRoomName: "",
            selectedRoomDescription: "",
            selectedDate: "",
            bookingPostBody: {
                startDate: "",
                startTime: "10:00",
                endTime: "22:30",
                subject: "",
                description: ""
            },
            confirmLoading: false,
            bookingDeleteBody: {
                changekey: ""
            }
        }
    }

    getRoomList = async () => {
        const roomlistData = await this.props.dispatch({
            type: "booking/getRoomList"
        })
        this.setState({ roomlistData })
    }

    handleTabClick = (value) => {
        this.setState({
            currentStep: value
        })
    }

    getRoomListNames = () => {
        const roomlistData = this.state.roomlistData || []
        let roomListNames: string[] = []
        roomlistData.forEach(entry => {
            roomListNames.push(entry.listname)
        });
        return roomListNames
    }

    getDataSource = () => {
        const { roomlistData, selectedListname } = this.state
        if (this.state.roomlistData.length === 0) {
            return []
        }
        const selectedListData = roomlistData.filter((entry) => entry.listname === selectedListname)
        if (selectedListData.length === 0) {
            return []
        }
        return selectedListData[0].rooms
    }

    componentDidMount() {
        this.getRoomList()
        try{
            const { statusCode, roomCode, selectedDate } =  Taro.getCurrentPages()[1].options
            if (statusCode === "200") {
                this.setState({
                    currentStep: 3,
                    selectedRoomCode: roomCode,
                    selectedDate
                })
                this.props.dispatch({
                    type: "booking/loadEvents",
                    payload: {
                        monthToLoad: selectedDate.substr(0, 7),
                        roomCode
                    }
                })
            }
        } catch(error) {
            console.log("query error", error)
        }
    }

    processRoomListData = (filteredData) => {
        let processedData = filteredData
        filteredData.forEach((item, index, originalData) => {
            if (index === originalData.length - 1) {
                return
            }
            const endTimeMoment = moment(item.endTime, "HH:ss")
            const startTimeMoment = moment(originalData[index + 1].startTime, "HH:ss")
            const difference = startTimeMoment.diff(endTimeMoment, "hours", true)
            if (difference > 0) {
                const vacancyItem: RoomEvent = {
                    subject: "空闲",
                    description: "",
                    startTime: endTimeMoment.format("HH:ss"),
                    endTime: startTimeMoment.format("HH:ss"),
                    bookedByName: "",
                    type: "vacancy"
                }
                processedData.splice(index + 1, 0, vacancyItem)
            }
        })
        if (filteredData.length === 0) {  //此处全天空闲 写死10:00 - 22:30
            processedData.push(
                {
                    subject: "空闲",
                    description: "",
                    startTime: "10:00",
                    endTime: "22:30",
                    bookedByName: "",
                    bookedByID: 0,
                    changekey: "",
                    type: "vacancy",
                } as RoomEvent
            )
        }
        else {
            const timeToEnd = moment(filteredData.slice(-1)[0].endTime, "HH:ss").diff(moment("22:30", "HH:ss"), "hours", true)
            if (timeToEnd < 0) {  //此处判断尾部空闲写死22:30
                processedData.push(
                    {
                        subject: "空闲",
                        description: "",
                        startTime: filteredData.slice(-1)[0].endTime,
                        endTime: "22:30",
                        bookedByName: "",
                        type: "vacancy"
                    } as RoomEvent
                )
            }
            const timeToStart = moment(filteredData[0].startTime, "HH:ss").diff(moment("10:00", "HH:ss"), "hours", true)
            if (timeToStart > 0) {  //此处判断头部空闲写死10:00
                processedData.splice(0, 0,
                    {
                        subject: "空闲",
                        description: "",
                        startTime: "10:00",
                        endTime: filteredData[0].startTime,
                        bookedByName: "",
                        bookedByID: 0,
                        type: "vacancy"
                    } as RoomEvent
                )
            }
        }
        return processedData
    }
    checkForm(){
        if(!this.state.bookingPostBody.subject){
            Tips.toast('请输入标题')
            return false
        }
        return true
    }
    render() {
        const roomListNames = this.getRoomListNames()
        const dataSource = this.getDataSource()
        const handleBookingPost = async (e) =>  {
            if(!this.checkForm()){
                return
            }
            this.setState({confirmLoading: true})
            const { bookingPostBody, selectedDate } = this.state
            const dateMoment = moment(selectedDate, "YYYY-MM-DD")
            const startMoment = moment(bookingPostBody.startTime, "HH:mm")
            const endMoment = moment(bookingPostBody.endTime, "HH:mm")
            let body = {
                ...bookingPostBody,
                startDate: dateMoment.format("YYYY-MM-DD"),
                endDate: dateMoment.format("YYYY-MM-DD"),
                startYear: dateMoment.year(),
                startMonth: dateMoment.month() + 1,
                startDay: dateMoment.date(),
                startHour: startMoment.hour(),
                startMinute: startMoment.minute(),
                endYear: dateMoment.year(),
                endMonth: dateMoment.month() + 1,
                endDay: dateMoment.date(),
                endHour: endMoment.hour(),
                endMinute: endMoment.minute(),
                formId: e.detail.formId || ""
            }
            this.props.dispatch({type: "booking/createEvent", payload: {body, roomCode: this.state.selectedRoomCode}})
        }
        const handleBookingDelete = async (e) =>{
            console.log('handleBookingDelete')
            this.setState({confirmLoading: true})
            const { changekey, startDate } = this.state.selectRoomEvent!
            let body = {
                changekey,
                formId: e.detail.formId || ""
            }
            this.props.dispatch({type: "booking/deleteEvent", payload: {body, roomCode: this.state.selectedRoomCode, startDate}})
        }
        let content: any = null
        if (this.state.currentStep === 0) {
            content = roomListNames.map((item) => {
                return <Button key={item} onClick={() => this.setState({ selectedListname: item, currentStep: 1 })}
                >
                    {item}
                </Button>
            })
        }
        if (this.state.currentStep === 1) {
            content = dataSource!.map((item) => {
                return <Button key={item.roomCode} onClick={() => {
                    this.setState({
                        selectedRoomName: item.name,
                        selectedRoomCode: item.roomCode,
                        selectedRoomDescription: item.description,
                        currentStep: 2
                    })
                }
                }
                >
                    {item.name}
                </Button>
            })
        }
        if (this.state.currentStep === 2) {
            content =
                <View className='container'>
                    <View key={this.state.selectedRoomCode} className='at-row'>
                        <View className='at-col at-col-3'>
                            <AtAvatar customStyle={{ margin: "0px 20px 60px 20px" }} image='https://jdc.jd.com/img/200'></AtAvatar>
                        </View>
                        <View className='at-col at-col--wrap'>
                            <View className='container'>
                                <Text key={this.state.selectedRoomName}>{this.state.selectedRoomName}</Text>
                            </View>
                            <View className='container'>
                                <Text key={this.state.selectedRoomDescription}>{this.state.selectedRoomDescription}</Text>
                            </View>
                        </View>
                    </View>
                    <View className='container'>
                        <AtCalendar onDayClick={async (item) => {
                            this.setState({ selectedDate: item.value, currentStep: 3 })
                            this.props.dispatch({
                                type: "booking/loadEvents",
                                payload: {
                                    monthToLoad: item.value.substr(0, 7),
                                    roomCode: this.state.selectedRoomCode
                                }
                            })
                        }} />
                    </View>
                </View>
        }
        if (this.state.currentStep === 3) {
            const roomEvents = this.props.loadedEvents
            const filteredData = roomEvents.filter((item) => item.startDate === this.state.selectedDate.substr(0, 10))
            const processedData = this.processRoomListData(filteredData || [])
            content = processedData.map((item) => {
                return <AtListItem
                    note={`${item.startTime} - ${item.endTime}`}
                    title={item.subject}
                    iconInfo={{ value: "calendar" }}
                    arrow={item.type === "vacancy" ? "right" : undefined}
                    extraText={item.type === "vacancy" ? "预约" : `${item.bookedByName}`}
                    onClick={() => {
                        this.setState({ currentStep: 4, selectRoomEvent: item })
                    }}
                />
            })
        }
        if (this.state.currentStep === 4) {
            content = <View className='container'>
                <View className='at-row'>
                    <View className='at-col at-col-4'>
                        <AtTag type='primary' active customStyle={{ margin: "0px 20px 20px 20px" }}>预约标题</AtTag>
                    </View>
                    <View className='at-col at-col-8'>
                        {this.state.selectRoomEvent!.type === "appointment" ?
                            <Text>{this.state.selectRoomEvent!.subject}</Text> :
                            <Input
                                type='text'
                                placeholder='输入预约标题'
                                value={this.state.bookingPostBody!.subject}
                                onInput={(value) => {
                                    this.setState({ bookingPostBody: { ...this.state.bookingPostBody!, subject: value.detail.value} })
                                }}
                            />
                        }
                    </View>
                </View>
                <View className='at-row'>
                    <View className='at-col at-col-4'>
                        <AtTag type='primary' active customStyle={{ margin: "0px 20px 20px 20px", width: "70%" }}>预约人</AtTag>
                    </View>
                    <View className='at-col at-col-8'>
                        {this.state.selectRoomEvent!.type === "appointment" ?
                            <Text>{this.state.selectRoomEvent!.bookedByName}</Text> :
                            <Text>{Taro.getStorageSync("learnerFullName")}</Text>
                        }
                    </View>
                </View>
                <View className='at-row'>
                    <View className='at-col at-col-4'>
                        <AtTag type='primary' active customStyle={{ margin: "0px 20px 20px 20px", width: "70%" }}>预约日期</AtTag>
                    </View>
                    <View className='at-col at-col-8'>
                        {this.state.selectRoomEvent!.type === "appointment" ?
                            <Text>{this.state.selectRoomEvent!.startDate}</Text> :
                            <Text>{this.state.selectedDate}</Text>
                        }
                    </View>
                </View>
                <View className='at-row'>
                    <View className='at-col at-col-4'>
                        <AtTag type='primary' active customStyle={{ margin: "0px 20px 20px 20px" }}>开始时间</AtTag>
                    </View>
                    <View className='at-col at-col-8'>
                        {this.state.selectRoomEvent!.type === "appointment" ?
                            <Text>{this.state.selectRoomEvent!.startTime}</Text> :
                            <Picker 
                                mode='time'
                                value={this.state.bookingPostBody.startTime}
                                start="10:00"   // 此处暂时写死；应该向config取值
                                end="22:30"
                                onChange={(value) => {
                                    this.setState({ bookingPostBody: { ...this.state.bookingPostBody!, startTime: value.detail.value} })}}
                                
                            >
                                <View className='picker'>
                                    {this.state.bookingPostBody.startTime}
                                </View>
                            </Picker>
                        }
                    </View>
                </View>
                <View className='at-row'>
                    <View className='at-col at-col-4'>
                        <AtTag type='primary' active customStyle={{ margin: "0px 20px 20px 20px" }}>结束时间</AtTag>
                    </View>
                    <View className='at-col at-col-8'>
                        {this.state.selectRoomEvent!.type === "appointment" ?
                            <Text>{this.state.selectRoomEvent!.endTime}</Text> :
                            <Picker 
                                mode='time'
                                value={this.state.bookingPostBody.endTime}
                                start="10:00"   // 此处暂时写死；应该向config取值
                                end="22:30"
                                onChange={(value) => {
                                    this.setState({ bookingPostBody: { ...this.state.bookingPostBody!, endTime: value.detail.value} })}}
                                
                            >
                                <View className='picker'>
                                    {this.state.bookingPostBody.endTime}
                                </View>
                            </Picker>
                        }
                    </View>
                </View>
                <View className='at-row'>
                    <View className='at-col at-col-4'>
                        <AtTag type='primary' active customStyle={{ margin: "0px 20px 20px 20px" }}>预约描述</AtTag>
                    </View>
                    <View className='at-col at-col-8'>
                    {this.state.selectRoomEvent!.type === "appointment" ?
                            <Text>{this.state.selectRoomEvent!.description}</Text> :
                            <Textarea
                                placeholder="输入预约描述"
                                value={this.state.bookingPostBody.description}
                                onInput={(value) => {
                                    this.setState({ bookingPostBody: { ...this.state.bookingPostBody!, description: value.detail.value} })
                                }}
                                style='background:#fff;width:100%;min-height:80px;padding:0;'
                                autoHeight
                            />
                        }
                    </View>
                </View>
                <View>
                    <Form reportSubmit onSubmit={handleBookingPost}>
                        <Button
                            style={{ display: this.state.selectRoomEvent!.type === "vacancy" ? "block" : "none" }}
                            type="primary"
                            loading={this.state.confirmLoading}
                            formType="submit"
                        >
                            确认
                        </Button>
                    </Form>
                   
                    <Form reportSubmit onSubmit={handleBookingDelete}>
                        <Button
                            style={{ display: (this.state.selectRoomEvent!.bookedByName === Taro.getStorageSync("learnerFullName") && this.state.selectRoomEvent!.type === "appointment") ? "block" : "none" }}
                            type="warn"
                            loading={this.state.confirmLoading}
                        >
                            删除
                        </Button>
                    </Form>
                </View>
            </View>
        }
        const stepitems = [{ title: '选择区域' }, { title: '选择房间' }, { title: '选择日期' }, { title: '选择时间' }, { title: '预约信息' }]
        return (
            <View className='booking-wrap'>
                <ComponentBaseNavigation type="child-page"/>
                <View className="stepIndicator">
                    <AtSteps
                        items={stepitems}
                        current={this.state.currentStep}
                        onChange={() => { }}
                    />
                </View>

                {this.props.loading.global ? <View style={{ position: "relative", minHeight: "50vh" }}><AtActivityIndicator mode='center' size={32} /></View> : content}
                {this.state.currentStep > 0 ? <View className="previousStepButton"><Button onClick={() => this.setState({ currentStep: this.state.currentStep - 1 })}>返回上一步</Button></View> : <View />}
            </View>
        )
    }
}

export default Booking
