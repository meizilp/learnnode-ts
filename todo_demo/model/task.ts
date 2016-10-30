import * as Knex from 'knex'

interface TaskSchema {
    id: number
    title?: string
    note?: string
    create_at?: number
    update_at?: number
}

/**
 * Task
 */
class Task {
    private data: TaskSchema
    constructor() {
        this.data = { id: 0 }
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
}

export default Task
