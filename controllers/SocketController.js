let Server = require('../models/Server')
let Room = require('../models/Room')

function createSocketServers() {
    Server.findAll({
        include: Room
    })
    .then((servers) => {
        servers.forEach((server) => {
            server.createSocketIoNamespace(server.rooms)
        });
    })
    .catch((error) => {
        console.log(error)
    })
}

module.exports = createSocketServers
