let Server = require('../controllers/Server');

function createSocketServers() {
    Server.fetchAll()
    .then((servers) => {
        servers[0].forEach((server) => {
            let socketServer = new Server(server.name, server.image, server.endpoint, server.rooms)
            socketServer.createSocketIoNamespace();
        });
    })
    .catch((error) => {
        console.log(error)
    })
}

module.exports = createSocketServers
