import * as Knex from 'knex'

import MyDb from '../db/db'

namespace TaskSchema {
    export const name = 'task'
    export const version = 2
    export const updateFuncs = [updateTableAndIndexV0, updateTableAndIndexV1]

    export namespace fields {
        export const ID = 'id'
        export const CREATE_AT = 'create_at'
        export const UPDATE_AT = 'update_at'
        export const TITLE = 'title'
        export const NOTE = 'note'
        export const COMPLETED = 'completed'
    }
    
    /*
     * 更新表和索引。返回执行此步操作后表的版本号。
     */
    async function updateTableAndIndexV1(db: Knex) {
        await updateTableV1(db)
        await updateIndexV1(db)
        return 2
    }
    async function updateTableV1(db: Knex) {
        await db.schema.table(TaskSchema.name, tableBuilder => {
            tableBuilder.boolean(TaskSchema.fields.COMPLETED)
        })
    }
    async function updateIndexV1(db: Knex) {
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
        if (await db.schema.hasTable(TaskSchema.name) === false) {
            await db.schema.createTable(TaskSchema.name, tableBuilder => {
                tableBuilder.integer(TaskSchema.fields.ID).primary()
                tableBuilder.integer(TaskSchema.fields.CREATE_AT)
                tableBuilder.integer(TaskSchema.fields.UPDATE_AT)
                tableBuilder.string(TaskSchema.fields.TITLE)
                tableBuilder.string(TaskSchema.fields.NOTE, 4096)
            })
        }
    }
    async function updateIndexV0(db: Knex) {
    }
}

interface TaskSchema {
    id?: number
    create_at?: number
    update_at?: number
    title?: string
    note?: string
    completed?: boolean
}

/**
 * Task
 */
class Task {
    data: TaskSchema
    constructor(input: TaskSchema) {
        if (input) {
            this.data = Task.toSchema(input)
            if (!this.id) this.id = Date.now()
            if (!this.create_at) this.create_at = Date.now()
            if (!this.update_at) this.update_at = Date.now()
        } else {
            this.data = { id: Date.now() }
        }
    }

    set id(v) {
        this.data.id = v
    }

    get id() {
        return this.data.id
    }

    set title(v) {
        this.data.title = v
    }

    get title() {
        return this.data.title
    }

    set note(v) {
        this.data.note = v
    }

    get note() {
        return this.data.note
    }

    set create_at(v) {
        this.data.create_at = v
    }

    get create_at() {
        return this.data.create_at
    }

    set update_at(v) {
        this.data.update_at = v
    }

    get update_at() {
        return this.data.update_at
    }

    async insertToDb() {
        return await MyDb.getQueryBuilder(TaskSchema.name)
            .insert(this.data)
    }

    async deleteFromDb() {
        return await MyDb.getQueryBuilder(TaskSchema.name)
            .where({ id: this.id })
            .delete()
    }

    static async deleteFromDb(id: number) {
        return await MyDb.getQueryBuilder(TaskSchema.name)
            .where({ id: id })
            .delete()
    }

    static async updateToDb(id: number, data: TaskSchema) {
        data.update_at = Date.now()
        return await MyDb.getQueryBuilder(TaskSchema.name)
            .where({ id: id })
            .update(data)
    }

    static async getAll() {
        return await MyDb.getQueryBuilder(TaskSchema.name)
            .where(true)
    }

    static async queryById(id: number) {
        return await MyDb.getQueryBuilder(TaskSchema.name)
            .where({ id: id })
    }

    static toSchema(o: any) {
        let s = o as TaskSchema
        let t: TaskSchema = {}
        for (let x in TaskSchema.fields) {
            if (s[TaskSchema.fields[x]]) t[TaskSchema.fields[x]] = s[TaskSchema.fields[x]]
        }
        return t;
    }
}

export { TaskSchema, Task }