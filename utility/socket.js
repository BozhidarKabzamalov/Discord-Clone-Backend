let io = require('../bin/www');

function createSocketServers() {
    let servers = [
                    {
                        name: 'TFT',
                        image: 'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltfe81204b8ec63e0e/5e6184a918d3347ceffbbd6d/TFT.S3_GALAXIES.ARTICLE-2.jpg',
                        endpoint: '/tft',
                        room: [
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
                        room: [
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
                        room: [
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
        console.log(server.name)
        io.of(server.endpoint).on('connection',(socket) => {

            socket.on('messageToServer', (message) => {
                let roomName = Object.keys(socket.rooms)[1]
                let room = server.room.find((room) => {
                    return room.name == roomName
                })
                room.history.push(message)

                io.of(server.endpoint).to(roomName).emit('messageToClient', message)
            })

            socket.on('joinRoom', (roomToJoin) => {

                let roomToLeave = Object.keys(socket.rooms)[1]

                socket.leave(roomToLeave)
                socket.join(roomToJoin)

                let room = server.room.find((room) => {
                    return room.name == roomToJoin
                })

                socket.emit('chatHistory', room.history)
            })

        })
    });
}

module.exports = createSocketServers
