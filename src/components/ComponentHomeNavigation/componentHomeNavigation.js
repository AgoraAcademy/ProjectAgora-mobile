import Taro, { Component } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import classNames from "classnames";
import ComponentBaseNavigation from "../navigation/navigation";

import "./style.scss";

class ComponentHomeNavigation extends Component {
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
        Taro.redirectTo({
            url: url
        });
    }
    render() {
        const routeMap = [
            { path: "/pages/index/index", name: "我的" },
            { path: "/pages/booking/booking", name: "学习" },
            { path: "/pages/identity/identity", name: "社区" }
        ];
        return (
            <ComponentBaseNavigation>
                <View className='navigation'>
                    {this.props.type === "normal" ? (
                        <View className='ul'>
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
                          onClick={() => {
                                Taro.navigateBack();
                            }}
                        >
                           返回
                        </View>
                    )}
                </View>
                {this.props.children}
            </ComponentBaseNavigation>
        );
    }
}

export default ComponentHomeNavigation;
