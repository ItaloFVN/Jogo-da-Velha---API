# Jogo da Velha - API #
	
<a href="https://github.com/ItaloFVN/Jogo-da-Velha---API">Github</a>
<a href="https://www.linkedin.com/in/italo-nascimento-945b89198/">LinkedIn</a>

# Descrição do Projeto #

Jogo da velha - API, é uma Interface de Programação
de aplicação com o intuito de jogar-se um jogo da velha

# Instalação #

1. Com o prompt de comando no diretorio do projeto,
digite npm start, dessa forma o servidor ira inicializar
2. OBS: Nodemom ja vem junto ao projeto, porem, caso ocorra algum problema,
compile o projeto em qualquer IDE sendo server.js o arquivo de inicialização.

# Como funciona #

1. O server inicaliza o projeto iniciando uma conexão com a porta (8080) -> basta ir em server.js para alterar a porta utilizada
2. As requisições são feitas passando um JSON como parametro e as respostas tambem são por JSON
3. Os jogos são salvos em arquivos .txt com o nome de (temp + {id}) dentro da pasta saves encontrada no projeto

# Visão das casas do jogo #

| Coluna 0  | Coluna 1 | Coluna 2 |
|-----------|----------|----------|
|X =0 ; y=0 |X =0 ; y=1|X =0 ; y=2|
|X =1 ; y=0 |X =1 ; y=1|X =1 ; y=2|
|X =2 ; y=0 |X =2 ; y=1|X =2 ; y=2|

# Parametros #

- POST -/game/{id}/movement 
<p>{<br>
	"id" : {id},<br>
    "firstPlayer": {param},<br>
    "position": {<br>
           "X": {param},<br>
           "Y": {param}<br>
      }<br>
}<br></p>



