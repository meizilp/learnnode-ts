import * as Knex from 'knex'
import { TableInfoSchema, TableInfo } from './table_info'
import { TaskSchema } from '../model/task'
import { CommentSchema } from '../model/comment'
import { TagSchema } from '../model/tag'
import TaskTag from '../model/task_tag'

interface TableSchema {
    name: string
    version: number
    updateFuncs: ((db: Knex) => Promise<number>)[]
}

class MyDb {
    protected constructor() {

    }

    /*
     * 从给定的版本更新表和索引
    */
    private static async updateTableAndIndexFromVersion(ts: TableSchema, fromVersion: number, db: Knex) {
        if (fromVersion == ts.version) { //表的版本等于当前代码版本，无需执行升级操作
            return ts.version
        } else if (fromVersion > ts.version) { //表的版本比当前代码版本高，代码无法支持
            throw new Error(`Table ${ts.name}'s version ${fromVersion} > code version ${ts.version}`)
        } else {
            let newVersion: number = fromVersion
            for (; newVersion < ts.version;) { //不停升级直至新版本号不再小于代码的版本号
                let ufunc = ts.updateFuncs[newVersion]
                if (ufunc) {
                    newVersion = await ufunc(db)
                } else {
                    throw new Error(`Don't support update table ${ts.name} from version ${fromVersion}!`)
                }
            }
            if (newVersion == ts.version) return newVersion //等于最新版本，升级完毕
            else throw new Error(`Table ${ts.name}'s new version ${newVersion} > code version ${ts.version}!`) //>最新版本，不应该发生
        }
    }

    private static async updateTableAndIndex(db: Knex) {
        //确保table_info表存在
        await TableInfo.makeSureExist(db)
        //数组中的所有表都要检测是否需要升级
        let tables = [TableInfoSchema, TaskSchema, CommentSchema, TagSchema]
        for (let t of tables) {
            let dbVersion = await TableInfo.getTableVersion(t.name, db)
            let newVersion = await MyDb.updateTableAndIndexFromVersion(t, dbVersion, db)
            if (dbVersion != newVersion) {
                if (dbVersion == 0) {
                    TableInfo.insertToDb(t.name, newVersion, db)
                } else {
                    TableInfo.updateToDb(t.name, newVersion, db)
                }
            }
        }
        //所有表都升级完毕
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
