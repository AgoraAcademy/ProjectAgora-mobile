import Taro, { Component, Config } from "@tarojs/taro";
import { View, Picker, Image } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";
// import { connect } from "@tarojs/redux";
// import Api from '../../utils/request'
import Tips from "../../utils/tips";
import { propsInterface, stateInterface } from "./interface";
import "./activityCard.scss";
import { MAINHOST } from "../../config";
import ComponentBaseNavigation from "../../components/ComponentHomeNavigation/componentHomeNavigation";
import ImageView from "../../components/ImageView/ImageView";
import produce from "immer";

// import { } from '../../components'
import { choosePicGetBase64 } from "../../utils/common";

class ActivityCard extends Component<propsInterface, stateInterface> {
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
            files: []
        };
    }
    componentDidMount() {}
    async onSubmit() {
        const token = Taro.getStorageSync("token");
        const iv = Taro.getStorageSync("iv");
        const encryptedData = Taro.getStorageSync("encryptedData");
        const res = await Taro.request({
            url: `${MAINHOST}/event`,
            data: {
                eventInfo: {
                    description: "string",
                    endDate: "string",
                    endTime: "string",
                    fee: "string",
                    location: [{}],
                    recruitingUntilDate: "string",
                    recruitingUntilTime: "string",
                    startDate: "string",
                    startTime: "string",
                    title: "string"
                },
                initiatorDisplayName: "string",
                invitee: [
                    {
                        rule: "string",
                        type: "string"
                    }
                ],
                thumbnail: [],
                iv,
                encryptedData
            },
            header: { token: token },
            method: "POST"
        });
        if (res.statusCode === 201) {
            Tips.toast("发起成功");
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
    render() {
        return (
            <View className="identity-wrap">
                <ComponentBaseNavigation type="normal" />
                <AtForm
                    onSubmit={this.onSubmit.bind(this)}
                    className="formPanel"
                >
                    <View className="act-panel">
                        <View className="act-title">一起打篮球</View>
                        <View className="at-icon at-icon-edit" />
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
                            mode="selector"
                            range={this.state.invitee}
                            onChange={e => {
                                this.setState({
                                    invitee: this.state.inviteeList[
                                        e.detail.value
                                    ]
                                });
                            }}
                        >
                            <View className="label-item">邀请对象</View>
                            <View className="value-item">
                                {this.state.invitee}
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

                    <AtButton formType="submit" className="sub-button">
                        确认发起
                    </AtButton>
                </AtForm>
            </View>
        );
    }
}

export default ActivityCard;
