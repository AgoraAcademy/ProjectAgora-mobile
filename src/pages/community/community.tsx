
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { CommunityProps, CommunityState } from './community.interface'
import './community.scss'
import ComponentBaseNavigation from "../../components/ComponentHomeNavigation/componentHomeNavigation";
// import { } from '../../components'

// @connect(({ community }) => ({
//     ...community,
// }))

class Community extends Component<CommunityProps, CommunityState > {
    constructor(props: CommunityProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        
    }
    jump(url){
        Taro.navigateTo({
            url
        })
    }

    render() {
        const menuList=[{
            label: "授权页",
            url: '/pages/authorize/authorize'
        }]
        return (
            <View className='community-wrap'>
                <ComponentBaseNavigation type='normal-page' />
               {
                   menuList.map(item=>{
                       return (
                           <View onClick={()=>this.jump(item.url)} key={item.label}>{item.label}</View>
                       )
                   })
               }
            </View>
        )
    }
    }

export default Community
