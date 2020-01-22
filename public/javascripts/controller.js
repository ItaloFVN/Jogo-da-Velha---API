$(function () {

    var vez = 1;
    var vencedor = "";

    function casasIguais(a, b, c) {
        var casaA = $("#casa" + a);
        var casaB = $("#casa" + b);
        var casaC = $("#casa" + c);
        var bgA = $("#casa" + a).css("background-image");
        var bgB = $("#casa" + b).css("background-image");
        var bgC = $("#casa" + c).css("background-image");
        if ((bgA == bgB) && (bgB == bgC) && (bgA != "none" && bgA != "")) {
            if (bgA.indexOf("1.jpg") >= 0)
                vencedor = "1";
            else
                vencedor = "2";
            return true;
        }
        else {
            return false;
        }
    }

    function verificarFimDeJogo() {
        if (casasIguais(1, 2, 3) || casasIguais(4, 5, 6) || casasIguais(7, 8, 9) ||
            casasIguais(1, 4, 7) || casasIguais(2, 5, 8) || casasIguais(3, 6, 9) ||
            casasIguais(1, 5, 9) || casasIguais(3, 5, 7)
        ) {
            $("#resultado").html("<h1>O jogador " + vencedor + "venceu! </h1>");
            $(".casa").off("click");
        }
    }

    $(".casa").click(function () {
       
    });


});

var criarJogo = document.querySelector("#iniciarJogo"),
    jogada = document.querySelector("#realizarJogada");

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

jogada.addEventListener('click', function(){
    var http = new XMLHttpRequest(),
        id = document.querySelector("#id"),
        jogador = jogador = document.querySelector("#jogador"),
        posicaoX = document.querySelector("#positionX"),
        posicaoY = document.querySelector("#positionY"),
        valorX = posicaoX.options[posicaoX.selectedIndex].value
        valorY = posicaoY.options[posicaoY.selectedIndex].value

    var params = {
        "id": id.value,
        "player": jogador.value,
        "position":{
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
        if (http.readyState == 4 && http.status == 201){
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
})

function carregaJogo(resultado){
    var id = document.querySelector("#id"),
        jogador = document.querySelector("#jogador");
    id.value = resultado.id;
    if(resultado.firstPlayer == 'X'){
        jogador.selectedIndex = 0;
    }
    else{
        jogador.selectedIndex = 1;
    }
}

function carregaJogada(params){
    console.log(params);
    var imagemFundo = document.querySelector("#casa" + params.position.x + params.position.y),
        fig = "url(images/" + params.player  + ".jpg)";

        console.log(fig);
        imagemFundo.style.background = fig;
}

function terminaJogo(params){
    document.querySelector("#resultado").innerHTML = "<h1>O jogador " + params.winner + " venceu! </h1>";
}

function alerta(params){
    alert(params.message);
}