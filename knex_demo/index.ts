import * as KNex from 'knex'

async function openDatabase(path: string) {
    let knex = await KNex({ client: 'sqlite3', connection: { filename: `${path}` }, useNullAsDefault: true })
    console.log('database opened!')
    return knex
}

async function createTable(db: KNex, tableName: string) {
    let isExist = await db.schema.hasTable(tableName)
    if (isExist) {
        console.log('table is exist.')
        return db
    }
    else {
        await db.schema.createTable(tableName, (tableBuilder) => {
            tableBuilder.increments('id').primary().notNullable()
            tableBuilder.string('name').notNullable()
            tableBuilder.integer('age').defaultTo(0)
            tableBuilder.string('sex').defaultTo('male')
            tableBuilder.integer('deposit')
            tableBuilder.integer('create_at')
        })
        console.log('table created!')
        return db
    }
}

interface Person {
    id?: number
    name: string,
    age: number,
    sex: 'male' | 'female'
    deposit: number,
    create_at?: number
}

async function insertRecordsSerial(db: KNex, tableName: string, people: Person[]) {
    for (let person of people) {
        person.create_at = Date.now()
        console.log(`serial insert person ${person.name}`)
        await db(tableName).insert(person)
    }
}

async function insertrecordParallel(db: KNex, tableName: string, people: Person[]) {
    let promises = people.map(person => {
        person.create_at = Date.now()
        console.log(`parallel insert person ${person.name}`)
        return db(tableName).insert(person)
    })
    await Promise.all(promises)
}

async function insertRecords(db: KNex, tableName: string) {
    let people: Person[] = [
        { name: 'DaSa', age: 18, sex: 'female', deposit: 1000 },
        { name: 'LiSiSi', age: 32, sex: 'male', deposit: 2000 },
        { name: 'WangWu', age: 48, sex: 'male', deposit: 5000 },
        { name: 'ZhaoEr', age: 27, sex: 'male', deposit: 3000 }
    ]
    console.log('Prepare insert records in serial mode.')
    await insertRecordsSerial(db, tableName, people)
    console.log('Prepare insert records in parallel mode.')
    await insertrecordParallel(db, tableName, people)
    return db
}

console.log('Prepare open database and insert records.')

openDatabase(`${__dirname}/KNEX_DEMO.db`)
    .then((db) => {
        return createTable(db, 'tbl1')
    })
    .then((db) => {
        return insertRecords(db, 'tbl1')
    })
    .then((db) => {
        console.log('insert records over.')
        db.destroy()
    })
    .catch((err) => {
        console.error(err)
    })

console.log('Insert records in background.')

//TODO transcation and speed of serial vs parallel