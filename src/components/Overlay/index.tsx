import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtIcon, AtDrawer } from "taro-ui";
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
            routePath:""
        };
    }
    componentDidMount() {
        this.setState({
            routePath: Taro.getCurrentPages()[0].route
        });
    }
    jump(url) {
        Taro.switchTab({
            url
        });
    }
    render() {
        const routeMap = [
            { path: "/pages/home/home", name: "主页" },
            { path: "/pages/booking/booking", name: "房间预订" },
            { path: "/pages/community/community", name: "查看公告" }
        ];
        return (
            <View className="overlay-box">
                {routeMap.map(item => {
                    return (
                        <View className={classNames("list-item", {
                            active: item.path.includes(
                                this.state.routePath
                            )
                        })}
                        key={item.path}
                        onClick={() => this.jump(item.path)}>
                            <View className="at-icon at-icon-home" />
                            <Text>{item.name}</Text>
                        </View>
                    );
                })}
            </View>
        );
    }
}

export default ComponentHomeNavigation;
