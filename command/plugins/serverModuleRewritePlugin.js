const static = require('koa-static')
const path = require('path')
const { readContent } = require('../utils')
const { parse } = require('es-module-lexer')
const MagicString = require('magic-string')

function rewriteImports (content) {
    let imports = parse(content)[0]
    let magicString = new MagicString(content)
    if (imports.length) {
        //说明有多条import 语法
        imports.forEach(item => {
            let { s, e } = item
            let id = content.substring(s, e); //vue ./app
            if (/^[^\/\.]/.test(id)) {
                id = `/@modules/${id}`
                magicString.overwrite(s, e, id)
            }
        })
    }
    return magicString.toString();//增加了/@modules
}

function moduleRewritePlugin ({ app, root }) {
    //vite在哪里运行，就以哪个目录启动
    app.use(async (ctx, next) => {
        await next();
        if (ctx.body && ctx.response.is('js')) {
            let content = await readContent(ctx.body)
            let result = rewriteImports(content)
            ctx.body = result
        }

    })
}

//导出静态服务插件
exports.moduleRewritePlugin = moduleRewritePlugin