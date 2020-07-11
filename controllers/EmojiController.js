let database = require('./DatabaseController')

module.exports.getEmoji = (req, res, next) => {
    return database.execute(
        'SELECT * FROM emoji'
    ).then(result => {
        res.send(result[0])
    })
    .catch((error) => {
        console.log(error)
    })
}
