let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');
let Room = require('./Room')
let Message = require('./Message')
let User = require('./User')

let Server = sequelize.define('server', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    thumbnail: {
        type: Sequelize.STRING(1400),
        allowNull: false
    },
    endpoint: {
        type: Sequelize.STRING(1400),
        allowNull: false
    }
})

Server.prototype.createSocketIoNamespace = function (rooms) {
    let io = require('../bin/www');
    let onlineUsers = []

    io.of(this.endpoint).on('connection', socket => {

        socket.on('messageToServer', (message) => {
            let roomName = Object.keys(socket.rooms)[1]
            let room = rooms.find((room) => {
                return room.name == roomName
            })

            io.of(this.endpoint).to(roomName).emit('messageToClient', message)
        })

        socket.on('userCameOnline', (username) => {
            socket.username = username
            onlineUsers.push(socket.username)
            io.of(this.endpoint).emit('onlineUsers', onlineUsers)
        })

        socket.on('disconnect', () => {
            var index = onlineUsers.indexOf(socket.username)
            onlineUsers.splice(index, 1)
            io.of(this.endpoint).emit('onlineUsers', onlineUsers)
        });

        socket.on('joinRoom', async (roomToJoin) => {
            let roomToLeave = Object.keys(socket.rooms)[1]

            let room = await Room.findAll({
                where: {
                    name: roomToJoin.roomName,
                    serverId: roomToJoin.serverId
                },
                include: {
                    model: Message,
                    include: {
                        model: User,
                        attributes: { exclude: ['password'] }
                    }
                }
            })

            socket.leave(roomToLeave)
            socket.join(roomToJoin.roomName)

            socket.emit('chatHistory', room[0].messages)
        })

    })
}

module.exports = Server;
