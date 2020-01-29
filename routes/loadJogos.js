const express = require('express');
const router = express.Router();
const glob = require('glob');

router.post('/', (req, res, next) => {
    var ids = [];
    for (const jogo of global.jogos) {
        ids.push(jogo.id);
    }
    res.status(200).json({
        jogos: ids
    });
});

module.exports = router;