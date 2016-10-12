import * as express from 'express'
import db from '../db'

let router = express.Router()

router.route("/")
    .get((req, res, next) => {
        res.status(200).json({"msg":"You will be get all tasks."})
        next()
    })
    .post((req, res, next) => {
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
