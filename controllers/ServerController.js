let User = require('../models/User')
let Server = require('../models/Server')
let Room = require('../models/Room')
let Message = require('../models/Message')
let Friend = require('../models/Friend')
let Jimp = require('jimp');
let mime = require('mime-types')
let { v4: uuidv4 } = require('uuid');
let fs = require('fs')

module.exports.getUserServers = async (req, res, next) => {
    let userId = req.params.userId

    let user = await User.findByPk(userId, {
        include: [
            {
                model: Friend,
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['password'] }
                    }
                ]
            },
            {
                model: Server,
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['password'] }
                    },
                    {
                        model: Room,
                        include: [Message]
                    }
                ]
            }
        ],
        order: [
            [Server, 'createdAt', 'ASC'],
            [Server, Room, 'createdAt', 'ASC']
        ],
    })

    res.status(200).json({
        friends: user.friends,
        servers: user.servers
    })
}

module.exports.createServer = async (req, res, next) => {
    let name = req.body.name
    let file = req.file
    let userId = req.body.tokenUserId
    let extension = mime.extension(req.file.mimetype)
    let imageName = uuidv4() + '.' + extension

    let serverExists = await Server.findOne({
        where: {
            name: name
        }
    })

    if (serverExists === null) {
        let user = await User.findByPk(userId)
        let server = await Server.create({
            name: name,
            thumbnail: imageName,
            userId: userId,
            endpoint: '/' + uuidv4()
        });
        let room = await Room.create({
            name: 'General'
        })

        await user.addServer(server)
        await server.addRoom(room)

        Jimp.read(req.file.buffer)
        .then(image => {
            return image
            .write('public/images/servers/' + imageName + '/' + 'original-' + imageName);
        })
        .catch(err => {
            console.error(err);
        });

        Jimp.read(req.file.buffer)
        .then(image => {
            return image
            .resize(Jimp.AUTO, 500)
            .write('public/images/servers/' + imageName + '/' + '500-' + imageName);
        })
        .catch(err => {
            console.error(err);
        });

        let finalServer = await Server.findOne({
            where: {
                id: server.id
            },
            include: [
                {
                    model: User,
                },
                {
                    model: Room,
                    include: [Message]
                }
            ]
        })

        finalServer.createSocketIoNamespace(finalServer.rooms);

        res.send(finalServer)

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

        fs.unlink('public/images/servers/' + server.name + '/original-' + server.thumbnail, (err) => {
            if (err) throw err;
        });
        fs.unlink('public/images/servers/' + server.name + '/500-' + server.thumbnail, (err) => {
            if (err) throw err;
        });

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
    let serverId = req.body.serverId
    let newName = req.body.newName
    let newImage = req.file
    let server = await Server.findByPk(serverId)

    if (server && server.userId == userId) {
        if (newImage) {
            Jimp.read(newImage.buffer)
            .then(image => {
                return image
                .write('public/images/servers/' + server.thumbnail + '/' + 'original-' + server.thumbnail);
            })
            .catch(err => {
                console.error(err);
            });

            Jimp.read(newImage.buffer)
            .then(image => {
                return image
                .resize(Jimp.AUTO, 500)
                .write('public/images/servers/' + server.thumbnail + '/' + '500-' + server.thumbnail);
            })
            .catch(err => {
                console.error(err);
            });
        }
        if (newName) {
            server.name = newName
        }
        server.save()

        res.status(200).json({
            message: 'Server updated',
            server: server
        })
    } else {
        res.status(401).json({
            message: 'Forbidden'
        })
    }

}
