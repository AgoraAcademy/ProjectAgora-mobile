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


    componentDidMount() {
        Taro.getSystemInfo().then(res => {
            this.setState({
                statusBarHeight: res.statusBarHeight
            })
            // console.log({ res });
        });
    }
    handleClick() { }
    render() {
        const {
            statusBarHeight,
            backgroundColor,
            color
        } = this.state;
        const barStyle = {
            paddingTop: `${statusBarHeight}px`,
            backgroundColor,
            color
        };
       
        console.log(statusBarHeight)
        return (
            <View className='navigation' style={{ height: 2*statusBarHeight+'px' }}>
                <View className='bar' style={barStyle}>
                    {this.props.children}
                </View>
                {/* <View className="placeholder" style={barStyle} /> */}
            </View>
        );
    }
}

export default ComponentBaseNavigation;
