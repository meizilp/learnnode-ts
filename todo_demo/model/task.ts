import * as Knex from 'knex'

import MyDb from '../db/db'

interface TaskSchema {
    id?: number
    title?: string
    note?: string
    create_at?: number
    update_at?: number
}

/**
 * Task
 */
class Task {
    data: TaskSchema
    constructor(input: TaskSchema) {
        if (input) {
            this.data = { id: Date.now() }
            this.create_at = this.update_at = Date.now()
            if (input.title) this.title = input.title
            if (input.note) this.note = input.note
        } else {
            this.data = { id: 0 }
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
        return await MyDb.getInstance(Task.table_name)
            .insert(this.data)
    }

    async deleteFromDb() {
        return await MyDb.getInstance(Task.table_name)
            .where({ id: this.id })
            .delete()
    }

    static async deleteFromDb(id: number) {
        return await MyDb.getInstance(Task.table_name)
            .where({ id: id })
            .delete()
    }

    static async updateToDb(id: number, data: TaskSchema) {
        data.update_at = Date.now()
        return await MyDb.getInstance(Task.table_name)
            .where({ id: id })
            .update(data)
    }

    static table_name = 'task'
    static async createTable(db: Knex) {
        if (await db.schema.hasTable(Task.table_name) === false) {
            await db.schema.createTable(Task.table_name, tableBuilder => {
                tableBuilder.integer('id').primary()
                tableBuilder.string('title')
                tableBuilder.string('note', 4096)
                tableBuilder.integer('create_at')
                tableBuilder.integer('update_at')
            })
        }
    }

    static async getAll() {
        return await MyDb.getInstance(Task.table_name)
            .where(true)
    }

    static async queryById(id: number) {
        return await MyDb.getInstance(Task.table_name)
            .where({ id: id })
    }
}

export { TaskSchema }

export default Task
