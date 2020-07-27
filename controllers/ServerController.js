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
                include: [{
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
    let name = req.body.name
    let thumbnail = req.body.image
    let userId = req.body.userId

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

    serverJson = server.toJSON()
    roomJson = room.toJSON()
    roomJson.messages = []
    serverJson.rooms = []
    serverJson.rooms.push(roomJson)

    server.createSocketIoNamespace(serverJson.rooms);
    res.send(serverJson);
}
