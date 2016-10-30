import * as Knex from 'knex'

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

    static table_name = 'task_tag'
    static async createTable(db: Knex) {
        if (await db.schema.hasTable(TaskTag.table_name) === false) {
            await db.schema.createTable(TaskTag.table_name, tableBuilder => {
                tableBuilder.integer('id').primary()
                tableBuilder.integer('create_at')
                tableBuilder.integer('update_at')
                tableBuilder.integer('task_id')
                tableBuilder.integer('tag_id')
            })
        }
    }
}

export default TaskTag
