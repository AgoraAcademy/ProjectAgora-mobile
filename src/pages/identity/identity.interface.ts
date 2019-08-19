
/**
 * identity.state 参数类型
 *
 * @export
 * @interface IdentityState
 */
export interface IdentityState {
    familyName:string,
    givenName:string,
    role:string,
    birthday:string,
    branch:string,
    rolesList: Array<string>,
    branchsList: Array<string>,
}

/**
 * identity.props 参数类型
 *
 * @export
 * @interface IdentityProps
 */
export interface IdentityProps {
    identity:string
}
