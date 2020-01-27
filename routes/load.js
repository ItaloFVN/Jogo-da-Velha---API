const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
    var condicao = false;
    for (const jogo of global.jogos) {
        if (jogo.id == req.body.id) {
            condicao = true;
            res.status(200).json(jogo);
            console.log(arquivo);
        }
    }
    if(condicao == false){
        res.status(404).json({
            message: 'Partida n�o encontrada'
        });
    }
});

module.exports = router;