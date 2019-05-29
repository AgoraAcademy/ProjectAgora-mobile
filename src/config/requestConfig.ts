import index from '../pages/index/config' // index接口
import authorize from '../pages/authorize/config'
/** 
 * 请求的公共参数
 */
export const commonParams = {}

/**
 * 请求映射文件
 */
export const requestConfig = {
    loginUrl: '/login', // 微信登录接口
    ...index,
    ...authorize
}