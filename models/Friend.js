let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let Friend = sequelize.define('friend', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    },
    accepted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

module.exports = Friend;
