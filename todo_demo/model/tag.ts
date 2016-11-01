import * as Knex from 'knex'

namespace TagSchema {
    export const name = 'tag'
    export const version = 1
    export const updateFuncs = [updateTableAndIndexV0]

    export namespace fields {
        export const ID = 'id'
        export const CREATE_AT = 'create_at'
        export const UPDATE_AT = 'update_at'
        export const NAME = 'name'
    }

    async function updateTableAndIndexV0(db: Knex) {
        await updateTableV0(db)
        await updateIndexV0(db)
        return 1
    }
    async function updateTableV0(db: Knex) {
        if (await db.schema.hasTable(TagSchema.name) === false) {
            await db.schema.createTable(TagSchema.name, tableBuilder => {
                tableBuilder.integer(TagSchema.fields.ID).primary()
                tableBuilder.integer(TagSchema.fields.CREATE_AT)
                tableBuilder.integer(TagSchema.fields.UPDATE_AT)
                tableBuilder.string(TagSchema.fields.NAME)
            })
        }
    }
    async function updateIndexV0(db: Knex) {
    }
}

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
}

export { TagSchema, Tag }
