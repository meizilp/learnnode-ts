import * as Knex from 'knex'

interface CommentSchema {
    id: number
    create_at?: number
    update_at?: number
    content?: string
    task_id?: number
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

    static table_name = 'comment'
    static async createTable(db: Knex) {
        if (await db.schema.hasTable(TaskComment.table_name) === false) {
            await db.schema.createTable(TaskComment.table_name, tableBuilder => {
                tableBuilder.integer('id').primary()
                tableBuilder.integer('create_at')
                tableBuilder.integer('update_at')
                tableBuilder.string('content', 4096)
                tableBuilder.integer('task_id')                
            })
        }
    }
}

export default TaskComment
