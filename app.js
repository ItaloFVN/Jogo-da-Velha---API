const express = require('express');
const app = express();
const bodyParser = require('body-parser');
global.jogos = [];


//constante para as rotas aos arquivos | game.js && movement.js
const gameRoutes = require('./routes/game.js');
const movementRoutes = require('./routes/movement.js');
const loadRoutes = require('./routes/load.js');
const loadJogosRoutes = require('./routes/loadJogos.js');

//const loadRoutes = require('./routes/load.js');

// permite trabalhar com requisi��es no formato JSON corretamente
app.use(bodyParser.json());

//CORS do projeto
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, GET');
        return res.status(200).json({});
    }
    next();
});

// rota para as chamadas '/load'
app.use('/load', loadRoutes);

// rota para as chamadas '/game'
app.use('/game', gameRoutes);

//rota para as chamadas '/game/{id}/movement'
app.use('/game/*/movement', movementRoutes); 

//rota para as chamadas '/'
app.use('/loadJogos', loadJogosRoutes);



//chamada do index
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

/*app.use('/', (req, res) => {
    glob(__dirname + '/saves/*.txt', {}, (err, files) => {
        console.log(files)
        res.(files);
    })
})*/

module.exports = app;








