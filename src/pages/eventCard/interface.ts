/**
 * state 参数类型
 *
 * @export
 * @interface stateInterface
 */
import { IMG_TYPE } from '../../globalData/globalInterface'
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
    inviteeItem: number;
    editStatus: boolean;
    test: string;
}

/**
 * props 参数类型
 *
 * @export
 * @interface propsInterface
 */
export interface propsInterface {
    identity: string;
    type: IMG_TYPE
}

export interface Filter {
    scope: "校区" | "角色",
    value: string
}
export interface Rule {
    type: "list" | "filters",
    content: number[] | Filter[]
}
