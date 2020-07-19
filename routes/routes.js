var express = require('express');
var router = express.Router();
let serverController = require('../controllers/ServerController')
let userController = require('../controllers/UserController')
let emojiController = require('../controllers/EmojiController')

router.get('/servers', serverController.getServers);
router.get('/emoji', emojiController.getEmoji);
router.post('/createServer', serverController.createServer);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
