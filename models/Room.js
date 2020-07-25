let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let Room = sequelize.define('room', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports = Room;
