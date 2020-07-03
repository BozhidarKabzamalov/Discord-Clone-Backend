module.exports = class Server {
    constructor(name, image, endpoint, rooms) {
        this.name = name;
        this.image = image;
        this.endpoint = endpoint;
        this.rooms = rooms;
    }

    createSocketIoNamespace(){
        let io = require('../bin/www');
        io.of(this.endpoint).on('connection',(socket) => {

            socket.on('messageToServer', (message) => {
                let roomName = Object.keys(socket.rooms)[1]
                let room = this.rooms.find((room) => {
                    return room.name == roomName
                })

                room.history.push(message)

                io.of(this.endpoint).to(roomName).emit('messageToClient', message)
            })

            socket.on('joinRoom', (roomToJoin) => {
                let roomToLeave = Object.keys(socket.rooms)[1]
                let room = this.rooms.find((room) => {
                    return room.name == roomToJoin
                })

                socket.leave(roomToLeave)
                socket.join(roomToJoin)

                socket.emit('chatHistory', room.history)
            })

        })
    }
}
