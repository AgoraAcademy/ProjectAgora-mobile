import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { StateInterface, PropsInterface } from './interface'
import { choosePicGetBase64 } from '../../utils/common'
import Tips from '../../utils/tips'
import produce from 'immer'
import ImageView from '../ImageView/ImageView'
import './style.scss'
import { AtIcon } from 'taro-ui'
class ImagePicker extends Component<
    PropsInterface,
    StateInterface
> {
    static externalClasses = ['img-class']
    constructor(props) {
        super(props)
        this.state = {
            thumbnail: []
        }
    }

    componentDidMount() {
        if (this.props.list) {
            this.setState({
                thumbnail: this.props.list
            })
        }
    }
    async choosePic() {
        const res = await choosePicGetBase64({ type: 'event' })
        // console.log(res);
        if (this.state.thumbnail.length === 9) {
            Tips.toast('图片不能超过9张')
            return
        }
        const arr = produce(this.state.thumbnail, draftState => {
            draftState.push(res)
        })

        this.setState({
            thumbnail: arr
        })
        this.props.onChange(arr)
    }
    removePic(index: number) {
        const arr = produce(this.state.thumbnail, draftState => {
            draftState.splice(index, 1)
        })
        this.setState({
            thumbnail: arr
        })
        this.props.onChange(arr)
    }
    render() {
        return (
            <View>
                {this.state.thumbnail.map((item, index) => {
                    return (
                        <ImageView
                            pathId={item}
                            key={item}
                            img-class='preview-image'
                            type='event'
                            onClick={() => {
                                this.removePic(index)
                            }}
                        />
                    )
                })}
                <AtIcon value='add' onClick={() => this.choosePic()} />
            </View>
        )
    }
}

export default ImagePicker
