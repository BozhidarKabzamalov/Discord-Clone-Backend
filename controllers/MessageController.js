let Server = require('../models/Server')
let Message = require('../models/Message')
let Room = require('../models/Room')

module.exports.createMessage = async (req, res, next) => {
    let room = await Room.findByPk(req.body.roomId)

    let message = await room.createMessage({
        message: req.body.message,
        username: req.body.username,
        userId: req.body.userId
    })

    res.status(200).json({
        message: message
    })
}

module.exports.deleteMessage = async (req, res, next) => {

}
