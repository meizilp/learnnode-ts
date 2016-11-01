import * as Knex from 'knex'

namespace TaskTagSchema {
    export const name = 'task_tag'
    export const version = 1
    export const updateFuncs = [updateTableAndIndexV0]

    export namespace fields {
        export const ID = 'id'
        export const CREATE_AT = 'create_at'
        export const UPDATE_AT = 'update_at'
        export const TASK_ID = 'task_id'
        export const TAG_ID = 'tag_id'
    }

    async function updateTableAndIndexV0(db: Knex) {
        await updateTableV0(db)
        await updateIndexV0(db)
        return 1
    }
    async function updateTableV0(db: Knex) {
        if (await db.schema.hasTable(TaskTagSchema.name) === false) {
            await db.schema.createTable(TaskTagSchema.name, tableBuilder => {
                tableBuilder.integer(TaskTagSchema.fields.ID).primary()
                tableBuilder.integer(TaskTagSchema.fields.CREATE_AT)
                tableBuilder.integer(TaskTagSchema.fields.UPDATE_AT)
                tableBuilder.integer(TaskTagSchema.fields.TASK_ID)
                tableBuilder.integer(TaskTagSchema.fields.TAG_ID)
            })
        }
    }
    async function updateIndexV0(db: Knex) {
        await db.schema.table(TaskTagSchema.name, tableBuilder => {
            tableBuilder.index([TaskTagSchema.fields.TASK_ID])
            tableBuilder.index([TaskTagSchema.fields.TAG_ID])
        })
    }
}

interface TaskTagSchema {
    id: number
    create_at?: number
    update_at?: number
    task_id?: number
    tag_id?: number
}

/**
 * TaskTag
 */
class TaskTag {
    private data: TaskTagSchema
    constructor() {
        this.data = { id: 0 }
    }
}

export { TaskTagSchema, TaskTag }
