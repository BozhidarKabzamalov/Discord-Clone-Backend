let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let ServerUser = sequelize.define('server_user', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    }
})

module.exports = ServerUser;
