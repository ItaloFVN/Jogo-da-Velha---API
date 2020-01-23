turnoJogador = null;
app = angular.module('app', []);

app.controller('controller', function ($scope, $http) {
    $scope.id = '';
    $scope.jogador = "teste";
    $scope.labelId = "Codigo do Jogo";
    $scope.labelJogador = "Jogador";
    $scope.resultado = '';

    $scope.criarJogo = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:8080/game'
        }).then(function successo(response) {
            carregaJogo(response.data)
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
                carregaJogada(params, $event);
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
            console.log(response.data);
            
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
        $scope.resultado = "<h1>O jogador " + params.winner + " venceu! </h1>";
    }

    function alerta(params) {
        alert(params.message);
    }
})

