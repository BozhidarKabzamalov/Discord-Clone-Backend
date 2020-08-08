let User = require('../models/User')
let Server = require('../models/Server')
let Room = require('../models/Room')

module.exports.createRoom = async (req, res, next) => {
    let serverId = req.body.serverId
    let userId = req.body.tokenUserId
    let name = req.body.name
    let server = await Server.findByPk(serverId)

    if (server.userId == userId) {
        let room = await Room.create({
            name: name
        })

        server.addRoom(room)

        room = room.toJSON()
        room.messages = []
        room.serverId = serverId

        res.status(200).json({
            room: room
        })
    } else {
        res.status(401).json({
            message: 'Forbidden'
        })
    }

}

module.exports.deleteRoom = async (req, res, next) => {
    let roomId = req.body.id
    let serverId = req.body.serverId
    let userId = req.body.tokenUserId

    let server = await Server.findOne({
        where: {
            id: serverId
        }
    })

    if (server.userId == userId) {
        Room.destroy({
            where: {
                id: roomId
            }
        })

        res.status(200).json({
            message: 'Room deleted'
        })
    } else {
        res.status(401).json({
            message: 'Forbidden'
        })
    }

}

module.exports.updateRoom = async (req, res, next) => {

}
