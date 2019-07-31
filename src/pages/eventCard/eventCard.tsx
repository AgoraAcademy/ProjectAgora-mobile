import Taro, { Component, Config } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";
// import { connect } from "@tarojs/redux";
// import Api from '../../utils/request'
import Tips from "../../utils/tips";
import { propsInterface, stateInterface } from "./interface";
import "./eventCard.scss";
import { MAINHOST } from "../../config";
import ComponentBaseNavigation from "../../components/ComponentHomeNavigation/componentHomeNavigation";
import ImageView from "../../components/ImageView/ImageView";
import produce from "immer";

// import { } from '../../components'
import { choosePicGetBase64 } from "../../utils/common";

class EventCard extends Component<propsInterface, stateInterface> {
    config: Config = {
        navigationBarTitleText: "活动"
    };
    constructor(props: propsInterface) {
        super(props);
        this.state = {
            description: "",
            endDate: "",
            endTime: "",
            fee: "",
            location: [],
            recruitingUntilDate: "",
            recruitingUntilTime: "",
            startDate: "",
            startTime: "",
            title: "",
            invitee: [],
            inviteeList: [],
            thumbnail: [],
            files: [],
            loading: false,
            inviteeItem: 0,
            editStatus: true
        };
    }
    onShow() {
        console.log("onshow");
    }
    componentDidMount() {}
    async onSubmit() {
        // const token = Taro.getStorageSync("token");
        // const iv = Taro.getStorageSync("iv");
        // const encryptedData = Taro.getStorageSync("encryptedData");
        this.setState({
            loading: true
        });
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
                    type: "filters",
                    rules: [{ scope: "校区", value: "深圳·安格" }]
                }
            ],
            thumbnail: this.state.thumbnail,
            inviteeItem: 0
        };
        console.log(sendData);
        return;
        try {
            const res = await this.$api({
                url: `${MAINHOST}/event`,
                data: {
                    content: {},
                    eventInfo: {
                        description: "test",
                        endDate: "2019-09-09",
                        endTime: "19:00",
                        fee: "10",
                        location: [{}],
                        recruitingUntilDate: "2019-09-09",
                        recruitingUntilTime: "19:00",
                        startDate: "2019-09-09",
                        startTime: "19:00",
                        title: "test title"
                    },
                    // initiatorDisplayName: "initiatorDisplayName",
                    invitee: [
                        {
                            type: "filters",
                            rules: [{ scope: "校区", value: "深圳·安格" }]
                        }
                    ],
                    thumbnail: this.state.thumbnail
                },
                // header: { token: token },
                method: "POST"
            });
            // this.setState({
            //     loading: false
            // });
        } catch (error) {
            this.setState({
                loading: false
            });
        }
    }
    fileChange(val) {
        console.log(val);
    }
    async choosePic() {
        const res = await choosePicGetBase64();
        // console.log(res);
        if (this.state.thumbnail.length === 9) {
            Tips.toast("图片不能超过9张");
            return;
        }
        const arr = produce(this.state.thumbnail, draftState => {
            draftState.push(res);
        });

        this.setState({
            thumbnail: arr
        });
    }
    removePic(index: number) {
        const arr = produce(this.state.thumbnail, draftState => {
            draftState.splice(index, 1);
        });
        this.setState({
            thumbnail: arr
        });
    }
    changeEditStatus() {
        this.setState({
            editStatus: !this.state.editStatus
        });
    }
    render() {
        return (
            <View className="event-card-wrap">
                <ComponentBaseNavigation type="childPage" />
                <AtForm onSubmit={() => this.onSubmit()} className="formPanel">
                    <View className="act-panel">
                        {this.state.editStatus ? (
                            <AtInput
                                name="value"
                                title=""
                                type="text"
                                placeholder="活动标题"
                                value={this.state.title}
                                onChange={val => {
                                    this.setState({ title: String(val) });
                                }}
                            />
                        ) : (
                            <View className="act-title">
                                {this.state.title}
                            </View>
                        )}
                        <View
                            className="at-icon at-icon-edit"
                            onClick={() => this.changeEditStatus()}
                        />
                    </View>
                    <View className="register-title-panel">发起活动</View>
                    <AtInput
                        name="value"
                        title="活动简介"
                        type="text"
                        placeholder="活动简介"
                        value={this.state.description}
                        onChange={val => {
                            this.setState({ description: String(val) });
                        }}
                    />

                    <View className="my-form-item">
                        <Picker
                            mode="date"
                            value={this.state.startDate}
                            onChange={e => {
                                this.setState({
                                    startDate: e.detail.value
                                });
                            }}
                        >
                            <View className="label-item">活动时间</View>
                            <View className="value-item">
                                {this.state.startDate || "请选择活动时间"}
                            </View>
                        </Picker>
                    </View>
                    <AtInput
                        name="value"
                        title="活动费用"
                        type="text"
                        placeholder="活动费用"
                        value={this.state.fee}
                        onChange={val => {
                            this.setState({ fee: String(val) });
                        }}
                    />
                    <View className="my-form-item">
                        <Picker
                            mode="date"
                            value={this.state.endDate}
                            onChange={e => {
                                this.setState({
                                    endDate: e.detail.value
                                });
                            }}
                        >
                            <View className="label-item">截止时间</View>
                            <View className="value-item">
                                {this.state.endDate || "请选择截止时间"}
                            </View>
                        </Picker>
                    </View>
                    <View className="my-form-item">
                        <Picker
                            mode="date"
                            value={this.state.recruitingUntilDate}
                            onChange={e => {
                                this.setState({
                                    recruitingUntilDate: e.detail.value
                                });
                            }}
                        >
                            <View className="label-item">招募截止时间</View>
                            <View className="value-item">
                                {this.state.recruitingUntilDate ||
                                    "招募截止时间"}
                            </View>
                        </Picker>
                    </View>
                    <View className="my-form-item">
                        <Picker
                            mode="selector"
                            value={this.state.inviteeItem}
                            range={this.state.inviteeList}
                            onChange={e => {
                                this.setState({
                                    inviteeItem: this.state.inviteeList[
                                        e.detail.value
                                    ]
                                });
                            }}
                        >
                            <View className="label-item">邀请对象</View>
                            <View className="value-item">
                                {this.state.inviteeItem}
                            </View>
                        </Picker>
                    </View>

                    <View className="my-form-item">
                        <View className="label-item">附图</View>
                        <View className="value-item">
                            {this.state.thumbnail.map((item, index) => {
                                return (
                                    <ImageView
                                        pathId={item}
                                        key={item}
                                        img-class="preview-image"
                                        onClick={() => {
                                            this.removePic(index);
                                        }}
                                    />
                                );
                            })}
                            <View
                                className="at-icon at-icon-add"
                                onClick={() => this.choosePic()}
                            />
                        </View>
                    </View>

                    <AtButton
                        formType="submit"
                        className="sub-button"
                        loading={this.state.loading}
                    >
                        确认发起
                    </AtButton>
                </AtForm>
            </View>
        );
    }
}

export default EventCard;
