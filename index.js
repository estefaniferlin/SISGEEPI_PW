const express = require('express');
const cors = require('cors');
const rotas = require('./rotas');

const app = express(); // instancio o express

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cors());

app.use(rotas);

//carregar a aplicaçãop
app.listen(process.env.PORT || 3002, () =>{  // pega o valor da porta (quando estiver na nuvem) ou a 3002
    console.log('Servidor da APi rodadndo...');
})

