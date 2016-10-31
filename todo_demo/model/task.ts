import * as Knex from 'knex'

import MyDb from '../db/db'

namespace TaskSchema {
    export const version = 1
}

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

    static toSchema(o: any) {
        let s = o as TaskSchema
        let t: TaskSchema = {}
        if (s.id) t.id = s.id
        if (s.create_at) t.create_at = s.create_at
        if (s.update_at) t.update_at = s.update_at
        if (s.title) t.title = s.title
        if (s.note) t.note = s.note
        return t;
    }
}

export { TaskSchema }

export default Task
