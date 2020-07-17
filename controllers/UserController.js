let User = require('../models/User');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

module.exports.registerUser = (req, res, next) => {
    let username = req.body.username
    let email = req.body.email
    let password = bcrypt.hash(req.body.password, 12)
    .then(hashPassword => {
        let user = new User(username, hashPassword, email)
        user.save()
    })
    .catch(error => {
        console.log(error)
    })
}

module.exports.loginUser = (req, res, next) => {
    /*bcrypt.compare(password, )

    jwt.sign({ user: user }, 'secretkey', (error, token) => {
        res.send({
            token: token
        })
    })*/
}
