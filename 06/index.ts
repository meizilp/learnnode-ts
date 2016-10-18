import * as express from 'express'
import * as bodyParser from 'body-parser'

import tasks from './service/tasks'

import * as Knex from 'knex'

async function createTable() {
    let knex = await Knex({ client: 'sqlite3', connection: { filename: `${__dirname}/knex.db` } })

    try {
        if (await knex.schema.hasTable('tbl1') === false) {
            await knex.schema.createTable('tbl1', (tableBuilder) => {
                tableBuilder.increments('id').primary().notNullable();
                tableBuilder.string('name').notNullable().unique();
            })
        }
    } catch (e) {
        console.error(e)
    }

    await knex.destroy()
    return true;
}

createTable()
    .then((result) => {
        console.log(`tabale created! ${result}`)
    })
    .catch((e) => {
        console.error(e)
    })

console.log('gogogo')

// let app = express()

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

// app.use('/api/tasks/v1', tasks)

// let port = 3000
// app.listen(port, () => {
//     console.log(`Server running at port:${port}.`)
// })

