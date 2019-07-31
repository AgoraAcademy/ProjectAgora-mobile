import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./style.scss";
import { StateInterface, PropsInterface } from "./navigation.interface";
class ComponentBaseNavigation extends Component<
    PropsInterface,
    StateInterface
> {
    constructor() {
        super();
        this.state = {
            color: "rgb(100,100,100)",
            backgroundColor: "white",
            statusBarHeight: 0
        };
    }
    handleClick() {}

    componentDidMount() {
        Taro.getSystemInfo().then(res => {
            // this.setState({
            //     systemInfo:''
            // });

            console.log({ res });
        });
    }
    render() {
        const {
            statusBarHeight,
            backgroundColor,
            color
        } = this.state;
        const barStyle = {
            paddingTop: `${statusBarHeight + 20 || 20}px`,
            backgroundColor,
            color
        };
        return (
            <View className="navigation">
                <View className="bar" style={barStyle}>
                    {this.props.children}
                </View>
                {/* <View className="placeholder" style={barStyle} /> */}
            </View>
        );
    }
}

export default ComponentBaseNavigation;
