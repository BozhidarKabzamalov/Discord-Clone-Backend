let User = require('../models/User')
let Server = require('../models/Server')
let Room = require('../models/Room')

module.exports.createRoom = async (req, res, next) => {
    let serverId = req.body.serverId
    let name = req.body.name

    let server = await Server.findByPk(serverId)
    let room = await Room.create({
        name: name
    })

    server.addRoom(room)

    res.status(200).json({
        message: 'Room added'
    })
}

module.exports.deleteRoom = async (req, res, next) => {
    Room.destroy({
        where: {
            id: req.body.id
        }
    })

    res.status(200).json({
        message: 'Room deleted'
    })
}

module.exports.updateRoom = async (req, res, next) => {

}
