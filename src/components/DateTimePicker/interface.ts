/**
 *
 * @export
 * @interface StateInterface
 */
export interface StateInterface {
    show: boolean;
    time: any;
    minTime: number;
}

/**
 * identity.props 参数类型
 *
 * @export
 * @interface PropsInterface
 */
export interface PropsInterface {
    onChange: Function;
    placeholder?: string;
    initTime?: string;
    // show: boolean
}
