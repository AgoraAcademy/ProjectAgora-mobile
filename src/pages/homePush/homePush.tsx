import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import { AtButton } from "taro-ui";
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { HomePushProps, HomePushState } from "./homePush.interface";
import "./homePush.scss";
import ComponentBaseNavigation from "../../components/ComponentHomeNavigation/componentHomeNavigation";
import classnames from "classnames";
// import { } from '../../components'

// @connect(({ homePush }) => ({
//     ...homePush,
// }))

class HomePush extends Component<HomePushProps, HomePushState> {
    config: Config = {
        navigationBarTitleText: ""
    };
    constructor(props: HomePushProps) {
        super(props);
        this.state = {
            activeList: [],
            chooseType: "push"
        };
    }

    componentDidMount() {
        const activeList = [
            {
                type: "活动",
                title: "篮球",
                date: "7月20日",
                desc: "中银花园",
                projectStatusText: "招募中",
                id: 1
            },
            {
                type: "社区",
                title: "2019秋季放假安排",
                date: "7月20日",
                desc: "放假安排描述",
                projectStatusText: "招募中",
                id: 2
            },
            {
                type: "项目",
                title: "安格游戏工作室",
                date: "7月20日",
                desc:
                    "安格游戏工作室安格游戏工作室安格游戏工作室安格游戏工作室安格游戏工作室",
                projectStatusText: "招募中",
                id: 3
            },
            {
                type: "社区",
                title: "2019秋季放假安排",
                date: "7月20日",
                desc: "放假安排描述",
                projectStatusText: "招募中",
                id: 4
            },
            {
                type: "项目",
                title: "安格游戏工作室",
                date: "7月20日",
                desc:
                    "安格游戏工作室安格游戏工作室安格游戏工作室安格游戏工作室安格游戏工作室",
                projectStatusText: "招募中",
                id: 5
            }
        ];
        activeList.forEach(item => {
            item["status"] = false;
        });
        this.setState({
            activeList
        });
    }
    join(item) {
        const activeList = JSON.parse(JSON.stringify(this.state.activeList));
        activeList.forEach(active => {
            if (active.id === item.id) {
                active.status = !item.status;
                console.log("命中");
            }
        });
        this.setState({
            activeList
        });
    }
    getBg(type) {
        return {
            活动: "green",
            社区: "red",
            项目: "blue",
            预约: "orange",
            计划: "yellow"
        }[type];
    }

    render() {
        const data =
            this.state.chooseType === "push"
                ? this.state.activeList
                : this.state.activeList;
        const listComponent = data.map(item => {
            return (
                <View
                    key={item.id}
                    className={classnames("li-ele card", {
                        active: item.status
                    })}
                >
                    <View className="main-panel">
                        <View
                            className={classnames("tag", this.getBg(item.type))}
                        >
                            {item.type}
                        </View>
                        <View className="left-panel">
                            <View className="avatar" />
                            <View
                                className="status-button"
                                style={
                                    item.type === "项目" ? "" : "display:none"
                                }
                            >
                                招募中
                            </View>
                        </View>
                        <View className="infoPanel">
                            <View className="title">{item.title}</View>
                            <View className="date">{item.date}</View>
                            <View className="desc">{item.desc}</View>
                        </View>
                        <AtButton
                            className="sub-button"
                            onClick={() => {
                                this.join(item);
                            }}
                        >
                            报名
                        </AtButton>
                        <View className="at-icon at-icon-chevron-right icon-right" />
                    </View>
                    {item.status ? (
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
                    ) : null}
                </View>
            );
        });
        return (
            <View className="homePush-wrap">
                <ComponentBaseNavigation type="normal" />
                <ScrollView
                    className="scrollview"
                    scrollY
                    style={
                        this.state.chooseType === "push" ? "" : "display:none"
                    }
                >
                    <View className="ul-ele">{listComponent}</View>
                </ScrollView>

                <ScrollView
                    className="scrollview"
                    scrollY
                    style={
                        this.state.chooseType === "notice" ? "" : "display:none"
                    }
                >
                    <View className="ul-ele">{listComponent}</View>
                </ScrollView>

                <View className="bottom-tab-panel">
                    <View
                        className={classnames("tab-item", {
                            active: this.state.chooseType === "push"
                        })}
                        onClick={() => {
                            this.setState({ chooseType: "push" });
                        }}
                    >
                        <View className="at-icon at-icon-bookmark" />

                        <Text>推送</Text>
                    </View>
                    <View
                        className={classnames("tab-item", {
                            active: this.state.chooseType === "notice"
                        })}
                        onClick={() => {
                            this.setState({ chooseType: "notice" });
                        }}
                    >
                        <View className="at-icon at-icon-bell" />
                        <Text>提醒</Text>
                    </View>
                </View>
            </View>
        );
    }
}

export default HomePush;
