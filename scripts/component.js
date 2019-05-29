/**
 * pages页面快速生成脚本 
 * 用法：npm run component `文件名`
 */

const fs = require('fs');

const dirName = process.argv[2];
const capDirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1);
if (!dirName) {
    console.log('文件夹名称不能为空！');
    console.log('示例：npm run component test');
    process.exit(0);
}

//页面模板
const indexTemplate = `import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { ${capDirName}Props, ${capDirName}State } from './${dirName}.interface'
import './${dirName}.scss'

class ${capDirName} extends Component<${capDirName}Props,${capDirName}State > {
    constructor(props: ${capDirName}Props) {
        super(props)
        this.state = {}
    }
    static options = {
        addGlobalClass: true
    }
    static defaultProps:${capDirName}Props = {}

    render() {
        return (
        <View className='fx-${dirName}-wrap'>

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

fs.mkdirSync(`./src/components/${dirName}`); // mkdir $1
process.chdir(`./src/components/${dirName}`); // cd $1

fs.writeFileSync(`${dirName}.tsx`, indexTemplate); //tsx
fs.writeFileSync(`${dirName}.scss`, scssTemplate); // scss
fs.writeFileSync(`${dirName}.interface.ts`, interfaceTemplate); // interface
