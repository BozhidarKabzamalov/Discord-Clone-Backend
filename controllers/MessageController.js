let Server = require('../models/Server')
let Message = require('../models/Message')
let Room = require('../models/Room')
let User = require('../models/User')

module.exports.createMessage = async (req, res, next) => {
    let userId = req.body.tokenUserId
    let roomId = req.body.roomId

    let user = await User.findByPk(userId)
    let room = await Room.findByPk(roomId)
    let message = await Message.create({
        message: req.body.message
    })

    await user.addMessage(message)
    await room.addMessage(message)

    let finalMessage = await Message.findByPk(message.id, {
        include: {
            model: User,
            attributes: { exclude: ['password'] }
        }
    })

    res.status(200).json({
        message: finalMessage
    })
}

module.exports.deleteMessage = async (req, res, next) => {
    let messageId = req.body.messageId

    Message.destroy({
        where: {
            id: messageId
        }
    })

    res.status(200).json({
        message: 'Message deleted.'
    })
}
