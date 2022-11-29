const { Router } = require('express');

const controlePredios = require('./controladores/predios');
const controleSalas = require('./controladores/salas');

const rotas = new Router();

rotas.route('/predios') // vou associar uma rota a um metodo
    .get(controlePredios.getPredios)
    .post(controlePredios.addPredio)
    .put(controlePredios.updatePredios)
    
rotas.route('/predios/:codigo') // predios com algum valor (o codigo), essa sera minha rota
    .delete(controlePredios.deletePredio)
    .get(controlePredios.getPredioPorCodigo)

rotas.route('/salas')
    .get(controleSalas.getSalas)
    .post(controleSalas.addSala)
    .put(controleSalas.updateSala)

rotas.route('/predios/:codigo')
    .delete(controleSalas.deleteSala)
    .get(controleSalas.getSalaPorCodigo)

module.exports = rotas;