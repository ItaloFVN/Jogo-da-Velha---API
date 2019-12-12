const http = require('http');
const app = require('./app');

//define a porta na qual ocorrera conexão
const port = process.env.PORT || 8080;

//inicializa o server
const server = http.createServer(app);

//reage às chamadas para o servidor
server.listen(port);

