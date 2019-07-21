import Taro, { Component, Config } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";
// import { connect } from "@tarojs/redux";
// import Api from '../../utils/request'
import Tips from "../../utils/tips";
import { propsInterface, stateInterface } from "./interface";
import "./activityCard.scss";
import { MAINHOST } from "../../config";
import ComponentBaseNavigation from "../../components/ComponentHomeNavigation/componentHomeNavigation";
import { rolesList, branchsList } from "../../globalData";
// import { } from '../../components'

class ActivityCard extends Component<propsInterface, stateInterface> {
    config: Config = {
        navigationBarTitleText: "活动"
    };
    constructor(props: propsInterface) {
        super(props);
        this.state = {
            familyName: "",
            givenName: "",
            role: rolesList[0],
            rolesList: rolesList,
            birthday: "",
            branch: branchsList[0],
            branchsList: branchsList,
            isMentor: 0
        };
    }
    componentDidMount() {}
    async onSubmit() {
        const token = Taro.getStorageSync("token");
        const iv = Taro.getStorageSync("iv");
        const encryptedData = Taro.getStorageSync("encryptedData");
        const res = await Taro.request({
            url: `${MAINHOST}/learner`,
            data: {
                familyName: this.state.familyName,
                givenName: this.state.givenName,
                role: this.state.role,
                birthday: this.state.birthday,
                branch: this.state.branch,
                isMentor: this.state.branch === "全职教师" ? 1 : 0,
                iv,
                encryptedData
            },
            header: { token: token },
            method: "POST"
        });
        if (res.statusCode === 201) {
            Tips.toast("注册成功");
        }
    }
    render() {
        return (
            <View className="identity-wrap">
                {/* <View><Text>未能获取账户信息</Text></View>
                <View><Text>如果你已注册ProjectAgora账户，请尝试一下登录一次网页端后再尝试</Text></View> */}
                <ComponentBaseNavigation type="normal" />
                <AtForm
                    onSubmit={this.onSubmit.bind(this)}
                    className="formPanel"
                >
                    <View className="act-panel">
                        <View className="act-title">一起打篮球</View>
                        <View className='at-icon at-icon-edit'></View>
                    </View>
                    <View className="register-title-panel">
                        发起活动
                    </View>
                    <AtInput
                        name="value"
                        title="活动简介"
                        type="text"
                        placeholder="活动简介"
                        value={this.state.familyName}
                        onChange={val => {
                            this.setState({ familyName: val.toString() });
                        }}
                    />

                    <View className="my-form-item">
                        <Picker
                            mode="date"
                            onChange={e => {
                                this.setState({
                                    birthday: e.detail.value
                                });
                            }}
                        >
                            <View className="label-item">活动时间</View>
                            <View className="value-item">
                                {this.state.birthday || "请选择活动时间"}
                            </View>
                        </Picker>
                    </View>
                    <AtInput
                        name="value"
                        title="活动费用"
                        type="text"
                        placeholder="活动费用"
                        value={this.state.familyName}
                        onChange={val => {
                            this.setState({ familyName: val.toString() });
                        }}
                    />
                    <View className="my-form-item">
                        <Picker
                            mode="date"
                            onChange={e => {
                                this.setState({
                                    birthday: e.detail.value
                                });
                            }}
                        >
                            <View className="label-item">截止时间</View>
                            <View className="value-item">
                                {this.state.birthday || "请选择截止时间"}
                            </View>
                        </Picker>
                    </View>
                    <View className="my-form-item">
                        <Picker
                            mode="selector"
                            range={this.state.rolesList}
                            onChange={e => {
                                this.setState({
                                    role: this.state.rolesList[e.detail.value]
                                });
                            }}
                        >
                            <View className="label-item">邀请对象</View>
                            <View className="value-item">
                                {this.state.role}
                            </View>
                        </Picker>
                    </View>
                    <AtInput
                        name="value"
                        title="附图"
                        type="text"
                        placeholder="附图"
                        value={this.state.familyName}
                        onChange={val => {
                            this.setState({ familyName: val.toString() });
                        }}
                    />

                    <AtButton formType="submit" className="sub-button">
                        确认发起
                    </AtButton>
                </AtForm>
            </View>
        );
    }
}

export default ActivityCard;
