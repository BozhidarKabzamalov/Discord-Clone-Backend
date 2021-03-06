var express = require('express');
var router = express.Router();
let serverController = require('../controllers/ServerController');
let roomController = require('../controllers/RoomController');
let userController = require('../controllers/UserController');
let emojiController = require('../controllers/EmojiController');
let messageController = require('../controllers/messageController');
let authenticated = require('../middleware/authenticated');
let { check } = require('express-validator')

router.get('/servers/:userId', authenticated, serverController.getUserServers);
router.get('/emoji', authenticated, emojiController.getEmoji);

router.post('/createMessage', authenticated, messageController.createMessage);
router.post('/deleteMessage', authenticated, messageController.deleteMessage);

router.post('/joinServer', authenticated, serverController.joinServer);
router.post('/createServer', authenticated, serverController.createServer);
router.post('/deleteServer', authenticated, serverController.deleteServer);
router.post('/updateServer', authenticated, serverController.updateServer);

router.post('/createRoom', authenticated, roomController.createRoom);
router.post('/deleteRoom', authenticated, roomController.deleteRoom);
router.post('/updateRoom', authenticated, roomController.updateRoom);

router.post('/updateUser', authenticated, userController.updateUser);
router.post('/register', [
    check('username').isLength({ min: 5, max: 10 }),
    check('password').isLength({ min: 5, max: 10 }),
    check('email').isEmail(),
], userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
