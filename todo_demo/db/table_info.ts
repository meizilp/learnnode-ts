import * as Knex from 'knex'

namespace TableInfoSchema {
    export const name = 'table_info'
    export const version = 1
}

interface TableInfoSchema {
    name: string
    version: number
}

class TableInfo {
    data: TableInfoSchema
    static async getAll() {

    }

    static async updateTableAndIndex(fromVersion: number, db: Knex) {
        if (fromVersion == TableInfoSchema.version) { //表的版本等于当前代码版本，无需执行升级操作
            return TableInfoSchema.version
        } else if (fromVersion > TableInfoSchema.version) { //表的版本比当前代码版本高，代码无法支持
            throw new Error(`Table ${TableInfoSchema.name}'s version ${fromVersion} > code version ${TableInfoSchema.version}`)
        } else {
            let newVersion: number = fromVersion
            for (; newVersion >= TableInfoSchema.version;) {
                let ufunc = TableInfo.getUpdateFuncByVersion(newVersion)
                if (ufunc) {
                    newVersion = await ufunc(db)
                } else {
                    throw new Error(`Can't update table ${TableInfoSchema.name} from version ${fromVersion}!`)
                }
            }
            return newVersion
        }
    }

    private static getUpdateFuncByVersion(fromVersion) {
        switch (fromVersion) {
            case 0:
                return TableInfo.updateTableAndIndexV0
            default:
                return null
        }
    }
    /*
     * 更新表和索引。返回执行此步操作后表的版本号。
     * 版本0比较特殊，要创建表，而且可以合并后续版本，一次更新多个版本。
     */
    private static async updateTableAndIndexV0(db: Knex) {
        await TableInfo.updateTableV0(db)
        await TableInfo.updateIndexV0(db)
        return 1
    }
    private static async updateTableV0(db: Knex) {
        if (await db.schema.hasTable(TableInfoSchema.name) === false) {
            await db.schema.createTable(TableInfoSchema.name, tableBuilder => {
                tableBuilder.integer('id').primary()
                tableBuilder.string('title')
                tableBuilder.string('note', 4096)
                tableBuilder.integer('create_at')
                tableBuilder.integer('update_at')
            })
        }
    }
    private static async updateIndexV0(db: Knex) {

    }
}

export { TableInfoSchema, TableInfo }