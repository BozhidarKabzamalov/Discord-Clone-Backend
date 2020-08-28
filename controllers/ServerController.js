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
            [Server, Room, 'createdAt', 'ASC'],
            [Server, User, 'createdAt', 'ASC'],
            [Server, Room, Message, 'createdAt', 'ASC']
        ],
    })

    res.status(200).json({
        friends: user.friends,
        servers: user.servers
    })
}

module.exports.createServer = async (req, res, next) => {
    let serverName = req.body.name
    let file = req.file
    let userId = req.body.tokenUserId
    let extension = mime.extension(file.mimetype)
    let serverFolderName = serverName + '-' + uuidv4()
    let imageName = uuidv4() + '.' + extension
    let imageUrl = req.protocol + '://' + req.get('host') + '/images/servers/' + serverFolderName + '/' + imageName

    let serverExists = await Server.findOne({
        where: {
            name: serverName
        }
    })

    if (serverExists === null) {
        let user = await User.findByPk(userId)
        let server = await Server.create({
            name: serverName,
            thumbnail: imageUrl,
            userId: userId,
            endpoint: '/' + uuidv4()
        });
        let room = await Room.create({
            name: 'General'
        })

        await user.addServer(server)
        await server.addRoom(room)

        Jimp.read(file.buffer)
        .then(image => {
            return image
            .resize(Jimp.AUTO, 500)
            .write('public/images/servers/' + serverFolderName + '/' + imageName);
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
        let folderAndFile = server.thumbnail.replace(req.protocol + '://' + req.get('host') + '/images/servers/', '')
        fs.unlink('public/images/servers/' + folderAndFile, (err) => {
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
    let server = await Server.findByPk(serverId, {
        include: [
            {
                model: User,
                attributes: { exclude: ['password'] }
            },
            {
                model: Room,
                include: [Message]
            }
        ],
        order: [
            [Room, 'createdAt', 'ASC']
        ]
    })

    if (server && server.userId == userId) {
        if (newImage) {
            let folderAndFile = server.thumbnail.replace(req.protocol + '://' + req.get('host') + '/images/servers/', '')

            Jimp.read(newImage.buffer)
            .then(image => {
                return image
                .resize(Jimp.AUTO, 500)
                .write('public/images/servers/' + folderAndFile);
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
            server: server
        })
    } else {
        res.status(401).json({
            message: 'Forbidden'
        })
    }

}

module.exports.joinServer = async (req, res, next) => {
    let serverName = req.body.serverName
    let userId = req.body.tokenUserId

    let user = await User.findByPk(userId)
    let server = await Server.findOne({
        where: {
            name: serverName
        }
    })

    let userHasAlreadyJoined = await user.hasServer(server)

    if (userHasAlreadyJoined) {

    } else {
        await user.addServer(server)
    }

}
