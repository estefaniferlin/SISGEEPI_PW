const { response } = require('express');
const { pool } = require('../config');

// Método para retornar todos os prédios
const getSalas =(request, response) => {
    pool.query('SELECT * FROM salas ORDER BY codigo',  //query: recebe 2 parametros, um é o comando sql e o segundo os callbacks que podem executar 
        (error, results) => { //callbacks de erro e resultados
            if(error){
                return response.status(400).json({
                    status : 'error', 
                    message : 'Erro ao consultar a sala: ' + error
                })
            }
            response.status(200).json(results.rows); // retorno somente o resultado das linhas se não houver erro
        }
    )
}

// quando teremos mais de uma linha usamos ` `
const addSala = (request, response) => {
    //extrair o predio
    const {numero, descricao, capacidade, predio} = request.body; // vou receber os dados que coimpletam minha tabela no bd pelo body
    pool.query(`INSERT INTO salas (numero, descricao, capacidade, predio) 
    VALUES ($1, $2, $3, $4) RETURNING codigo, numero, descricao, capacidade, predio`, 
    [numero, descricao, capacidade, predio], 
    (error, results) => {
        if(error){
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao inserir a sala!'
            })
        }
        response.status(200).json({
            status : "success", message : "Sala criada",
            objeto : results.rows[0] // retorna a saça criada

        })
    })
}

const updateSala = (request, response) => {
    const {codigo, numero, descricao, capacidade, predio} = request.body; // vou receber os dados que coimpletam minha tabela no bd pelo body
    pool.query(`UPDATE salas SET numero=$1, descricao=$2, capacidade=$3, predio=$4
    WHERE codigo=$5 RETURNING codigo, numero, descricao, capacidade, predio`, 
    [numero, descricao, capacidade, predio, codigo], 
    (error, results) => {
        if(error){
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao alterar a sala!'
            })
        }
        response.status(200).json({
            status : "success", message : "Sala alterada",
            objeto : results.rows[0] // retorna o predio criado

        })
    })
}

const deleteSala = (request, response) => {
    const codigo = parseInt(request.params.codigo); // nos parametros da requisicao vou passar um codigo
    pool.query(`DELETE FROM salas WHERE codigo = $1`, [codigo], 
    (error, results) => {
        if(error || results.rowCount == 0){  // se o item ja foi deletado, ele retorna dizendo que nenhuma linha foi removida, justamente por nao existir mais
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao remover a sala: ' + 
                    (error ? error : 'Nenhuma linha removida')
            })
        }
        response.status(200).json({
            status : "success", message : "Sala removida",
            objeto : results.rows[0] // retorna o predio criado, o primeiro deles no caso

        })
    })
}

const getSalaPorCodigo = (request, response) => {
    const codigo = parseInt(request.params.codigo); // nos parametros da requisicao vou passar um codigo
    pool.query(`SELECT * FROM salas WHERE codigo = $1`, [codigo], 
    (error, results) => {
        if(error || results.rowCount == 0){  // se o item ja foi deletado, ele retorna dizendo que nenhuma linha foi removida, justamente por nao existir mais
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao recuperar a sala: ' + 
                    (error ? error : 'Nenhuma linha encontrada')
            })
        }
        response.status(200).json(results.rows[0]);
    })
}

module.exports = { getSalas, addSala, updateSala, deleteSala, getSalaPorCodigo } 