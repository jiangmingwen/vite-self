const path = require('path')
const fs = require('fs').promises
const { resolveVue } = require('../utils')
const defaultExportRe = /((?:^|\n|;)\s*)export default/

function vuePlugin ({ app, root }) {
    app.use(async (ctx, next) => {
        if (!ctx.path.endsWith('.vue')) {
            return next()
        }
        //vue 文件处理
        const filePath = path.join(root, ctx.path)

        const content = await fs.readFile(filePath, 'utf-8');//App.vue的中的内容
        let { parse, compileTemplate } = require(resolveVue(root).compiler)
        let { descriptor } = parse(content)//解析文件内容
        if (!ctx.query.type) {
            let code = ``
            if (descriptor.script) {
                let content = descriptor.script.content
                let replaced = content.replace(defaultExportRe, '$1const __script =')
                code += replaced
            }

            if (descriptor.template) {
                const templateRequest = `${ctx.path}?type=template`
                code+= `\nimport {render as __render} from ${JSON.stringify(templateRequest)}`
                code+=`\n__script.render = __render`
            }
            ctx.type = 'js'
            code += `\nexport default __script`
            ctx.body = code
        }

        if(ctx.query.type === 'template'){
            ctx.type = 'js'
            let content = descriptor.template.content
            const {code } = compileTemplate({source: content})
            ctx.body = code
        }
    })
}

exports.vuePlugin = vuePlugin