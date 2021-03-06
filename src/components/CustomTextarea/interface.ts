/**
 *
 * @export
 * @interface StateInterface
 */
export interface StateInterface {
    focus: boolean;
    content: string;
    firstStatus: boolean;
}

/**
 * identity.props 参数类型
 *
 * @export
 * @interface PropsInterface
 */
export interface PropsInterface {
    onInput: Function;
    placeholder: string;
    value: string;
}
