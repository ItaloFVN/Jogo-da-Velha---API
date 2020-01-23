const express = require('express');
const router = express.Router();
const fs = require('fs');


router.post('/', (req, res, next) => {
    // Cria um Id aleatorio
    var id = Math.random().toString(36).substr(2, 9);
    
    //Cria um n�mero aleat�rio do tamanho definido em size.
    var size = 3;
    var randomized = Math.ceil(Math.random() * Math.pow(10, size));

    //define quem sera o primeiro jogador a partir do resto da divisao
    //de ramdomized por 2
    var primeiroJogador = defineFirstPlayer(randomized);
    
    //Objeto JSON txt que ira ser escrito em um arquivo txt
    var txt = {
        id: id,
        firstPlayer: primeiroJogador,
        lastTurn: null,
        positions: {
            '00': null,
            '01': null,
            '02': null,
            '10': null,
            '11': null,
            '12': null,
            '20': null,
            '21': null,
            '22': null,
        },
        status: null
    }

    //cria o arquivo/jogo e retorna true caso n�o tenha ocorrido nenhum erro
    if (criarJogo(txt) == true) {
       
        res.status(200).json({
            id: txt.id,
            firstPlayer: txt.firstPlayer
        });
    };   
});

//Metodo que define quem sera o primeiro jogador
//Randomized -> Inteiro aleatorio 
function defineFirstPlayer(randomized) {
    var retorno = randomized % 2;

    if (retorno == 0) {
        retorno = 'X'
    }
    else {
        retorno = 'O'
    }
    return retorno;
}

//Metodo que cria um arquivo txt com os dados do jogo
//TXT -> Objeto JSON que sera inserido em um arquivo txt
function criarJogo(txt) {
    fs.writeFile('./saves/temp' + txt.id + '.txt', JSON.stringify(txt), function (err) {
        if (err) {
            res.status(200).json({
                message: 'Partida n�o encontrada'
            });
            return false;
        }
    });
        return true;
}

module.exports = router;