import * as KNex from 'knex'

async function openDatabase(path: string) {
    let knex = await KNex({
        client: 'sqlite3',
        connection: { filename: `${path}` },
        useNullAsDefault: true
    })
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

async function insertRecordsTransaction(db: KNex, tableName: string, people: Person[]) {
    let s = Date.now()
    try {
        await db.transaction(async trx => {
            for (let i = 0; i < people.length; ++i) {
                let person = people[i]
                person.create_at = Date.now()
                // console.log(`serial insert person ${person.name} ${person.create_at}`)
                await trx.insert(person).into(tableName)
                // if (i > 500) throw new Error('just want error')
            }
        })
    } catch (e) {
        console.log('catch an error when insert records in transaction')
        console.error(e)
    }
    let e = Date.now()
    console.log(`consume time insert ${people.length} records in transaction:${e - s}ms`)
}

async function insertRecordsSerial(db: KNex, tableName: string, people: Person[]) {
    let s = Date.now()
    for (let person of people) {
        person.create_at = Date.now()
        // console.log(`serial insert person ${person.name} ${person.create_at}`)
        await db(tableName).insert(person)
    }
    let e = Date.now()
    console.log(`consume time insert ${people.length} records in serial:${e - s}ms`)
}

async function insertrecordParallel(db: KNex, tableName: string, people: Person[]) {
    let s = Date.now()
    let promises = people.map(person => {
        person.create_at = Date.now()
        // console.log(`parallel insert person ${person.name} ${person.create_at}`)
        return db(tableName).insert(person)
    })
    await Promise.all(promises)
    let e = Date.now()
    console.log(`consume time insert ${people.length} records in parallel:${e - s}ms`)
}

async function insertRecords(db: KNex, tableName: string) {
    let people: Person[] = [
        { name: 'DaSa', age: 18, sex: 'female', deposit: 1000 },
        { name: 'LiSiSi', age: 32, sex: 'male', deposit: 2000 },
        { name: 'WangWu', age: 48, sex: 'male', deposit: 5000 },
        { name: 'ZhaoEr', age: 27, sex: 'male', deposit: 3000 }
    ]
    for (let i = 0; i < 1000; ++i) {
        people.push({ name: `DaSa${i}`, age: 18, sex: 'female', deposit: 1000 })
    }
    console.log('Prepare insert records in serial mode.')
    // await insertRecordsSerial(db, tableName, people)
    console.log('Prepare insert records in parallel mode.')
    // await insertrecordParallel(db, tableName, people)
    console.log('Prepare insert records in transaction mode.')
    await insertRecordsTransaction(db, tableName, people)
    return db
}

console.log('Prepare open database and insert records.')

async function run() {
    try {
        let tableName = 'tbl1'
        let db = await openDatabase(`${__dirname}/KNEX_DEMO.db`)
        await createTable(db, tableName)
        await insertRecords(db, tableName)
        await db.destroy()
    } catch (e) {
        console.error(e)
    }
}

run()

console.log('Insert records in background.')

//TODO transcation and speed of serial vs parallel.notice not paramise create time.