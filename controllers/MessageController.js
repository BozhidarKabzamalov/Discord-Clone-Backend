let Server = require('../models/Server')
let Message = require('../models/Message')
let Room = require('../models/Room')

module.exports.sendMessage = async (req, res, next) => {
    let room = await Room.findByPk(req.body.roomId)

    let message = room.createMessage({
        message: req.body.message,
        username: req.body.username,
        userId: req.body.userId
    })

    res.status(200).json({
        message: message
    })
}
