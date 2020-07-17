let Server = require('../models/Server');

function createSocketServers() {
    Server.findAll()
    .then((servers) => {
        servers.forEach((server) => {
            let socketServer = Server.build({
                name: server.name,
                thumbnail: server.thumbnail,
                endpoint: server.endpoint,
                rooms: server.rooms
            })

            socketServer.createSocketIoNamespace();
        });
    })
    .catch((error) => {
        console.log(error)
    })
}

module.exports = createSocketServers
