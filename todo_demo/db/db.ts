import * as Knex from 'knex'
import Task from '../model/task'
import TaskComment from '../model/comment'
import Tag from '../model/tag'
import TaskTag from '../model/task_tag'

class MyDb {
    protected constructor() {

    }

    static async createTable(db) {
        Task.createTable(db)
        TaskComment.createTable(db)
        Tag.createTable(db)
        TaskTag.createTable(db)
    }

    static async createIndex(db) {

    }

    static db: Knex
    /*
     * 使用指定的config打开数据库
     */
    static async openDatabase(config: Knex.Config) {
        if (MyDb.db) return MyDb.db
        else {
            MyDb.db = await Knex(config)
            await MyDb.createTable(MyDb.db)
            await MyDb.createIndex(MyDb.db)
            return MyDb.db
        }
    }

    /*
     * 返回一个操作指定table的数据库对象
     */
    static getInstance(table: string) {
        if (MyDb.db) return MyDb.db(table)
        else throw new Error('Database not opened!')
    }
}

export default MyDb
