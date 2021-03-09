#! /usr/bin/env node

 
const createServer=  require('../command')
console.log('jay-vite')

createServer().listen(9000,()=>{
    console.log('你的服务跑在http://localhost:9000上')
})