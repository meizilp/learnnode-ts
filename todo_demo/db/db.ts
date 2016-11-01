import * as Knex from 'knex'
import Task from '../model/task'
import TaskComment from '../model/comment'
import Tag from '../model/tag'
import TaskTag from '../model/task_tag'
import { TableInfoSchema, TableInfo } from './table_info'


class MyDb {
    protected constructor() {

    }

    static async updateTableAndIndex(db: Knex) {
        //确保table_info表存在
        await TableInfo.makeSureExist(db)
        //尝试升级TableInfo表
        let dbVersion: number
        let newVersion: number
        dbVersion = await TableInfo.getTableVersion(TableInfoSchema.name, db)
        newVersion = await TableInfo.updateTableAndIndex(dbVersion, db)
        if (dbVersion != newVersion) {
            if (dbVersion == 0) {
                TableInfo.insertToDb(TableInfoSchema.name, newVersion, db)
            } else {
                TableInfo.updateToDb(TableInfoSchema.name, newVersion, db)
            }
        }
        return db
    }

    private static db: Knex
    /*
     * 使用指定的config打开数据库
     */
    static async openDatabase(config: Knex.Config) {
        if (MyDb.db) return MyDb.db
        else {
            MyDb.db = await Knex(config)
            return await MyDb.updateTableAndIndex(MyDb.db)
        }
    }

    /*
     * 返回一个操作指定table的数据库对象
     */
    static getQueryBuilder(table: string) {
        if (MyDb.db) return MyDb.db(table)
        else throw new Error('Database not opened!')
    }
}

export default MyDb
