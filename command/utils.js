const { Readable} = require('stream')
const path = require('path')

async function readContent (stream) {
    //koa中要求所有的异步方法要包装成promise
    if(stream instanceof Readable){// 只对流
        return new Promise(resolve => {
            let res = ""
            stream.on('data', data => res += data)
            stream.on('end', () => resolve(res))
        })
    }else {
        return stream.toString()
    }
}


function resolveVue (root) {
    // vue3 由几部分组成： runtime-dom runtime-core reactivity shared,在后端中解析.vue文件
    //compiler-sfc
    //编译是在后端实现的，所以需要拿到的文件是commonjs规范的
    const compilePkgPath = path.join(root, 'node_modules', '@vue/compiler-sfc/package.json')
    const compilerPkg = require(compilePkgPath)
    const compilerPath = path.join(path.dirname(compilePkgPath), compilerPkg.main)

    const resolvePath = name => path.resolve(root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`)
    const runtimeDomPath = resolvePath('runtime-dom')
    const runtimeCorePath = resolvePath('runtime-core')
    const reactivityPath = resolvePath('reactivity')
    const sharedPath = resolvePath('shared')
    //esModule 模块
    return {
        compiler: compilerPath,
        '@vue/runtime-dom': runtimeDomPath,
        '@vue/runtime-core': runtimeCorePath,
        '@vue/reactivity': reactivityPath,
        '@vue/shared': sharedPath,
        vue: runtimeDomPath
    }
}

exports.readContent = readContent
exports.resolveVue = resolveVue