import * as express from 'express'
import db from '../db'
import Task from '../model/task'

let router = express.Router()

router.route("/")
    .get((req, res, next) => {
        res.status(200).json({ "msg": "You will be get all tasks." })
        next()
    })
    .post((req, res, next) => {
        let task = new Task(`Task ${Date.now()}`, `I am note. ${Date.now()}`)
        task.save(db)
        res.status(201).json({ "task": task.id })
        next()
    })

router.route("/:taskId")
    .get((req, res, next) => {
        next()
    })
    .put((req, res, next) => {
        next()
    })
    .delete((req, res, next) => {
        next()
    })

export default router
