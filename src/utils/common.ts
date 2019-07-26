import Taro from "@tarojs/taro";
import { MAINHOST } from "../config";
/** 时间格式的转换 */
export const formatTime = time => {
    `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(
        time.getSeconds()
    )}.${pad(time.getMilliseconds(), 3)}`;
};
export function choosePicGetBase64(): Promise<string> {
    const token = Taro.getStorageSync("token");
    return new Promise((resolve, reject) => {
        Taro.chooseImage({
            count: 1,
            sizeType: ["compressed"],
            sourceType: ["album"],
            success: function(res) {
                wx.uploadFile({
                    url: MAINHOST + "/utilities/pushMessage_picture",
                    filePath: res.tempFilePaths[0],
                    name: "pushMessage_picture",
                    header: { "Content-Type": "multipart/form-data", token: token  },
                    success: function(result) {
                        var resultData = JSON.parse(result.data);
                        console.log(resultData.url);
                        resolve(resultData.url);
                    },
                    fail: function(e) {
                        console.log(e);
                        reject(e);
                    }
                });
            },
            fail: function(err) {
                reject(err);
            }
        });
    });
}
export var globalData: any = {}; // 全局公共变量
