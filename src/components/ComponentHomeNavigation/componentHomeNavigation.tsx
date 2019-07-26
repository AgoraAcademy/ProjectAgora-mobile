import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import classNames from "classnames";
import ComponentBaseNavigation from "../navigation/navigation";
import { StateInterface, PropsInterface } from "./interface";
import "./style.scss";

class ComponentHomeNavigation extends Component<
    PropsInterface,
    StateInterface
> {
    constructor(props) {
        super(props);
        this.state = {
            routePath: ""
        };
    }

    componentDidMount() {
        this.setState({
            routePath: Taro.getCurrentPages()[0].route
        });
    }
    handleClick() {}
    jump(url) {
        // Taro.redirectTo({
        //     url: url
        // });
        Taro.switchTab({
            url
        });
    }
    back() {
        if (Taro.getCurrentPages().length > 1) {
            Taro.navigateBack();
        }
    }
    render() {
        const routeMap = [
            { path: "/pages/home/home", name: "我的" },
            { path: "/pages/booking/booking", name: "学习" },
            { path: "/pages/community/community", name: "社区" }
        ];
        return (
            <ComponentBaseNavigation>
                <View className="navigation">
                    {this.props.type === "normal" ? (
                        <View className="ul">
                            {routeMap.map(item => {
                                return (
                                    <View
                                        className={classNames("li", {
                                            active: item.path.includes(
                                                this.state.routePath
                                            )
                                        })}
                                        key={item.path}
                                        onClick={() => this.jump(item.path)}
                                    >
                                        {item.name}
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        <View
                            className="back-header"
                            onClick={() => {
                                this.back();
                            }}
                        >
                            <AtIcon value="chevron-left" size="20" />
                            <Text>返回</Text>
                        </View>
                    )}
                </View>
                {this.props.children}
            </ComponentBaseNavigation>
        );
    }
}

export default ComponentHomeNavigation;
