const static = require('koa-static')
const path = require('path')

function serverStaticPlugin ({ app, root }) {
    //vite在哪里运行，就以哪个目录启动
    app.use(static(root))
    app.use(static(path.join(root, 'public')))
}

//导出静态服务插件
exports.serverStaticPlugin = serverStaticPlugin