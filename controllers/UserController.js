let User = require('../models/User');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

module.exports.registerUser = async (req, res, next) => {
    let username = req.body.username
    let email = req.body.email
    let password = await bcrypt.hash(req.body.password, 12)

    let userExists = await User.findOne({
        where: {
            email: email
        }
    })

    if (userExists === null) {
        let user = User.build({
            username: username,
            password: password,
            email: email
        })
        await user.save()

        let token = jwt.sign({ id: user.id, email: user.email }, 'secretkey')
        res.status(200).json({
            message: 'Authentication succeeded',
            username: user.username,
            userId: user.id,
            token: token
        })
    } else {
        res.status(401).json({
            message: 'Authentication failed'
        })
    }

}

module.exports.loginUser = async (req, res, next) => {
    let email = req.body.email
    let password = req.body.password

    let userExists = await User.findOne({
        where: {
            email: email
        }
    })

    if (userExists) {
        bcrypt.compare(password, userExists.password, (error, result) => {
            if (result) {
                let token = jwt.sign({ id: userExists.id, email: userExists.email }, 'secretkey')
                res.status(200).json({
                    message: 'Authentication succeeded',
                    username: userExists.username,
                    userId: userExists.id,
                    token: token
                })
            } else {
                res.status(401).json({
                    message: 'Authentication failed'
                })
            }
        })
    } else {
        res.status(401).json({
            message: 'Authentication failed'
        })
    }

}
