/**
 * state 参数类型
 *
 * @export
 * @interface stateInterface
 */
import { IMG_TYPE } from '../../globalData/globalInterface'

export interface ILocation {
    name: string, //位置名称
    address: string, //详细地址
    latitude: string, //纬度
    longtitude: string, //经度
}
export interface stateInterface {
    description: string;
    endDateTime: string;
    fee: string;
    // location: Array<any>;
    expireDateTime: string;
    startDateTime: string;
    title: string;
    // invitee: Array<any>;
    // inviteeList: Array<any>;
    thumbnail: Array<string>;
    // files: Array<any>;
    loading: boolean;
    // inviteeItem: number;
    editStatus: boolean;
    membersChoose: Array<any>;
    // show: boolean;
    initiatorId: number | null;
    open: boolean;
    navigateType: 'normal-page' | 'child-page' | 'picker-page';
    location: string;
    groupChoose: Array<any>;
}

/**
 * props 参数类型
 *
 * @export
 * @interface propsInterface
 */
export interface propsInterface {
    identity: string;
    type: IMG_TYPE;
}

export interface Filter {
    scope: '校区' | '角色';
    value: string
}
export interface Rule {
    type: 'list' | 'filters';
    content: number[] | Filter[]
}


