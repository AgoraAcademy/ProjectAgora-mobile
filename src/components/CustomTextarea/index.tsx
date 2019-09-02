import Taro, { PureComponent } from '@tarojs/taro'
import { View, Textarea, Text } from '@tarojs/components'
import { StateInterface, PropsInterface } from './interface'
import './style.scss'

class ComponentHomeNavigation extends PureComponent<
    PropsInterface,
    StateInterface
> {
    constructor(props) {
        super(props)

        this.state = {
            focus: false,
            content: '',
            firstStatus: true
        }
    }
    componentDidMount() {}
    componentWillReceiveProps(next) {
        if (next.value && this.state.firstStatus) {
            // console.log(next.value, this.state.firstStatus, 'componentWillReceiveProps')
            this.setState({
                content: next.value,
                firstStatus: false
            })
        }
    }
    onFocus() {
        this.setState({
            focus: true
        })
    }
    onBlur() {
        this.setState({
            focus: false
        })
    }
    onInput(ev) {
        this.setState({
            content: ev.detail.value
        })
        this.props.onInput(ev)
    }

    render() {
        return (
            <View className='custom-textarea'>
                {this.state.focus ? (
                    <Textarea
                      value={this.state.content}
                      autoHeight
                      onInput={ev => this.onInput(ev)}
                      placeholder={this.props.placeholder}
                      onBlur={() => this.onBlur()}
                      focus={this.state.focus}
                    ></Textarea>
                ) : (
                    <Text
                      onClick={() => this.onFocus()}
                      className='custom-textarea-text'
                    >
                        {this.state.content || this.props.placeholder}
                    </Text>
                )}
            </View>
        )
    }
}

export default ComponentHomeNavigation
