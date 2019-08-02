import Taro, { Component, Config } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";
// import { connect } from "@tarojs/redux";
// import Api from '../../utils/request'
import Tips from "../../utils/tips";
import { propsInterface, stateInterface } from "./interface";
import "./style.scss";
import { MAINHOST } from "../../config";
import ComponentBaseNavigation from "../../components/ComponentHomeNavigation/componentHomeNavigation";
// import { rolesList, branchsList } from "../../globalData";
// import { } from '../../components'

class NoticeCard extends Component<propsInterface, stateInterface> {
    config: Config = {
        navigationBarTitleText: "活动"
    };
    constructor(props: propsInterface) {
        super(props);
        this.state = {
           
        };
    }
    componentDidMount() {}
   
    render() {
        return (
            <View className="notice-card-wrap">
                <ComponentBaseNavigation type="normal-page" />
                <View>
                    
                </View>
            </View>
        );
    }
}

export default NoticeCard;
