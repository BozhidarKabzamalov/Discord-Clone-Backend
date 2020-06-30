let mysql = require('mysql2')

let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'discord',
    password: 'root'
})

module.exports = pool.promise()
