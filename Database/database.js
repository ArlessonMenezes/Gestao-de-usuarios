const Sequelize = require('sequelize');

const connecton = new Sequelize('gestaoUsuarios', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})

module.exports = connecton;