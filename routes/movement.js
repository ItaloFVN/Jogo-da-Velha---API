const express = require('express');
const router = express.Router();


router.post('/', (req, res, next) => { 
    //Testa se o jogo existe
    if (global.jogos.length < 1){
        res.status(404).json({
            message: 'Partida n�o encontrada'
        });
    }
    else{
        for (const jogo of global.jogos) {
            if (jogo.id == req.body.id) {
                //testa se o jogo ja foi encerrado
                if (jogo.status == null) {

                    //teste para verificar o jogador do turno atual
                    if (verificaJogador(jogo, req, res) != false) {
    
                        //variavel que salva a posicao obtida na requisicao
                        var posicao = '' + req.body.position.x + req.body.position.y;
    
                        //realiza a jogada e a salva 
                        realizaJogada(jogo, posicao, req, res);
                    }
                }
                else {
                    res.status(202).json({
                        winner: jogo.status,
                        message: 'Jogo já encerrado!'
                    });
                }
            }  
        }
    }
});

//verifica o jogador do turno atual
//Jogo -> Objeto JSON com as informações do jogo
//req -> parametros passado pela requisi��o
//res -> resposta
function verificaJogador(jogo, req, res){
    if (jogo.lastTurn == null && jogo.firstPlayer != req.body.player) {
        res.status(201).json({
            message: 'N�o � turno do jogador'
        });
        return false
    }
    else if (jogo.lastTurn == req.body.player) {
        res.status(201).json({
            message: 'N�o � turno do jogador'
        });
        return false;
    }
}


//Metodo que aplica a jogada
//Jogo -> Objeto JSON com as informações do jogo
//Posi��o -> Posicao em que sera inserido um valor
//req -> parametros passado pela requisi��o
//res -> resposta
function realizaJogada(jogo, posicao, req, res) {

    //confere se a posicao passada encontra-se vazia
    //caso contrario responde que a posicao passada � invalida
    if (jogo.positions[posicao] == null) {

        //insere um valor na posicao passada
        jogo.positions[posicao] = req.body.player;

        //Define o proximo jogador que ira jogar
        jogo.lastTurn = req.body.player;

        //salva o vencedor da partida ou se houve empate
        //variavel com o vencedor do jogo  || X,Y,Null ou empate
        var vencedor = testaVencedor(jogo);
        jogo.status = vencedor;
        

        //Condicao para avisar que houve um vencedor
        //Caso contrario informa que a jogada foi realizada com sucesso
        if (vencedor != null) {
            res.status(200).json({
                message: 'Partida finalizada',
                winner: vencedor 
            });
        }
        else {
            res.status(200).json({
                codigo: '200'
            });
        }
    }
    else {
        res.status(203).json({
            message: 'Posicao indisponivel'
        });
    }
}


//Metodo que define se alguem ganhou a partida
//Jogo -> Objeto JSON com as informações do jogo
function testaVencedor(jogo) {
    // condicao -> Salva os resultados dos testes para vitoria
    var condicao = testaDiagonal(jogo);

    if (condicao != null) {
        return condicao;
    };

    condicao = testaLinhas(jogo);
    if (condicao != null) {
        return condicao;
    };

    condicao = testaColunas(jogo);
    if (condicao != null) {
        return condicao;
    };

    condicao = testaEmpate(jogo);
    if (condicao != null) {
        return condicao;
    };
}

//Metodo que define se alguem ganhou a partida pelas casas nas diagonais
//Jogo -> Objeto JSON com as informações do jogo
function testaDiagonal(jogo) {
    //condicao -> salva o numero de vezes que X|O aparecerem diagonalmente em um sentido
    var condicaoX = 0,
        condicaoO = 0;

    //vencedor-> salva o vencedor da partida
    var vencedor = null;
    
   //testes para vitoria na diagonal da esquerda para a direita | de cima para baixo
    for (var i = 0; i <= 2; i++) {
        if (jogo.positions['' + i + i] == 'X') {
            condicaoX++;
            
        }
    }
    for (var i = 0; i <= 2; i++) {
        if (jogo.positions['' + i + i] == 'O') {
            condicaoO++;
        }
    }
    if (condicaoX == 3) {
        vencedor = 'X';
    }
    else if (condicaoO == 3) {
        vencedor = 'O';
    }
    //testes para vitoria na diagonal da direita para esquerda | de cima para baixo
    else {
            if (jogo.positions['02'] == 'X' &&
                jogo.positions['11'] == 'X' &&
                jogo.positions['20'] == 'X') {
                vencedor = 'X';
            }
            else if (jogo.positions['02'] == 'O' &&
                jogo.positions['11'] == 'O' &&
                jogo.positions['20'] == 'O') {
                vencedor = 'O';
            }        
    }
    
    return vencedor;
}

//Metodo que define se alguem ganhou a partida a partir das linhas
//Jogo -> Objeto JSON com as informações do jogo
function testaLinhas(jogo){

    //vencedor-> salva o vencedor da partida
    var vencedor = null;

    //testes para vitoria apartir das linhas
    for (var i = 0; i <= 2; i++) {
        if (jogo.positions[i + '0'] == 'X' &&
            jogo.positions[i + '1'] == 'X' &&
            jogo.positions[i + '2'] == 'X') {
            vencedor = 'X';
        }
    }
    for (var i = 0; i <= 2; i++) {
        if (jogo.positions[i + '0'] == 'O' &&
            jogo.positions[i + '1'] == 'O' &&
            jogo.positions[i + '2'] == 'O') {
            vencedor = 'O';
        }
    }

    return vencedor;
}

//Metodo que define se alguem ganhou a partida a partir das colunas
//Jogo -> Objeto JSON com as informações do jogo
function testaColunas(jogo) {
    //vencedor-> salva o vencedor da partida
    var vencedor = null;

    //testes para vitoria apartir das colunas
    for (var i = 0; i <= 2; i++) {
        if (jogo.positions['0' + i] == 'X' &&
            jogo.positions['1' + i] == 'X' &&
            jogo.positions['2' + i] == 'X') {
            vencedor = 'X';
        }
    }
    for (var i = 0; i <= 2; i++) {
        if (jogo.positions['0' + i] == 'O' &&
            jogo.positions['1' + i] == 'O' &&
            jogo.positions['2' + i] == 'O') {
            vencedor = 'O';
        }
    }

    return vencedor;
}

//Metodo que define se ocorreu empate
//Jogo -> Objeto JSON com as informações do jogo
function testaEmpate(jogo) {
    //condicao -> salva o numero de 'casas' ocupadas
    var condicao = 0;

    //teste para ver o numero de casas ocupadas
    for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 2; j++) {
            if (jogo.positions['' + i + j] != null) {
                condicao++;
            }
        }
    }
    if (condicao == 9) {
        return 'Empate';
    }
}

module.exports = router;
