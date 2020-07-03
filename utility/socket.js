let Server = require('../controllers/Server');

function createSocketServers() {
    let servers = [
                    {
                        name: 'TFT',
                        image: 'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltfe81204b8ec63e0e/5e6184a918d3347ceffbbd6d/TFT.S3_GALAXIES.ARTICLE-2.jpg',
                        endpoint: '/tft',
                        rooms: [
                            {
                                name: 'General', namespace: 'TFT', history: []
                            },
                            {
                                name: 'Builds', namespace: 'TFT', history: []
                            },
                        ]
                    },
                    {
                        name: 'LoL',
                        image: 'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltfe81204b8ec63e0e/5e6184a918d3347ceffbbd6d/TFT.S3_GALAXIES.ARTICLE-2.jpg',
                        endpoint: '/lol',
                        rooms: [
                            {
                                name: 'General', namespace: 'LoL', history: []
                            },
                            {
                                name: 'Champions', namespace: 'LoL', history: []
                            },
                        ]
                    },
                    {
                        name: 'WoW',
                        image: 'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltfe81204b8ec63e0e/5e6184a918d3347ceffbbd6d/TFT.S3_GALAXIES.ARTICLE-2.jpg',
                        endpoint: '/wow',
                        rooms: [
                            {
                                name: 'General', namespace: 'WoW', history: []
                            },
                            {
                                name: 'PVP', namespace: 'WoW', history: []
                            },
                        ]
                    },
                ]
    servers.forEach((server) => {
        let socketServer = new Server(server.name, server.image, server.endpoint, server.rooms)
        socketServer.createSocketIoNamespace();
    });
}

module.exports = createSocketServers
