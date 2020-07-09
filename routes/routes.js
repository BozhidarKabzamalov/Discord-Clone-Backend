var express = require('express');
var router = express.Router();
let serversController = require('../controllers/ServersController')

router.get('/servers', serversController.getServers);
router.post('/createServer', serversController.createServer);

module.exports = router;
