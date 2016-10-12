import * as sqlite3 from 'sqlite3'

/**
 * Task
 */
class Task {
    static tableName = "tasks"

    id: number
    createAt: Date
    updateAt: Date
    title: string
    note: string

    constructor(title = "", note = "") {
        let now = new Date()
        this.id = now.getTime()
        this.createAt = this.updateAt = now
        this.title = title
        this.note = note
    }

    save(db: sqlite3.Database) {
        let sql = `INSERT INTO ${Task.tableName} ( \
            id, createAt, updateAt, title, note \
        ) VALUES ( \
            ${this.id}, '${this.createAt.toLocaleString()}', '${this.updateAt.toLocaleString()}', '${this.title}', '${this.note}' \
        )`
        db.run(sql)
    }

    static createTable(db: sqlite3.Database) {
        let sql = `CREATE TABLE IF NOT EXISTS ${Task.tableName} (
                id INTEGER PRIMARY KEY NOT NULL UNIQUE, 
                createAt TEXT NOT NULL, 
                updateAt TEXT NOT NULL, 
                title TEXT, 
                note TEXT)`
        db.run(sql)
    }

    static createIndex() {

    }
}

export default Task
