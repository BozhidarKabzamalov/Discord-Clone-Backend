let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let Server = sequelize.define('server', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    thumbnail: {
        type: Sequelize.STRING(1400),
        allowNull: false,
    },
    endpoint: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
    },
    rooms: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [{ name: 'General', history: []}]
    }
})

Server.prototype.createSocketIoNamespace = function () {
    let io = require('../bin/www');
    io.of(this.endpoint).on('connection', socket => {

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

module.exports = Server;
