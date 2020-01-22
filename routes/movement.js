const express = require('express');
const router = express.Router();
const fs = require('fs');



router.post('/', (req, res, next) => { 

    //procura por um arquivo temp com o id passado pelo req
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
            
            //teste para verificar o jogador do turno atual
            if (verificaJogador(arquivo, req, res) != false) {

                //variavel que salva a posicao obtida na requisicao
                var posicao = '' + req.body.position.x + req.body.position.y;

                //realiza a jogada e a salva 
                realizaJogada(arquivo, posicao, req, res);
            }
        }
    }); 
});

//verifica o jogador do turno atual
//Arquivo -> Objeto JSON da leitura do arquivo txt
//req -> parametros passado pela requisi��o
//res -> resposta
function verificaJogador(arquivo, req, res){
    if (arquivo.lastTurn == null && arquivo.firstPlayer != req.body.player) {
        console.log(req.body.player);
        res.status(201).json({
            message: 'N�o � turno do jogador'
        });
        return false
    }
    else if (arquivo.lastTurn == req.body.player) {
        console.log(req.body.player);
        res.status(201).json({
            message: 'N�o � turno do jogador'
        });
        return false;
    }
}


//Metodo que aplica a jogada e a insere em um arquivo txt
//Arquivo -> Objeto JSON da leitura do arquivo txt
//Posi��o -> Posicao em que sera inserido um valor
//req -> parametros passado pela requisi��o
//res -> resposta
function realizaJogada(arquivo, posicao, req, res) {

    //confere se a posicao passada encontra-se vazia
    //caso contrario responde que a posicao passada � invalida
    if (arquivo.positions[posicao] == null) {

        //insere um valor na posicao passada
        arquivo.positions[posicao] = req.body.player;

        //Define o proximo jogador que ira jogar
        arquivo.lastTurn = req.body.player;

        //salva jogada em um arquivo txt
        resultado = fs.writeFile('./saves/temp' + arquivo.id + '.txt', JSON.stringify(arquivo), function (err) {
            if (err) {
                res.status(404).json({
                    message: 'Partida n�o encontrada'
                });
            }
            else {
                //salva o vencedor da partida ou se houve empate
                //variavel com o vencedor do jogo  || X,Y,Null ou empate
                var vencedor = testaVencedor(arquivo);

                //Condicao para avisar que houve um vencedor
                //Caso contrario informa que a jogada foi realizada com sucesso
                if (vencedor != null) {
                    res.status(202).json({
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
        });
    }
    else {
        res.status(203).json({
            message: 'Posicao indisponivel'
        });
    }
}

//Metodo que define se alguem ganhou a partida
//Arquivo -> Objeto JSON da leitura do arquivo txt
function testaVencedor(arquivo) {
    // condicao -> Salva os resultados dos testes para vitoria
    var condicao = testaDiagonal(arquivo);

    if (condicao != null) {
        return condicao;
    };

    condicao = testaLinhas(arquivo);
    if (condicao != null) {
        return condicao;
    };

    condicao = testaColunas(arquivo);
    if (condicao != null) {
        return condicao;
    };

    condicao = testaEmpate(arquivo);
    if (condicao != null) {
        return condicao;
    };
}

//Metodo que define se alguem ganhou a partida pelas casas nas diagonais
//Arquivo -> Objeto JSON da leitura do arquivo txt
function testaDiagonal(arquivo) {
    //condicao -> salva o numero de vezes que X|O aparecerem diagonalmente em um sentido
    var condicaoX = 0,
        condicaoO = 0;

    //vencedor-> salva o vencedor da partida
    var vencedor = null;
    
   //testes para vitoria na diagonal da esquerda para a direita | de cima para baixo
    for (var i = 0; i <= 2; i++) {
        if (arquivo.positions['' + i + i] == 'X') {
            condicaoX++;
            
        }
    }
    for (var i = 0; i <= 2; i++) {
        if (arquivo.positions['' + i + i] == 'O') {
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
            if (arquivo.positions['02'] == 'X' &&
                arquivo.positions['11'] == 'X' &&
                arquivo.positions['20'] == 'X') {
                vencedor = 'X';
            }
            else if (arquivo.positions['02'] == 'O' &&
                arquivo.positions['11'] == 'O' &&
                arquivo.positions['20'] == 'O') {
                vencedor = 'O';
            }        
    }
    
    return vencedor;
}

//Metodo que define se alguem ganhou a partida a partir das linhas
//Arquivo -> Objeto JSON da leitura do arquivo txt
function testaLinhas(arquivo) {

    //vencedor-> salva o vencedor da partida
    var vencedor = null;

    //testes para vitoria apartir das linhas
    for (var i = 0; i <= 2; i++) {
        if (arquivo.positions[i + '0'] == 'X' &&
            arquivo.positions[i + '1'] == 'X' &&
            arquivo.positions[i + '2'] == 'X') {
            vencedor = 'X';
        }
    }
    for (var i = 0; i <= 2; i++) {
        if (arquivo.positions[i + '0'] == 'O' &&
            arquivo.positions[i + '1'] == 'O' &&
            arquivo.positions[i + '2'] == 'O') {
            vencedor = 'O';
        }
    }

    return vencedor;
}

//Metodo que define se alguem ganhou a partida a partir das colunas
//Arquivo -> Objeto JSON da leitura do arquivo txt
function testaColunas(arquivo) {
    //vencedor-> salva o vencedor da partida
    var vencedor = null;

    //testes para vitoria apartir das colunas
    for (var i = 0; i <= 2; i++) {
        if (arquivo.positions['0' + i] == 'X' &&
            arquivo.positions['1' + i] == 'X' &&
            arquivo.positions['2' + i] == 'X') {
            vencedor = 'X';
        }
    }
    for (var i = 0; i <= 2; i++) {
        if (arquivo.positions['0' + i] == 'O' &&
            arquivo.positions['1' + i] == 'O' &&
            arquivo.positions['2' + i] == 'O') {
            vencedor = 'O';
        }
    }

    return vencedor;
}

//Metodo que define se ocorreu empate
//Arquivo -> Objeto JSON da leitura do arquivo txt
function testaEmpate(arquivo) {
    //condicao -> salva o numero de 'casas' ocupadas
    var condicao = 0;

    //teste para ver o numero de casas ocupadas
    for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 2; j++) {
            if (arquivo.positions['' + i + j] != null) {
                condicao++;
            }
        }
    }
    if (condicao == 9) {
        return 'Empate';
    }
}

module.exports = router;
