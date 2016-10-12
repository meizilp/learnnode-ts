import * as express from 'express'
import * as bodyParser from 'body-parser'

import tasks from './service/tasks'

let app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api/tasks/v1', tasks)

let port = 3000
app.listen(port, () => {
    console.log(`Server running at port:${port}.`)
})

