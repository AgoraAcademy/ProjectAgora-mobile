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
    selectorChecked: number[];
    show: boolean;
    statusBarHeight: number;
    first: boolean;
}

/**
 * props 参数类型
 *
 * @export
 * @interface propsInterface
 */
export interface propsInterface {
    onChange: Function;
    idList: Array<any>;
    onShowChange: Function;
    onGroupChange: Function;
}
