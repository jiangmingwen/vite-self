const Koa = require('koa')
const { serverStaticPlugin } = require('./plugins/serverStaticServerPlugin')
const { moduleRewritePlugin } = require('./plugins/serverModuleRewritePlugin')
const { moduleResolvePlugin } = require('./plugins/serverModuleResolvePlugin')
const { vuePlugin } = require('./plugins/serverVuePlugin')

function createServer () {
    const app = new Koa()
    const root = process.cwd()//当前命令运行的路径
    //koa 是基于中间件来运行的
    const context = {
        app,
        root,

    }
    const resolvePlugins = [//插件的集合
        //解析import语法 重写路径
        moduleRewritePlugin,
        moduleResolvePlugin,
        vuePlugin,
        //实现静态服务的功能

        serverStaticPlugin
    ]
    resolvePlugins.forEach(Plugin => Plugin(context))

    return app
}

module.exports = createServer