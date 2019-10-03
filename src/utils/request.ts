import Taro, { Component } from '@tarojs/taro'
import { ISMOCK, MAINHOST } from '../config'
import { commonParams, requestConfig } from '../config/requestConfig'
import Tips from './tips'

// import { createLogger } from './logger'

declare type Methods =
    | 'GET'
    | 'OPTIONS'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT'
declare type Headers = { [key: string]: string }
declare type Datas = { method: Methods;[key: string]: any }
interface Options {
    url: string
    host?: string
    method?: Methods
    data?: Datas
    header?: Headers
}

export class Request {
    //登陆的promise
    static loginReadyPromise: Promise<any> = Promise.resolve()
    // 正在登陆
    static isLogining: boolean = false
    // 导出的api对象
    static apiLists: { [key: string]: () => any } = {}
    // token
    // static token: string = ''

    // constructor(setting) {

    // }
    /**
     * @static 处理options
     * @param {Options | string} opts
     * @param {Datas} data
     * @returns {Options}
     * @memberof Request
     */
    static combineOptions(opts, data: Datas, method: Methods): Options {
        typeof opts === 'string' && (opts = { url: opts })
        console.log(
            'lalala',
            {
                data: { ...commonParams, ...opts.data, ...data },
                method: opts.method || data.method || method || 'GET',
                url: `${opts.host || MAINHOST}${opts.url}`
            },
            'opts',
            opts,
            'data',
            data
        )
        return {
            data: { ...commonParams, ...opts.data, ...data },
            method: opts.method || data.method || method || 'GET',
            url: `${opts.host || MAINHOST}${opts.url}`
        }
    }
    static getCurrentPages() {
        const pages = Taro.getCurrentPages()
        const currentPage = pages[pages.length - 1]
        return currentPage
    }
    static getToken() {
        return Taro.getStorageSync('token')
    }
    static goAuthorize() {
        if(this.isAuditMode()){
            return 
        }
        const route = this.getCurrentPages().route
        // console.log({
        //     route
        // })
        if (route !== 'pages/authorize/authorize') {
            Taro.navigateTo({ url: '/pages/authorize/authorize' })
        }
    }

    /**
     *
     * @static request请求 基于 Taro.request
     * @param {Options} opts
     */
    static async request(opts: Options) {
        // token不存在或learnerFullName不存在
        if (!this.getToken()) {
            
            // await this.dealLogin()
            this.goAuthorize()
            return Promise.reject()
        }  
        

        // token存在
        Object.assign(opts, { header: { token: this.getToken() } })
        //  Taro.request 请求
        console.log('before TaroRequest', opts)
        const res = await Taro.request(opts)
       
        const code = res.data.code
        if (code === -1001) {
            this.goAuthorize()
            return Promise.reject()
        }

        // 是否mock
        if (ISMOCK) {
            return res.data
        }

        // 请求成功
        if (code === 0) {
            return res.data
        }

        // 请求错误
        const d = {
            ...res.data,
            err: (res.data && res.data.msg) || `网络错误～`
        }
        // await this.login()
        Tips.toast(d.err)
        // console.log("鉴权失败")
        // Taro.redirectTo({ url: '/pages/authorize/authorize' }).then(() =>
        //     Tips.toast('鉴权失败，请尝试重新授权。如果依然失败，请联系管理员')
        // )
        throw new Error(d.err)
    }

    /**
     *
     * @static 登陆
     * @returns  promise
     * @memberof Request
     */
    static login() {
        if (!this.isLogining) {
            this.loginReadyPromise = this.onLogining()
        }
        return this.loginReadyPromise
    }
    static async checkLogin() {
        return new Promise(async (resolve,reject) => {
            if(this.isAuditMode()){
               return 
            }
            if (!Taro.getStorageSync('code')) {
                const { code } = await Taro.login()
                Taro.setStorageSync('code', code)
                console.log('刷新 taro login')
                resolve()
                return
            }
            Taro.checkSession({
                success() {
                    console.log('已有,不需要刷新login')
                    resolve()
                },
                async fail() {
                    const { code } = await Taro.login()
                    await Taro.setStorageSync('code', code)
                    console.log('刷新 taro login')
                    resolve()
                }
            })
        })
    }
    static isAuditMode(){
        console.log(Taro.getStorageSync('mode')==='audit')
        return Taro.getStorageSync('mode')==='audit'
    }
    static async dealLogin() {
        await this.checkLogin()
        if(this.isAuditMode()){
           
            return true
        }
        try {
            const res = await Taro.request({
                url: `${MAINHOST}${requestConfig.loginUrl}`,
                data: { js_code: Taro.getStorageSync('code') }
            })
            const data = res.data.data
            if (res.data.code === -1008 ) {
                console.log(res.data,'999')
                await Taro.setStorageSync('token', data.token)
                Taro.navigateTo({
                    url: '/pages/identity/identity'
                })
                return Promise.reject()
            }
            if(res.data.code === -1005){
                Taro.clearStorageSync()
                // await this.dealLogin()
                // await this.checkLogin()
                // const res = await Taro.request({
                //     url: `${MAINHOST}${requestConfig.loginUrl}`,
                //     data: { js_code: Taro.getStorageSync('code') }
                // })
                // const _data = res.data.data 
                
                // await Taro.setStorageSync('token', _data.token)
                // Taro.navigateTo({
                //     url: '/pages/identity/identity'
                // })
                return Promise.reject()
            }
            console.log('o.ooooo')
            await Taro.setStorageSync('token', data.token)
            await Taro.setStorageSync('learnerFullName', data.learnerFullName)
            await Taro.setStorageSync('unionid', data.unionid)
            await Taro.setStorageSync('isAdmin', data.isAdmin)
            await Taro.setStorageSync('learnerId', data.learnerId)
            await Taro.setStorageSync('branch', data.branch)
           
            return true
        } catch (err) {
            console.log(err)
            // Taro.navigateTo({
            //     url: '/pages/identity/identity'
            // })
        }
    }
    /**
     *
     * @static 登陆的具体方法
     * @returns
     * @memberof Request
     */
    static async onLogining() {
        this.isLogining = true
        try {
            console.log('check session success ooo')
            // await Taro.checkSession()
            await this.dealLogin()
            // const currentUnionid = await Taro.getStorageSync('unionid')
            // if (!currentUnionid) {
            //     console.log('重定向 1')
            //     Taro.navigateTo({ url: '/pages/identity/identity' })
            // } else {
            //     Taro.switchTab({ url: '/pages/home/home' })
            // }
            this.isLogining = false
        } catch (error) {
            console.log('check session fail', error)
            // 请求登录
            try {
                this.goAuthorize()
                this.isLogining = false
            } catch (err) {
                console.log(err)
            }

            console.log('调用登录接口')
        }
    }

    /**
     *
     * @static  创建请求函数
     * @param {(Options | string)} opts
     * @returns
     * @memberof Request
     */
    static creatRequests(opts: Options | string): () => {} {
        return async (data = {}, method: Methods = 'GET') => {
            const _opts = this.combineOptions(opts, data, method)
            const res = await this.request(_opts)
            // createLogger({ title: 'request', req: _opts, res: res })
            return res
        }
    }

    /**
     *
     * @static 抛出整个项目的api方法
     * @returns
     * @memberof Request
     */
    static getApiList(requestConfig) {
        if (!Object.keys(requestConfig).length) return {}

        Object.keys(requestConfig).forEach(key => {
            this.apiLists[key] = this.creatRequests(requestConfig[key])
        })
        return this.apiLists
    }
}

// 导出
const Api = Request.getApiList(requestConfig)
Component.prototype.$api = Request.request.bind(Request)
Component.prototype.$login = Request.login.bind(Request)
Component.prototype.$dealLogin = Request.dealLogin.bind(Request)

export default Api as any
