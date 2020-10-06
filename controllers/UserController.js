let User = require('../models/User');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let Jimp = require('jimp');
let mime = require('mime-types');
let { v4: uuidv4 } = require('uuid');
let { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
    let username = req.body.username
    let email = req.body.email
    let password = await bcrypt.hash(req.body.password, 12)

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(401).json({
            message: 'Authentication failed'
        })
    }

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
            user: {
                id: user.id,
                username: user.username,
                image: user.image,
                token: token
            }
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
                    user: {
                        id: userExists.id,
                        username: userExists.username,
                        image: userExists.image,
                        token: token
                    }
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

module.exports.updateUser = async (req, res, next) => {
    let userId = req.body.userId
    let newUsername = req.body.username
    let newImage = req.file

    let user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
    })

    if (user && user.id == userId) {
        if (newImage) {
            let extension = mime.extension(newImage.mimetype)
            let imageName = uuidv4() + '.' + extension
            let imagePath = 'images/users/' + userId + '/' + imageName
            let imageUrl = req.protocol + '://' + req.get('host') + '/' + imagePath
            user.image = imageUrl

            Jimp.read(newImage.buffer)
            .then(image => {
                return image
                .resize(Jimp.AUTO, 500)
                .write('public/' + imagePath);
            })
            .catch(err => {
                console.error(err);
            });
        }
        if (newUsername) {
            user.username = newUsername
        }
    }

    await user.save()

    res.status(200).json({
        user: user
    })
}
