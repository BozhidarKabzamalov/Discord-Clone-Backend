let Server = require('../models/Server');
let User = require('../models/User')

module.exports.getUserServers = async (req, res, next) => {
    let userId = req.params.userId

    let user = await User.findByPk(userId, {
        include: Server
    })

    res.status(200).json({
        servers: user.servers
    })
}

module.exports.createServer = async (req, res, next) => {
    let name = req.body.name;
    let thumbnail = req.body.image;
    let userId = req.body.userId

    let user = await User.findByPk(userId)

    let socketServer = await Server.create({
        name: name,
        thumbnail: thumbnail,
        userId: userId
    });

    user.addServer(socketServer)

    socketServer.createSocketIoNamespace();
    res.send(socketServer);
}
