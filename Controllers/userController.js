const express = require('express');
const router = express.Router();
const User = require('../Models/Users')
const bcrypt = require('bcryptjs');
const { Script } = require('vm');

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/admin', (req, res) => {
    User.findOne().then(user => {
        res.render('admin', { user: user.id })
    })
})

router.get('/new-user', (req, res) => {
    res.render('newUser');
})

router.post('/new-user', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    if(email != undefined && email != '' && name != '') {
        
        if(password != ''){

            User.findOne({
                where:{
                    email: email
                }
            }).then(user => {
                if(user == undefined){
    
                    let salt = bcrypt.genSaltSync(10);
                    let hash = bcrypt.hashSync(password, salt);
    
                    User.create({
                        name: name,
                        email: email,
                        password: hash
                    }).then(() => {
                        res.status(200);
                        res.send('<script>alert("Usuário cadastrado!"); window.location.href = "/users"</script>');
                    }).catch(() => {
                        res.status(400);
                        res.send('<script>alert("Erro ao cadastrar usuário!"); window.location.href = "/users"</script>');
                    })
    
                } else {
                    res.status(404)
                    res.send('<script>alert("E-mail já existe na base de dados!"); window.location.href = "/users"</script>');
                }
            })
    
        } else {
            res.status(400);
            res.send('<script>alert("Senha inválida!"); window.location.href = "/users"</script>');
        }
       
    } else {
        res.status(400);
        res.send('<script>alert("Nome e E-mail não podem estar em branco!"); window.location.href = "/users"</script>');
    }
})

router.post('/users', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    if(email != undefined && email != '' && name != '') {
        
        if(password != ''){

            User.findOne({
                where:{
                    email: email
                }
            }).then(user => {
                if(user == undefined){
    
                    let salt = bcrypt.genSaltSync(10);
                    let hash = bcrypt.hashSync(password, salt);
    
                    User.create({
                        name: name,
                        email: email,
                        password: hash
                    }).then(() => {
                        res.status(200);
                        res.send('<script>alert("Usuário cadastrado!"); window.location.href = "/"</script>');
                    }).catch(() => {
                        res.status(400);
                        res.send('<script>alert("Erro ao cadastrar usuário!"); window.location.href = "/"</script>');
                    })
    
                } else {
                    res.status(404)
                    res.send('<script>alert("E-mail já existe na base de dados!"); window.location.href = "/"</script>');
                }
            })
    
        } else {
            res.status(400);
            res.send('<script>alert("Senha inválida!"); window.location.href = "/"</script>');
        }
       
    } else {
        res.status(400);
        res.send('<script>alert("Nome e E-mail não podem estar em branco!"); window.location.href = "/"</script>');
    }
})

router.post('/auth', (req, res) => {
    let email = req.body.emailLogin;
    let password = req.body.passwordLogin;

    User.findOne({
        where:{
            email:email
        }
    }).then(user => {
        if(user != undefined) {
            
            let correct = bcrypt.compareSync(password, user.password)
            
                if(correct) {
                    

                    User.findAll({ raw: true }).then(users => {
                        res.status(200);
                        res.render('admin', { users: users })
                    }).catch(() => {
                        res.status(404);
                        res.send('<script>alert("Senha inválida!"); window.location.href = "/"</script>');
                    })    
                } else {
                    res.status(404);
                    res.send('<script>alert("Senha inválida!"); window.location.href = "/"</script>');
                }
    
        } else {
            res.status(404);
            res.send('<script>alert("E-mail inválido!"); window.location.href = "/"</script>');
        }
    })

})

//rota de listagem
router.get('/users', (req, res) => {
    User.findAll({
        order:[
            ['id', 'DESC']
        ], raw: true }).then(users => {
        res.render('user', { users: users })
    });
})

router.post('/delete', (req, res) => {
    let id = req.body.id;
    
    if(id != undefined) {

        if(!isNaN(id)) {

            User.destroy({
                where:{
                    id: id
                }
            }).then(() => {
                res.status(200);
                res.send('<script>alert("Usuário deletado!"); window.location.href = "/users"</script>');    
            }).catch(() => {
                res.status(404);
                res.send('<script>alert("Usuário inválido!"); window.location.href = "/users"</script>');
            })
        }

    } else {
        res.status(404);
        res.send('<script>alert("Usuário inválido!"); window.location.href = "/users"</script>');
    
    }
})

router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    
    if(isNaN(id)){
        res.redirect('/users')
    } else {
        User.findByPk(id).then(user => {
            if(user != undefined) {
                res.status(200);
                res.render('edit', { user: user })
            } else {
                res.status(400);
                res.redirect('/users')
            }
        }).catch(() => {
            res.status(400);
            res.redirect('/users')
        })
    }
})

//Persistindo dados no banco de dados
router.post('/update', (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let email = req.body.email;

    User.update({ name: name, email: email }, {
        where:{
            id: id
        }
    }).then(() => {
        res.status(200);
        res.send('<script>alert("Usuário atualizado!"); window.location.href = "/users"</script>');
    }).catch(() => {
        res.status(400);
        res.send('<script>alert("Usuário inválido!"); window.location.href = "/users"</script>');
    })
})

module.exports = router;