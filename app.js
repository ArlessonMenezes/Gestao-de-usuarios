const express = require('express');
const app = express();
const connection = require('./Database/database');
const userController = require('./Controllers/userController');

connection.authenticate()
    .then(() => console.log('Conexão realiada com o banco de dados!'))
    .catch(() => console.log('Erro ao se conectar com o banco de dados!'))

app.set('view engine', 'ejs');
app.use(express.static('Public'))


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', userController);

app.listen(3030, () => console.log('Server ON!'))