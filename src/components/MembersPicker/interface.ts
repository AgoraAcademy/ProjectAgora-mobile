/**
 * state 参数类型
 *
 * @export
 * @interface stateInterface
 */
export interface stateInterface {
    list: Array<any>;
    choooseList: Array<any>;
    selector: Array<any>;
    selectorChecked: string[] | number[] | Object[];
    show: boolean;
}

/**
 * props 参数类型
 *
 * @export
 * @interface propsInterface
 */
export interface propsInterface {
    onChange: Function
}
