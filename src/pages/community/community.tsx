
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { CommunityProps, CommunityState } from './community.interface'
import ComponentBaseNavigation from '../../components/ComponentHomeNavigation/componentHomeNavigation'
import './style.scss'


class Community extends Component<CommunityProps, CommunityState> {
    constructor(props: CommunityProps) {
        super(props)
        this.state = {}
    }
    config: Config = {
        disableScroll: true
    }
    render() {
        return (
            <View className='developing-wrap'>
                <ComponentBaseNavigation type='normal-page' />
                <View className='developing-page'>
                    开发中...
                </View>
            </View>
        )
    }
}

export default Community
