let Server = require('../models/Server');
let Room = require('../models/Room')
let Message = require('../models/Message')

function createSocketServers() {
    Server.findAll({
        include: [
            {
                model: Room,
                include: [Message]
            }
        ]
    })
    .then((servers) => {
        servers.forEach((server) => {
            let socketServer = Server.build({
                name: server.name,
                thumbnail: server.thumbnail,
                endpoint: server.endpoint
            })

            socketServer.createSocketIoNamespace(server.rooms);
        });
    })
    .catch((error) => {
        console.log(error)
    })
}

module.exports = createSocketServers
