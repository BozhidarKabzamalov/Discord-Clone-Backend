let User = require('../models/User')
let Server = require('../models/Server')
let Room = require('../models/Room')

module.exports.createRoom = async (req, res, next) => {
    let token = 'token'
    let userId = req.body.userId
    let serverId = req.body.serverId
    let name = 'Test room'

    let server = await Server.findByPk(serverId)
    let room = await Room.create({
        name: name
    })

    server.addRoom(room)

    res.status(200).json({
        message: 'Room added'
    })
}
