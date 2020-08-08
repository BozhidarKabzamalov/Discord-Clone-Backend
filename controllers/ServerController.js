let User = require('../models/User')
let Server = require('../models/Server')
let Room = require('../models/Room')
let Message = require('../models/Message')

module.exports.getUserServers = async (req, res, next) => {
    let userId = req.params.userId

    let user = await User.findByPk(userId, {
        include: [
            {
                model: Server,
                include: [User, {
                    model: Room,
                    include: [Message]
                }]
            }
        ]
    })

    res.status(200).json({
        servers: user.servers
    })
}

module.exports.createServer = async (req, res, next) => {
    console.log(req.body)
    console.log(req.file)
    let name = req.body.name
    let file = req.file
    let userId = req.body.tokenUserId

    let user = await User.findByPk(userId)

    let server = await Server.create({
        name: name,
        thumbnail: thumbnail,
        userId: userId,
        endpoint: '/' + name
    });

    let room = await Room.create({
        name: 'General'
    })

    user.addServer(server)
    server.addRoom(room)

    server = server.toJSON()
    room = room.toJSON()
    room.messages = []
    server.rooms = []
    server.rooms.push(room)

    server.createSocketIoNamespace(server.rooms);
    res.send(server);
}

module.exports.deleteServer = async (req, res, next) => {
    let userId = req.body.tokenUserId
    let serverId = req.body.id
    let server = await Server.findByPk(serverId)

    if (server.userId == userId) {
        Server.destroy({
            where: {
                id: serverId
            }
        })

        res.status(200).json({
            message: 'Server deleted'
        })
    } else {
        res.status(401).json({
            message: 'Forbidden'
        })
    }

}

module.exports.updateServer = async (req, res, next) => {
    let userId = req.body.tokenUserId
    let serverId = req.body.server.id
    let newName = req.body.newName
    let server = await Server.findByPk(serverId)

    if (server.userId == userId) {
        server.name = newName
        server.save()

        res.status(200).json({
            message: 'Server deleted'
        })
    } else {
        res.status(401).json({
            message: 'Forbidden'
        })
    }

}
