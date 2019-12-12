const express = require('express');
const app = express();
const bodyParser = require('body-parser');


const gameRoutes = require('./routes/game.js');
const movementRoutes = require('./routes/movement.js');

app.use(bodyParser.json());

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

app.use('/game', gameRoutes);
app.use('/game/*/movement', movementRoutes); 



module.exports = app;








