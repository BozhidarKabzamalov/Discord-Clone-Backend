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
    let server = req.body;
    let socketServer = Server.build({
        name: server.name,
        thumbnail: server.image,
        userId: 1
    });
    await socketServer.save();
    socketServer.createSocketIoNamespace();
    res.send(socketServer);
}
