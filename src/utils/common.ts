import Taro from '@tarojs/taro'
import { MAINHOST } from '../config'
import { IMG_TYPE } from '../globalData/globalInterface'
/** 时间格式的转换 */
export const formatTime = time => {
    ; `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(
        time.getSeconds()
    )}.${pad(time.getMilliseconds(), 3)}`
}

export function choosePicGetUrl(option: {
    type: IMG_TYPE
}): Promise<string> {
    const token = Taro.getStorageSync('token')
    console.log(option, option.type)
    return new Promise((resolve, reject) => {
        Taro.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: function (res) {
                Taro.uploadFile({
                    url:
                        MAINHOST +
                        '/utilities/picture?pictureType=' +
                        option.type,
                    filePath: res.tempFilePaths[0],
                    name: 'picture',
                    header: {
                        'Content-Type': 'multipart/form-data',
                        token: token
                    },

                    success: function (result) {
                        console.log({
                            result
                        })
                        
                        var resultData = JSON.parse(result.data)
                        console.log({
                            resultData,
                            url:resultData.data.url
                        })
                        resolve(resultData.data.url)
                        
                    },
                    fail: function (e) {
                        console.log(e)
                        reject(e)
                    }
                })
            },
            fail: function (err) {
                reject(err)
            }
        })
    })
}
export function formatDate(time) {
    function _addZore(num) {
        if (num < 10) {
            num = '0' + num
        }
        return num
    }

    if (typeof time !== 'object') {
        time = '' + time
        if (time.length > 12) {
            time = new Date(parseInt(time))
        } else {
            time = new Date(parseInt(time) * 1000)
        }
    }
    var year = time.getFullYear()
    var month = _addZore(time.getMonth() + 1)
    var date = _addZore(time.getDate())
    var hours = _addZore(time.getHours())
    var minutes = _addZore(time.getMinutes())
    // var seconds = _addZore(time.getSeconds())
    var seconds = '00'
    return {
        year: year,
        month: month,
        date: date,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        str:
            year +
            '年' +
            month +
            '月' +
            date +
            '日 ' +
            hours +
            ':' +
            minutes +
            ':' +
            seconds,
        dates: year + '-' + month + '-' + date,
        times:
            year + '年' + month + '月' + date + '日 ' + hours + ':' + minutes,
        simpleTimes:
           month + '月' + date + '日' + hours + ':' + minutes,
        formatDate:
            year +
            '-' +
            month +
            '-' +
            date +
            'T' +
            hours +
            ':' +
            minutes +
            ':' +
            seconds +
            '+08:00'
    }
}

export function formatDateFromStr(str) {
    if (!str) return { text: '', timestamp: 0 }
    const result = str
        .split('+08:00')
        .shift()
        .split('T')
        .join(' ')
        .replace(/-/g, '/')
        .slice(0, -3)
    const date = formatDate(Date.parse(result))
    return {
        text: result,
        timestamp: Date.parse(result),
        simpleText: date.month + "月" + date.date + "日 " + date.hours + ":" + date.minutes
    }
}
export const globalData: any = {} // 全局公共变量
