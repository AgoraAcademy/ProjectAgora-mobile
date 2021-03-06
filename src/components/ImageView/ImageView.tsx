import Taro, { PureComponent } from '@tarojs/taro'
import { Image } from '@tarojs/components'
import { StateInterface, PropsInterface } from './interface'
import { MAINHOST } from '../../config'

class ComponentHomeNavigation extends PureComponent<
    PropsInterface,
    StateInterface
> {
    static externalClasses = ['img-class']
    constructor(props) {
        super(props)
        this.state = {
            imgSrc: ''
        }
    }
    componentDidMount() {
        if (!this.props.pathId) {
            return
        }
        const token = Taro.getStorageSync('token')
        const _this = this
        Taro.downloadFile({
            url:
                MAINHOST +
                '/utilities/picture?uid=' +
                this.props.pathId +
                '&pictureType=' +
                this.props.type,
            header: { token },
            success(res) {
                _this.setState({
                    imgSrc: res.tempFilePath
                })
            },
            fail(err){
                console.log(err)
            }
        })
    }
    render() {
        if (this.state.imgSrc) {
            return (
                <Image
                  src={this.state.imgSrc}
                  className='img-class'
                  onClick={() => this.props.onClick()}
                />
            )
        }
        return
    }
}

export default ComponentHomeNavigation
