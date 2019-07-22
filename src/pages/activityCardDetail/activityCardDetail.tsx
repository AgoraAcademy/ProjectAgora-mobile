import Taro, { Component, Config } from "@tarojs/taro";
import { View, Picker, Text } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";
// import { connect } from "@tarojs/redux";
// import Api from '../../utils/request'
import Tips from "../../utils/tips";
import { propsInterface, stateInterface } from "./interface";
import "./activityCardDetail.scss";
import { MAINHOST } from "../../config";
import ComponentBaseNavigation from "../../components/ComponentHomeNavigation/componentHomeNavigation";
import { rolesList, branchsList } from "../../globalData";
// import { } from '../../components'

class activityCardDetail extends Component<propsInterface, stateInterface> {
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
    componentDidMount() {
        const {id,type}=this.$router.params
        console.log({
            id,type
        })
    }
    async onSubmit() {
        const token = Taro.getStorageSync("token");
        const iv = Taro.getStorageSync("iv");
        const encryptedData = Taro.getStorageSync("encryptedData");
        const res = await Taro.request({
            url: `${MAINHOST}/learner`,
            data: {
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
                <ComponentBaseNavigation type="childPage" />
                <AtForm
                    onSubmit={this.onSubmit.bind(this)}
                    className="formPanel"
                >
                    <View className="act-panel">
                        <View className="act-title">一起打篮球</View>
                    </View>
                    <View className="register-title-panel">报名活动</View>
                    <View className="my-form-item">
                        <View className="label-item">活动简介</View>
                        <View className="value-item">{this.state.role}</View>
                    </View>
                    <View className="my-form-item">
                        <View className="label-item">发起人</View>
                        <View className="value-item">{this.state.role}</View>
                    </View>
                    <View className="my-form-item">
                        <View className="label-item">活动时间</View>
                        <View className="value-item">{this.state.role}</View>
                    </View>
                    <View className="my-form-item">
                        <View className="label-item">活动地点</View>
                        <View className="value-item">{this.state.role}</View>
                    </View>
                    <View className="my-form-item">
                        <View className="label-item">活动费用</View>
                        <View className="value-item">{this.state.role}</View>
                    </View>
                    <View className="my-form-item">
                        <View className="label-item">截止时间</View>
                        <View className="value-item">{this.state.role}</View>
                    </View>
                    <View className="my-form-item">
                        <View className="label-item">已报名</View>
                        <View className="value-item">{this.state.role}</View>
                    </View>

                    <AtButton formType="submit" className="sub-button">
                        确认报名
                    </AtButton>

                    <View className="action-panel">
                        <View className="action-item">
                            <View className="at-icon at-icon-close icon-close" />
                            <Text className="text">取消</Text>
                        </View>
                        <View className="action-item">
                            <View className="at-icon at-icon-help icon-help" />
                            <Text className="text">可能参加</Text>
                        </View>
                    </View>
                </AtForm>
            </View>
        );
    }
}

export default activityCardDetail;
