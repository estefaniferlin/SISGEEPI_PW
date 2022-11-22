const { response } = require('express');
const { pool } = require('../config');

// Método para retornar todos os prédios
const getPredios =(request, response) => {
    pool.query('SELECT * FROM predios ORDER BY codigo',  //query: recebe 2 parametros, um é o comando sql e o segundo os callbacks que podem executar 
        (error, results) => { //callbacks de erro e resultados
            if(error){
                return response.status(400).json({
                    status : 'error', 
                    message : 'Erro ao consultar o prédio: ' + error
                })
            }
            response.status(200).json(results.rows); // retorno somente o resultado das linhas se não houver erro
        }
    )
}

// quando teremos mais de uma linha usamos ` `
const addPredio = (request, response) => {
    //extrair o predio
    const {nome, descricao, sigla} = request.body; // vou receber os dados que coimpletam minha tabela no bd pelo body
    pool.query(`INSERT INTO predios (nome, descricao, sigla) 
    VALUES ($1, $2, $3) RETURNING codigo, nome, descricao, sigla`, 
    [nome, descricao, sigla], 
    (error, results) => {
        if(error){
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao inserir o prédio!'
            })
        }
        response.status(200).json({
            status : "success", message : "Prédio criado",
            objeto : results.rows[0] // retorna o predio criado, o primeiro deles no caso

        })
    })
}

const updatePredios = (request, response) => {
    const {codigo, nome, descricao, sigla} = request.body; // vou receber os dados que coimpletam minha tabela no bd pelo body
    pool.query(`UPDATE predios SET nome=$1, descricao=$2, sigla=$3
    WHERE codigo =$4 RETURNING codigo, nome, descricao, sigla`, 
    [nome, descricao, sigla, codigo], 
    (error, results) => {
        if(error){
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao alterar o prédio!'
            })
        }
        response.status(200).json({
            status : "success", message : "Prédio alterado",
            objeto : results.rows[0] // retorna o predio criado, o primeiro deles no caso

        })
    })
}

const deletePredio = (request, response) => {
    const codigo = parseInt(request.params.codigo); // nos parametros da requisicao vou passar um codigo
    pool.query(`DELETE FROM predios WHERE codigo = $1`, [codigo], 
    (error, results) => {
        if(error || results.rowCount == 0){  // se o item ja foi deletado, ele retorna dizendo que nenhuma linha foi removida, justamente por nao existir mais
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao remover o prédio: ' + 
                    (error ? error : 'Nenhuma linha removida')
            })
        }
        response.status(200).json({
            status : "success", message : "Prédio removido",
            objeto : results.rows[0] // retorna o predio criado, o primeiro deles no caso

        })
    })
}

const getPredioPorCodigo = (request, response) => {
    const codigo = parseInt(request.params.codigo); // nos parametros da requisicao vou passar um codigo
    pool.query(`SELECT * FROM predios WHERE codigo = $1`, [codigo], 
    (error, results) => {
        if(error || results.rowCount == 0){  // se o item ja foi deletado, ele retorna dizendo que nenhuma linha foi removida, justamente por nao existir mais
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao recuperar o prédio: ' + 
                    (error ? error : 'Nenhuma linha encontrada')
            })
        }
        response.status(200).json(results.rows[0]);
    })
}

module.exports = { getPredios, addPredio, updatePredios, deletePredio, getPredioPorCodigo } 