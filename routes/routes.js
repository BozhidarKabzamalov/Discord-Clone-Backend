var express = require('express');
var router = express.Router();
let serverController = require('../controllers/ServerController');
let roomController = require('../controllers/RoomController');
let userController = require('../controllers/UserController');
let emojiController = require('../controllers/EmojiController');
let messageController = require('../controllers/messageController');
let authenticated = require('../middleware/authenticated');

router.get('/servers/:userId', authenticated, serverController.getUserServers);
router.get('/emoji', authenticated, emojiController.getEmoji);
router.post('/message', authenticated, messageController.sendMessage);
router.post('/createServer', authenticated, serverController.createServer);
router.get('/createRoom', authenticated, roomController.createRoom);
router.post('/register', authenticated, userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
