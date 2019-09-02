import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { produce } from 'immer'
import { StateInterface, PropsInterface } from './interface'
import { choosePicGetUrl } from '../../utils/common'
import Tips from '../../utils/tips'
import ImageView from '../ImageView/ImageView'
import './style.scss'

class ImagePicker extends Component<PropsInterface, StateInterface> {
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
    componentWillReceiveProps(nextProps){
        if(nextProps.list){
            this.setState({
                thumbnail: nextProps.list
            })
        }
    }
    async choosePic() {
        const res = await choosePicGetUrl({ type: 'event' })
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
        // console.log({
        //     thum: this.state.thumbnail
        // })
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
