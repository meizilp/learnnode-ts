import * as Knex from 'knex'
import MyDb from '../db/db'

/*
 * 表更新机制：
 * 1.在db中创建有名称为"table_info"的表，保存有数据库中所有表的名称和版本号。
 * 2.打开数据库后，读取所有表的信息。
 * 3.尝试更新表。
 *   如果数据库中版本==代码中版本，那么表是最新版本，无需更新；
 *   如果数据库中版本>代码中版本，那么代码版本太旧，无法使用这个数据库；
 *   如果数据库中版本<代码中版本，那么代码可以升级数据库版本；
 *      获取当前版本升级的函数；
 *      如果成功获取到则执行升级函数，得到返回的新版本号；否则不支持此版本的数据库升级。
 *      如果新版本号仍然<代码版本，那么重复上述操作；
 *      如果新版本号==代码版本，则升级成功，返回最新版本号；（调用者负责更新表的版本信息）
 *      如果新版本号>代码版本，则异常。
 */

namespace TableInfoSchema {
    export const name = 'table_info'
    export const version = 1
    export const updateFuncs = [updateTableAndIndexV0]

    export namespace fields {
        export const CREATE_AT = 'create_at'
        export const UPDATE_AT = 'update_at'
        export const NAME = 'name'
        export const VERSION = 'version'
    }
    /*
     * 更新表和索引。返回执行此步操作后表的版本号。
     * 版本0比较特殊，要创建表，而且可以合并后续版本，一次更新多个版本。
     */
    async function updateTableAndIndexV0(db: Knex) {
        await updateTableV0(db)
        await updateIndexV0(db)
        return 1
    }
    async function updateTableV0(db: Knex) {
    }
    async function updateIndexV0(db: Knex) {
    }
}

interface TableInfoSchema {
    create_at?: number
    update_at?: number
    name?: string
    version?: number
}

class TableInfo {

    static async updateToDb(table_name: string, version: number, db: Knex) {
        let toUpdateData = { version: version, update_at: Date.now() }
        return await db(TableInfoSchema.name)
            .where({ name: table_name })
            .update(toUpdateData)
    }

    static async insertToDb(table_name: string, version: number, db: Knex) {
        let toInsertData: TableInfoSchema = { name: table_name, version: version }
        toInsertData.create_at = toInsertData.update_at = Date.now()
        return await db(TableInfoSchema.name)
            .insert(toInsertData)
    }

    /*
     * 查询指定名称表的版本信息。
     * 如果不存在返回空数组？
     */
    static async getTableVersion(table_name: string, db: Knex): Promise<number> {
        try {
            let q = db(TableInfoSchema.name)
                .column(TableInfoSchema.fields.VERSION)
                .where({ name: table_name })
            let result: { version: number }[] = await q
            if (result.length == 1) return result[0].version
            else if (result.length == 0) return 0
            throw new Error(`Got table's version count : ${result.length}!`)
        } catch (e) {
            console.error(e)
        }
    }

    /*
     * 确保table_info表创建。因为这个表用于版本管理，所以比较特殊。
     */
    static async makeSureExist(db: Knex) {
        if (await db.schema.hasTable(TableInfoSchema.name) === false) {
            await db.schema.createTable(TableInfoSchema.name, tableBuilder => {
                tableBuilder.integer(TableInfoSchema.fields.CREATE_AT)
                tableBuilder.integer(TableInfoSchema.fields.UPDATE_AT)
                tableBuilder.string(TableInfoSchema.fields.NAME).primary
                tableBuilder.integer(TableInfoSchema.fields.VERSION)
            })
        }
    }
}

export { TableInfoSchema, TableInfo }