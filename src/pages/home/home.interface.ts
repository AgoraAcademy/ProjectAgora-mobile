/**
 * home.state 参数类型
 *
 * @export
 * @interface homeState
 */
export interface homeState {
    pushList: Array<any>;
    chooseType: string;
    noticeList: Array<any>;
    members: Array<any>;
    statusBarHeight: number;
    isIPX: boolean;
}

/**
 * home.props 参数类型
 *
 * @export
 * @interface homeProps
 */
export interface homeProps {}
