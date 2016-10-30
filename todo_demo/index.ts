import * as express from 'express'
import * as bodyParser from 'body-parser'

import openDatabase from './db/db'
import tasks from './services/tasks'

async function startServer() {
    await openDatabase({
        client: 'sqlite3',
        connection: { filename: `${__dirname}/knex.db` },
        useNullAsDefault: true
    })

    let app = express()

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    app.use('/tasks/v1', tasks)

    let port = 3000
    app.listen(port, () => {
        console.log(`Server running at port:${port}.`)
    })
}

startServer()
