import * as express from 'express'
import * as Knex from 'knex'

//url: host/tasks/v1
let router = express.Router()

router.route('/')
    .get((req, res, next) => {
        //获取所有符合条件的Task
        next()
    })
    .post((req, res, next) => {
        //创建一个新的Task
        next()
    })

router.route('/:taskId')
    .get((req, res, next) => {
        //获取指定id的Task
    })
    .put((req, res, next) => {
        //更新指定id的Task
    })
    .delete((req, res, next) => {
        //删除指定id的Task
    })

export default router
