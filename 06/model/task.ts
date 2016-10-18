import * as sqlite3 from 'sqlite3'
import * as Knex from 'knex'

/**
 * Task
 */
class Task {
    static tableName = "tasks"

    id: number
    createAt: number
    updateAt: number
    title: string
    note: string

    constructor(title = "", note = "") {
        let now = new Date()
        this.id = now.getTime()
        this.createAt = this.updateAt = now.getTime()
        this.title = title
        this.note = note
    }

    save(db: sqlite3.Database) {
        let sql = `INSERT INTO ${Task.tableName} ( \
            id, createAt, updateAt, title, note \
        ) VALUES ( \
            ${this.id}, '${this.createAt}', '${this.updateAt}', '${this.title}', '${this.note}' \
        )`
        db.run(sql)
    }

    static createTable(db: sqlite3.Database) {
        let sql = `CREATE TABLE IF NOT EXISTS ${Task.tableName} (
                id INTEGER PRIMARY KEY NOT NULL UNIQUE, 
                createAt INTEGER NOT NULL, 
                updateAt INTEGER NOT NULL, 
                title TEXT, 
                note TEXT)`
        db.run(sql)
    }

    static createIndex() {

    }
}

export default Task
