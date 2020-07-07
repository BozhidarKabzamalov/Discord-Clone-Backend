var express = require('express');
var router = express.Router();
let Server = require('../controllers/Server');

router.get('/', function(req, res, next) {
    res.send('Home');
});

router.get('/servers', function(req, res, next) {
    Server.fetchAll()
    .then((result) => {
        res.send(result[0])
    })
    .catch((error) => {
        console.log(error)
    })
});

router.post('/createServer', function(req, res, next) {
    let server = req.body;
    let socketServer = new Server(server.name, server.image);
    socketServer.save();
    socketServer.createSocketIoNamespace();
    res.send(socketServer);
});

module.exports = router;
