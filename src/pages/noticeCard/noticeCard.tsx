import Taro, { Component, Config } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";
// import { connect } from "@tarojs/redux";
// import Api from '../../utils/request'
import Tips from "../../utils/tips";
import { propsInterface, stateInterface } from "./interface";
import "./noticeCard.scss";
import { MAINHOST } from "../../config";
import ComponentBaseNavigation from "../../components/ComponentHomeNavigation/componentHomeNavigation";
import { rolesList, branchsList } from "../../globalData";
// import { } from '../../components'

class NoticeCard extends Component<propsInterface, stateInterface> {
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
                    onSubmit={() => this.onSubmit()}
                    className="formPanel"
                >
                 <View className="top-panel">
                    <View className="avatar"></View>
                 </View>
                    <View className="register-title-panel">
                        发起通知
                    </View>
                    <AtInput
                        name="value"
                        title="通知标题"
                        type="text"
                        placeholder="通知标题"
                        value={this.state.familyName}
                        onChange={val => {
                            this.setState({ familyName: val.toString() });
                        }}
                    />
                    <AtInput
                        name="value"
                        title="通知对象"
                        type="text"
                        placeholder="通知对象"
                        value={this.state.familyName}
                        onChange={val => {
                            this.setState({ familyName: val.toString() });
                        }}
                    />

                    <View className="my-form-item">
                        <Picker
                            mode="date"
                            value={this.state.birthday}
                            onChange={e => {
                                this.setState({
                                    birthday: e.detail.value
                                });
                            }}
                        >
                            <View className="label-item">有效期至</View>
                            <View className="value-item">
                                {this.state.birthday || "请选择有效期"}
                            </View>
                        </Picker>
                    </View>
                    <AtInput
                        name="value"
                        title="内容"
                        type="text"
                        placeholder="内容"
                        value={this.state.familyName}
                        onChange={val => {
                            this.setState({ familyName: val.toString() });
                        }}
                    />
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

export default NoticeCard;
