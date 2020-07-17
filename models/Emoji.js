let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let Emoji = sequelize.define('emoji', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    },
    keyword: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING(1400),
        allowNull: false,
    }
})

module.exports = Emoji;
