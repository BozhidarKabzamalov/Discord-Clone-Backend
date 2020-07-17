let Server = require('../models/Server');

module.exports.getServers = (req, res, next) => {
    Server.findAll()
    .then((result) => {
        res.send(result)
    })
    .catch((error) => {
        console.log(error)
    })
}

module.exports.createServer = (req, res, next) => {
    let server = req.body;
    let socketServer = new Server(server.name, server.image);
    socketServer.save();
    socketServer.createSocketIoNamespace();
    res.send(socketServer);
}
