let Sequelize = require('sequelize');

let sequelize = new Sequelize('discord', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
