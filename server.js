const serve = require('koa-static')
const Koa = require('koa')
const knex = require('knex')
const Router = require('@koa/router')
const configDB = require('./knexfile').development

const app = new Koa()
const router = new Router()

const database = knex(configDB)

app.use(serve('public'))

router.get('/api/files', async ctx => {
    ctx.body = await database.select().table('files')
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(process.env.PORT || 3000)

console.log(`listening on port ${process.env.PORT || 3000}`)
