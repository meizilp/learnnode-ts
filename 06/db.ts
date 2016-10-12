import * as sqlite3 from 'sqlite3'

let db = new sqlite3.Database(`${__dirname}/data.db`);

// db.serialize(function () {
//     db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT)");

//     var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     for (var i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }
//     stmt.finalize();

//     db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
//         console.log(row.id + ": " + row.info);
//     });
// });

export default db
