let Sequelize = require('sequelize');

let sequelize = new Sequelize('discord', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
    logging: false
});

module.exports = sequelize;
