let database = require('./database')

module.exports = class Server {
    constructor(name, image, endpoint, rooms) {
        this.name = name;
        this.image = image;
        this.endpoint = endpoint;
        this.rooms = rooms;
    }

    save(){
        return database.execute(
            'INSERT INTO servers (name, image, endpoint, rooms) VALUES (?, ?, ?, ?)',
            [this.name, this.image, this.endpoint, this.rooms],
            function(err, results, fields) {

            }
        )
    }

    static fetchAll(){
        return database.execute('SELECT * FROM servers')
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
