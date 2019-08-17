/**
 *
 * @export
 * @interface StateInterface
 */
export interface StateInterface {
    routePath: string;
    overlayStatus: boolean;
}

/**
 * identity.props 参数类型
 *
 * @export
 * @interface PropsInterface
 */
export interface PropsInterface {
    type: 'normal-page' | 'child-page' | 'picker-page';
}
