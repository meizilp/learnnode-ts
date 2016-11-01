import * as Knex from 'knex'

namespace CommentSchema {
    export const name = 'comment'
    export const version = 1
    export const updateFuncs = [updateTableAndIndexV0]

    export namespace fields {
        export const ID = 'id'
        export const CREATE_AT = 'create_at'
        export const UPDATE_AT = 'update_at'
        export const TASK_ID = 'task_id'
        export const CONTENT = 'content'
    }

    async function updateTableAndIndexV0(db: Knex) {
        await updateTableV0(db)
        await updateIndexV0(db)
        return 1
    }
    async function updateTableV0(db: Knex) {
        if (await db.schema.hasTable(CommentSchema.name) === false) {
            await db.schema.createTable(CommentSchema.name, tableBuilder => {
                tableBuilder.integer(CommentSchema.fields.ID).primary()
                tableBuilder.integer(CommentSchema.fields.CREATE_AT)
                tableBuilder.integer(CommentSchema.fields.UPDATE_AT)
                tableBuilder.integer(CommentSchema.fields.TASK_ID)
                tableBuilder.string(CommentSchema.fields.CONTENT, 4096)
            })
        }
    }
    async function updateIndexV0(db: Knex) {
        await db.schema.table(CommentSchema.name, tableBuilder => {
            tableBuilder.index([CommentSchema.fields.TASK_ID])
        })
    }
}

interface CommentSchema {
    id: number
    create_at?: number
    update_at?: number
    task_id?: number
    content?: string
}

/**
 * Comment
 */
class TaskComment {
    private data: CommentSchema
    constructor() {
        this.data = { id: 0 }
    }

    get id() {
        return this.data.id
    }

    set id(v) {
        this.data.id = v
    }

    get content() {
        return this.data.content
    }

    set content(v) {
        this.data.content = v
    }

    set task_id(v) {
        this.data.task_id = v
    }
}

export { CommentSchema, TaskComment }
