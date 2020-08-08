let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let User = sequelize.define('user', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING(1400),
        allowNull: false,
    }
})

module.exports = User;
