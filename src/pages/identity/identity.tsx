import Taro, { Component, Config } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";
import { connect } from "@tarojs/redux";
// import Api from '../../utils/request'
import Tips from '../../utils/tips'
import { IdentityProps, IdentityState } from "./identity.interface";
import "./identity.scss";
import { MAINHOST } from "../../config";
// import { } from '../../components'

class Identity extends Component<IdentityProps, IdentityState> {
    config: Config = {
        navigationBarTitleText: "账号"
    };
    constructor(props: IdentityProps) {
        super(props);
        const rolesList = ["社区成员", "全职导师", "驻场导师"];
        const branchsList = ["成都·先锋", "深圳·安格"];
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
        const res=await Taro.request({
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
            Tips.toast("注册成功")
        }
    }
    render() {
        return (
            <View className="identity-wrap">
                {/* <View><Text>未能获取账户信息</Text></View>
                <View><Text>如果你已注册ProjectAgora账户，请尝试一下登录一次网页端后再尝试</Text></View> */}
                <AtForm
                    onSubmit={this.onSubmit.bind(this)}
                    className="formPanel"
                >
                    <View className="register-title-panel">新用户注册</View>
                    <AtInput
                        name="value"
                        title="姓"
                        type="text"
                        placeholder="姓"
                        value={this.state.familyName}
                        onChange={val => {
                            this.setState({ familyName: val.toString() });
                        }}
                    />
                    <AtInput
                        name="value"
                        title="名"
                        type="text"
                        placeholder="名"
                        value={this.state.givenName}
                        onChange={val => {
                            this.setState({ givenName: val.toString() });
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
                           <View className="label-item">出生日期</View>
                            <View className="value-item">
                                {this.state.birthday||"请选择出生日期"}
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
                            <View className="label-item">角色</View>
                            <View className="value-item">
                                {this.state.role}
                            </View>
                        </Picker>
                    </View>
                    <View className="my-form-item">
                        <Picker
                            mode="selector"
                            range={this.state.branchsList}
                            onChange={e => {
                                this.setState({
                                    branch: this.state.branchsList[e.detail.value]
                                });
                            }}
                        >
                            <View className="label-item">校区</View>
                            <View className="value-item">
                                {this.state.branch}
                            </View>
                        </Picker>
                    </View>

                    <AtButton formType="submit" className="sub-button">
                        确认添加
                    </AtButton>
                </AtForm>
            </View>
        );
    }
}

export default Identity;
