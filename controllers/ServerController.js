let User = require('../models/User')
let Server = require('../models/Server')
let Room = require('../models/Room')
let Message = require('../models/Message')
let Jimp = require('jimp');
let mime = require('mime-types')
const { v4: uuidv4 } = require('uuid');

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
    let name = req.body.name
    let file = req.file
    let userId = req.body.tokenUserId
    let extension = mime.extension(req.file.mimetype)
    let imageName = uuidv4() + '.' + extension
    let imageUrl = req.protocol + '://' + req.get('host') + '/images/servers/' + name + '/';

    let serverExists = await Server.findOne({
        where: {
            name: name
        }
    })

    if (serverExists === null) {

        Jimp.read(req.file.buffer)
        .then(image => {
            return image
            .write('public/images/servers/' + name + '/' + 'original-' + imageName);
        })
        .catch(err => {
            console.error(err);
        });

        Jimp.read(req.file.buffer)
        .then(image => {
            return image
            .resize(Jimp.AUTO, 500)
            .write('public/images/servers/' + name + '/' + '500-' + imageName);
        })
        .catch(err => {
            console.error(err);
        });

        let user = await User.findByPk(userId)

        let server = await Server.create({
            name: name,
            path: imageUrl,
            thumbnail: imageName,
            userId: userId,
            endpoint: '/' + uuidv4()
        });

        let room = await Room.create({
            name: 'General'
        })

        user.addServer(server)
        server.addRoom(room)

        jsonRoom = room.toJSON()
        jsonRoom.messages = []

        jsonServer = server.toJSON()
        jsonServer.rooms = []
        jsonServer.rooms.push(jsonRoom)

        server.createSocketIoNamespace(jsonServer.rooms);

        res.send(jsonServer)

    } else {
        res.status(200).json({
            message: 'Already exists'
        })
    }


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
