var turnoJogador = null,
    app = angular.module('app', []);

app.controller('controller', function ($scope, $http, $document) {
    $scope.modalJogos = false;
    $scope.jogos = [];
    $scope.statusJogo = false;
    $scope.id = '';
    $scope.jogador = "";
    $scope.labelId = "Codigo do Jogo";
    $scope.labelJogador = "Jogador";
    $scope.resultado = '';
    $scope.linha0 = [
        { class:"casa", positionX:"0", positionY:"0", evento:"realizaJogada($event)"},
        { class: "casa", positionX: "0", positionY: "1", evento: "realizaJogada($event)" },
        { class: "casa", positionX: "0", positionY: "2", evento: "realizaJogada($event)" }
    ]
    $scope.linha1 = [
        { class: "casa", positionX: "1", positionY: "0", evento: "realizaJogada($event)" },
        { class: "casa", positionX: "1", positionY: "1", evento: "realizaJogada($event)" },
        { class: "casa", positionX: "1", positionY: "2", evento: "realizaJogada($event)" }
    ]
    $scope.linha2 = [
        { class: "casa", positionX: "2", positionY: "0", evento: "realizaJogada($event)" },
        { class: "casa", positionX: "2", positionY: "1", evento: "realizaJogada($event)" },
        { class: "casa", positionX: "2", positionY: "2", evento: "realizaJogada($event)" }
    ]
    
    $scope.criarJogo = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:8080/game'
        }).then(function successo(response) {
            carregaJogo(response.data);
        }, function erro(response) {
            alert('Erro de conexão: Codigo ' + JSON.stringify(response.status));
        });
    }

    $scope.realizaJogada = function ($event) {
        if ($scope.id != '') {
            var params = {
                "id": $scope.id,
                "player": $scope.jogador,
                "position": {
                    "x": $event.target.attributes.positionX.value,
                    "y": $event.target.attributes.positionY.value
                }
            }
            $http({
                method: 'POST',
                url: 'http://localhost:8080/game/' + $scope.id + '/movement',
                dataType: 'json',
                data: params,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function successo(response) {
                //Jogada realizada com sucesso
                if (response.status == 200) {
                    //atualizaJson(params);
                    console.log(response.data.winner);
                    carregaJogada(params, $event);
                    if (response.data.winner == 'X' || 
                        response.data.winner == 'O' ||
                        response.data.winner == "Empate"){
                        terminaJogo(response.data)
                    }
                }
                //jogador errado
                if (response.status == 201) {
                    alerta(response.data);
                }
                //Jogo não encontrado
                if (response.status == 404) {
                    alerta(response.data);
                }
                //posicao indisponivel
                if (response.status == 203) {
                    alerta(response.data);
                }
                //jogo já encerrado
                if (response.status == 202) {
                    alerta(response.data);
                    terminaJogo(response.data);
                }
                //console.log(response.data);
                
            }, function erro(response) {
                alert('Erro de conexão: Codigo ' + JSON.stringify(response.status));
            });
        }
        else{
            alert("Codigo de jogo não inserido!");
        }
    }
    //Hide or show
    $scope.alteraModal = function () {
        if ($scope.modalJogos == true) {
            $scope.modalJogos = false
        } else {
            $scope.modalJogos = true
        }
    }

    //retorna o valor da modal
    $scope.mostraModal = function(){
        return $scope.modalJogos;
    }

    //busca um jogo pelo id
    $scope.recebeArquivo = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:8080/load',
            dataType: 'json',
            data: {id : $scope.id},
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function successo(response) {
            console.log(response.data);
            carregaArquivo(response.data);
        }, function erro(response) {
            alert('Erro de conexão: Codigo ' + JSON.stringify(response.status));
        });
    }

    //Resultado do jogo
    $scope.exibirResultado = function () {
        return $scope.statusJogo;
    }

    //Zera as casas ao iniciar/carregar jogo
    $scope.zeraJogo = function () {
        var casas = document.querySelectorAll(".casa");
        console.log(casas);
        for (const casa of casas) {
            casa.style.background = '';
        }
        $scope.resultado = "";
    }

    //Busca os jogos na memoria
    $scope.buscaJogos = function() {
        $http({
            method: 'POST',
            url: 'http://localhost:8080/',
        }).then(function successo(response) {
            $scope.jogos = response.data;
            console.log(response.data);
        }, function erro(response) {
            alert('Erro de conexão: Codigo ' + JSON.stringify(response.status));
        });
    }

    //Exibe o Id/Jogador do jogo atual
    function carregaJogo(resultado) {
        $scope.id = resultado.id;
        $scope.jogador = resultado.firstPlayer;
        turnoJogador = resultado.firstPlayer;
    }

    //Altera o fundo da casa
    function carregaJogada(params, event) {
        var imagemFundo = angular.element(event.target),
            fig = "url(images/" + params.player + ".jpg)";
            
            
        imagemFundo.css({ 'background': fig});

        if (params.player == "X") {
            turnoJogador = "O"
        } else {
            turnoJogador = "X"
        }

        $scope.jogador = turnoJogador;
    }

    //Encerra o jogo de acordo com o winner
    function terminaJogo(params) {
        //console.log(params);
        $scope.statusJogo = true;
        if (params.winner == "Empate")
            $scope.resultado = params.winner
        else
            $scope.resultado = "O jogador " + params.winner + " venceu!";
    }

    //Alert para erros
    function alerta(params) {
        alert(params.message);
    }

    //Altera as casas para um jogo carregado
    function carregaArquivo(params){
        var casas = document.querySelectorAll(".casa"),
            posicoes = [];
            
        for (var posicao in params.positions)
            posicoes.push([posicao, params.positions[posicao]]);
            posicoes.sort();
        for (let index = 0; index < casas.length; index++) {
            if (posicoes[index][1] == 'X')
                casas[index].style.background = "url(images/X.jpg)";
            else if (posicoes[index][1] == 'O')
                casas[index].style.background = "url(images/O.jpg)";
            else
                casas[index].style.background = '';
        }
        if(params.status == 'X' || params.status == 'O'){
            $scope.statusJogo = true;
            $scope.jogador = "";
            $scope.resultado = "O jogador " + params.status + " venceu!";
        } else if (params.status == "Empate"){
            $scope.statusJogo = true;
            $scope.resultado = "Empate!";
        }else{
            $scope.statusJogo = false;
            $scope.resultado = "";
            if(params.lastTurn == 'X')
                $scope.jogador = 'O';
            else
                $scope.jogador = 'X';
        }
    }
})

