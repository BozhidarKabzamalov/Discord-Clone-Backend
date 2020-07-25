var express = require('express');
var router = express.Router();
let serverController = require('../controllers/ServerController')
let userController = require('../controllers/UserController')
let emojiController = require('../controllers/EmojiController')
let messageController = require('../controllers/messageController')

router.get('/servers/:userId', serverController.getUserServers);
router.get('/emoji', emojiController.getEmoji);
router.post('/message', messageController.sendMessage)
router.post('/createServer', serverController.createServer);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
