import * as express from 'express'
import * as Knex from 'knex'

import { Task, TaskSchema } from '../model/task'

//url: host/tasks/v1
let router = express.Router()

router.route('/')
    .get(async (req, res, next) => {
        //获取所有符合条件的Task
        let result: TaskSchema[] = await Task.getAll()
        res.status(200).json(result)
        next()
    })
    .post(async (req, res, next) => {
        //创建一个新的Task
        let task = new Task(Task.toSchema(req.body))
        await task.insertToDb()
        res.status(201).json(task.data)
        next()
    })

router.route('/:taskId')
    .get(async (req, res, next) => {
        //获取指定id的Task
        let result: TaskSchema[] = await Task.queryById(req.params.taskId)
        if (result.length == 0) {
            res.status(404).json({ code: 404, msg: `Task ${req.params.taskId} not found.` })
        } else if (result.length == 1) {
            res.status(200).json(result[0])
        } else {
            res.status(500).json({ msg: `There is ${result.length} records have id ${req.params.taskId}, something must be wrong!` })
        }
        next()
    })
    .put(async (req, res, next) => {
        //更新指定id的Task
        let result = await Task.updateToDb(req.params.taskId, Task.toSchema(req.body))
        if (result == 0) {
            res.status(404).json({ code: 404, msg: `Task ${req.params.taskId} not found.` })
        } else if (result == 1) {
            res.status(201).json({ count: result })
        } else {
            res.status(500).json({ msg: `Update ${result.length} records according to id ${req.params.taskId}, something must be wrong!` })
        }
        next()
    })
    .delete(async (req, res, next) => {
        //删除指定id的Task
        let result = await Task.deleteFromDb(req.params.taskId)
        if (result == 0) {
            res.status(404).json({ code: 404, msg: `Task ${req.params.taskId} not found.` })
        } else if (result == 1) {
            res.status(204).end()
        } else {
            res.status(500).json({ msg: `Deleted ${result.length} records according to id ${req.params.taskId}, something must be wrong!` })
        }
        next()
    })

export default router
