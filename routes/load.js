const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post('/', (req, res, next) => {

    fs.readFile('./saves/temp' + req.body.id + '.txt', 'utf8', function (err, data) {
        //verifica se existe uma partida/jogo/arquivo com o ID disponibilizado
        if (err) {
            res.status(404).json({
                message: 'Partida n�o encontrada'
            });
        }
        else {
            //objeto JSON do arquivo obtido
            var arquivo = JSON.parse(data);
            res.status(200).json(arquivo);
            console.log(arquivo);
        }
    }); 
});

module.exports = router;