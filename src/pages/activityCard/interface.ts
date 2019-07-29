/**
 * activityCard.state 参数类型
 *
 * @export
 * @interface stateInterface
 */
export interface stateInterface {
    description: string;
    endDate: string;
    endTime: string;
    fee: string;
    location: Array<any>;
    recruitingUntilDate: string;
    recruitingUntilTime: string;
    startDate: string;
    startTime: string;
    title: string;
    invitee: Array<any>;
    inviteeList: Array<any>;
    thumbnail: Array<string>;
    files: Array<any>;
    loading: boolean;
    inviteeItem: number,
    editStatus: boolean
}

/**
 * activityCard.props 参数类型
 *
 * @export
 * @interface propsInterface
 */
export interface propsInterface {
    identity: string;
}
