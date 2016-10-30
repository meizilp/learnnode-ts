import * as Knex from 'knex'

interface TagSchema {
    id: number
    create_at?: number
    update_at?: number
    name?: string
}

/**
 * Tag
 */
class Tag {
    private data: TagSchema
    constructor() {
        this.data = { id: 0 }
    }

    get name() {
        return this.data.name
    }

    set name(v) {
        this.data.name = v
    }

    get create_at() {
        return this.data.create_at
    }

    set create_at(v) {
        this.data.create_at = v
    }

    get update_at() {
        return this.data.update_at
    }

    set update_at(v) {
        this.data.update_at = v
    }

    static table_name = 'tag'
    static async createTable(db: Knex) {
        if (await db.schema.hasTable(Tag.table_name) === false) {
            await db.schema.createTable(Tag.table_name, tableBuilder => {
                tableBuilder.integer('id').primary()
                tableBuilder.integer('create_at')
                tableBuilder.integer('update_at')
                tableBuilder.string('name')
            })
        }
    }
}

export default Tag
