import * as Knex from 'knex'

import Task from '../model/task'
import TaskComment from '../model/comment'
import Tag from '../model/tag'
import TaskTag from '../model/task_tag'

let _db: Knex

async function createTable(db) {
    Task.createTable(db)
    TaskComment.createTable(db)
    Tag.createTable(db)
    TaskTag.createTable(db)
}

async function createIndex(db) {

}

async function openDatabase(config: Knex.Config) {
    if (_db) {
        return _db
    }
    else {
        _db = await Knex(config)
        await createTable(_db)
        await createIndex(_db)
        return _db
    }
}

export default openDatabase
