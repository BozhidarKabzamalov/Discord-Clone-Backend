let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let Message = sequelize.define('message', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Message;
