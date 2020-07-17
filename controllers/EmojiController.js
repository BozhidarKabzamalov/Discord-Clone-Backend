let Emoji = require('../models/Emoji')

module.exports.getEmoji = (req, res, next) => {
    Emoji.findAll()
    .then(result => {
        res.send(result)
    })
    .catch(error => {
        console.log(error)
    })
}
