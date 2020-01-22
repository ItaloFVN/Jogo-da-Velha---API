turnoJogador = null;

var criarJogo = document.querySelector("#iniciarJogo"),
    casa = document.querySelectorAll(".casa");


for (const jogada of casa) {
    jogada.addEventListener('click', function () {
        realizajogada(event.target);
    })
}
    

// cria o jogo
criarJogo.addEventListener('click', function(){
    var http = new XMLHttpRequest();

    http.open("POST", '/game');
    http.setRequestHeader("Content-Type", "application/json");
    http.responseType = 'json';
    console.log('chamou');
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200){   
            console.log(http.response);
            carregaJogo(http.response);
        }
    }
    http.send();

})

function carregaJogo(resultado){
    var id = document.querySelector("#id"),
        jogador = document.querySelector("#jogador");

    id.value = resultado.id;
    jogador.value = resultado.firstPlayer;
    turnoJogador = resultado.firstPlayer;
}

//realiza jogada
function realizajogada(casa){
    console.log("chamou");
    console.log(turnoJogador);
    var http = new XMLHttpRequest(),
        id = document.querySelector("#id"),
        valorX = casa.getAttribute("positionx"),
        valorY = casa.getAttribute("positiony");
    
    var params = {
        "id": id.value,
        "player": turnoJogador,
        "position": {
            "x": valorX,
            "y": valorY
        }
    }

    console.log(params);

    http.open("POST", '/game/' + params.id + '/movement');
    http.setRequestHeader("Content-Type", "application/json");
    http.responseType = 'json';
    console.log('chamou');
    http.onreadystatechange = function () {
        console.log(http.status);
        //Jogada realizada com sucesso
        if (http.readyState == 4 && http.status == 200) {
            carregaJogada(params);
        }
        //jogador errado
        if (http.readyState == 4 && http.status == 201) {
            alerta(http.response);
        }
        //Jogo não encontrado
        if (http.readyState == 4 && http.status == 404) {
            alerta(http.response);
        }
        //partida finalizada
        if (http.readyState == 4 && http.status == 202) {
            carregaJogada(params);
            terminaJogo(http.response);

        }
        //posicao indisponivel
        if (http.readyState == 4 && http.status == 203) {
            alerta(http.response);
        }

    }
    http.send(JSON.stringify(params));
}

function carregaJogada(params){
    console.log(params);
    var imagemFundo = document.querySelector("#casa" + params.position.x + params.position.y),
        fig = "url(images/" + params.player  + ".jpg)",
        jogador = document.querySelector("#jogador");
        imagemFundo.style.background = fig;

    if (params.player == "X") {
        turnoJogador = "O"
    } else {
        turnoJogador = "X"
    }

    jogador.value = turnoJogador;
}

function terminaJogo(params){
    document.querySelector("#resultado").innerHTML = "<h1>O jogador " + params.winner + " venceu! </h1>";
}

function alerta(params){
    alert(params.message);
}