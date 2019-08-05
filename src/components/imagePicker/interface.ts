/**
 *
 * @export
 * @interface StateInterface
 */
export interface StateInterface {
    thumbnail: Array<string>
}

/**
 * identity.props 参数类型
 *
 * @export
 * @interface PropsInterface
 */
export interface PropsInterface {
    onChange: Function
    list?: Array<any>
}
