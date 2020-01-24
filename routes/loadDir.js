const express = require('express');
const router = express.Router();
const glob = require('glob');

router.post('/', (req, res, next) => {
    glob('C:/Users/Dell/Desktop/Jogo_da_velha/Jogo-da-Velha---API/saves/*.txt', {}, 
        (err, files) => {
            console.log(files);
            res.send(files);
    })
});

module.exports = router;