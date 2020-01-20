const http = require('http');
const app = require('./app');

//define a porta na qual ocorrera conex�o
const port = process.env.PORT || 8080;

//inicializa o server
const server = http.createServer(app);

//reage �s chamadas para o servidor
server.listen(port);
