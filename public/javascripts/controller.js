turnoJogador = null;
app = angular.module('app', []);
/*arquivo = {
    id: null,
    firstPlayer: null,
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
}*/

app.controller('controller', function ($scope, $http, $document) {
    $scope.id = '';
    $scope.jogador = "teste";
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
                if (response.data.winner == 'X' || response.data.winner == 'O'){
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

    function carregaJogo(resultado) {
        $scope.id = resultado.id;
        $scope.jogador = resultado.firstPlayer;
        turnoJogador = resultado.firstPlayer;
    }

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

    function terminaJogo(params) {
        //console.log(params);
        $scope.resultado = "O jogador " + params.winner + " venceu!";
    }

    function alerta(params) {
        alert(params.message);
    }

    $scope.zeraJogo = function(){
        var casas = document.querySelectorAll(".casa");
        console.log(casas);
        for (const casa of casas) {
            casa.style.background = '';
        }
        $scope.resultado = "";
    }
/*
    function atualizaJSON(params){

        arquivo.lastTurn = params.player;
        var posicao = '' + params.x + params.y;
        arquivo.positions[posicao] = params.player;

    }*/

})

