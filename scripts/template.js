/**
 * pages页面快速生成脚本 
 * 用法：npm run template `文件名`
 */

const fs = require('fs');

const dirName = process.argv[2];
const capDirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1);
if (!dirName) {
    console.log('文件夹名称不能为空！');
    console.log('示例：npm run template test');
    process.exit(0);
}

//页面模板
const indexTemplate = `
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { ${capDirName}Props, ${capDirName}State } from './${dirName}.interface'
import './${dirName}.scss'
// import { } from '../../components'

// @connect(({ ${dirName} }) => ({
//     ...${dirName},
// }))

class ${capDirName} extends Component<${capDirName}Props,${capDirName}State > {
    config:Config = {
        navigationBarTitleText: '标题'
    }
    constructor(props: ${capDirName}Props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <View className='${dirName}-wrap'>
                
            </View>
        )
    }
    }

export default ${capDirName}
`

// scss文件模版
const scssTemplate = `
${dirName}-wrap {
    width: 100%;
    min-height: 100vh;
}
`

// config 接口地址配置模板
const configTemplate = `
export default {
    test: '/wechat/perfect-info', //xxx接口
}
`
// 接口请求模板
const serviceTemplate = `
import Api from '../../utils/request'

export const testApi = data => Api.test(
    data
)
`

//model模板

const modelTemplate = `
// import Taro from '@tarojs/taro';
import * as ${dirName}Api from './service';

export default {
    namespace: '${dirName}',
    state: {
    },

    effects: {},

    reducers: {}

}
`

const interfaceTemplate = `
/**
 * ${dirName}.state 参数类型
 *
 * @export
 * @interface ${capDirName}State
 */
export interface ${capDirName}State {}

/**
 * ${dirName}.props 参数类型
 *
 * @export
 * @interface ${capDirName}Props
 */
export interface ${capDirName}Props {}
`

fs.mkdirSync(`./src/pages/${dirName}`); // mkdir $1
process.chdir(`./src/pages/${dirName}`); // cd $1

fs.writeFileSync(`${dirName}.tsx`, indexTemplate); //tsx
fs.writeFileSync(`${dirName}.scss`, scssTemplate); // scss
fs.writeFileSync('config.ts', configTemplate); // config
fs.writeFileSync('service.ts', serviceTemplate); // service
fs.writeFileSync('model.ts', modelTemplate); // model
fs.writeFileSync(`${dirName}.interface.ts`, interfaceTemplate); // interface
process.exit(0);