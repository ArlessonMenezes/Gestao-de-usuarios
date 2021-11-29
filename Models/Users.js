const Sequelize = require('sequelize');
const connection = require('../Database/database');

const User = connection.define('users', {
    name:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    
    email:{
        type: Sequelize.TEXT,
        allowNull: false
    },

    password:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})

User.sync({ alter: true });

module.exports = User;