# Jogo da Velha - API #
	
[github] https://github.com/ItaloFVN/Jogo-da-Velha---API

# Descri��o do Projeto #

Jogo da velha - API, � uma Interface de Programa��o
de aplica��o com o intuito de jogar-se um jogo da velha

# Instala��o #

1. Com o prompt de comando no diretorio do projeto,
digite npm start, dessa forma o servidor ira inicializar
2. OBS: Nodemom ja vem junto ao projeto, porem, caso ocorra algum problema,
compile o projeto em qualquer IDE sendo server.js o arquivo de inicializa��o.

# Como funciona #

1. O server inicaliza o projeto iniciando uma conex�o com a porta (8080) -> basta ir em server.js para alterar a porta utilizada
2. As requisi��es s�o feitas passando um JSON como parametro e as respostas tambem s�o por JSON
3. Os jogos s�o salvos em arquivos .txt com o nome de (temp + {id}) dentro da pasta saves encontrada no projeto

# Parametros #

1.POST -/game/{id}/movement 
----------------
{
	"id" : {id},
    "firstPlayer": {param},
    "position": {
        "X": {param},
        "Y": {param}
    }
}

 


