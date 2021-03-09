const moduleReg = /^\/@modules\//;//以 /@modules开头的
const fs = require('fs')

const { resolveVue } = require('../utils')



function moduleResolve ({ app, root }) {
    const vueResolved = resolveVue(root)
    app.use(async (ctx, next) => {
        if (!moduleReg.test(ctx.path)) {
            return next()
        }
        //讲/@modules替换掉
        const id = ctx.path.replace(moduleReg, '') // /@module/vue => vue

        //去当前项目下找真实的modules vue文件
        ctx.type = 'js'
        const content = fs.readFileSync(vueResolved[id], 'utf8')
        ctx.body = content
    })
}

exports.moduleResolvePlugin = moduleResolve