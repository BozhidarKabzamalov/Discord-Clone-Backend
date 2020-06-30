var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('Home');
});

router.get('/servers/:username', function(req, res, next) {
    let servers = [
        {
            name: 'TFT',
            image: 'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltfe81204b8ec63e0e/5e6184a918d3347ceffbbd6d/TFT.S3_GALAXIES.ARTICLE-2.jpg',
            endpoint: '/tft',
            rooms: [
                {
                    name: 'General', namespace: 'TFT'
                },
                {
                    name: 'Builds', namespace: 'TFT'
                },
            ]
        },
        {
            name: 'LoL',
            image: 'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltfe81204b8ec63e0e/5e6184a918d3347ceffbbd6d/TFT.S3_GALAXIES.ARTICLE-2.jpg',
            endpoint: '/lol',
            rooms: [
                {
                    name: 'General', namespace: 'LoL'
                },
                {
                    name: 'Champions', namespace: 'LoL'
                },
            ]
        },
        {
            name: 'WoW',
            image: 'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltfe81204b8ec63e0e/5e6184a918d3347ceffbbd6d/TFT.S3_GALAXIES.ARTICLE-2.jpg',
            endpoint: '/wow',
            rooms: [
                {
                    name: 'General', namespace: 'WoW'
                },
                {
                    name: 'PVP', namespace: 'WoW'
                },
            ]
        }
    ]
    res.json(servers)
});

module.exports = router;
