
/**
 * state 参数类型
 *
 * @export
 * @interface stateInterface
 */
export interface stateInterface {
    familyName:string,
    givenName:string,
    role:string,
    birthday:string,
    branch:string,
    isMentor:number,
    rolesList: Array<string>,
    branchsList: Array<string>,
}

/**
 * props 参数类型
 *
 * @export
 * @interface propsInterface
 */
export interface propsInterface {
    identity:string
}
