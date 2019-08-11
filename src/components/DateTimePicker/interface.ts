/**
 *
 * @export
 * @interface StateInterface
 */
export interface StateInterface {
    show: boolean,
    time:any
    timeStr:string
    minTime:number
}

/**
 * identity.props 参数类型
 *
 * @export
 * @interface PropsInterface
 */
export interface PropsInterface {
    onchange: Function
    placeholder?:string
    // show: boolean
}
