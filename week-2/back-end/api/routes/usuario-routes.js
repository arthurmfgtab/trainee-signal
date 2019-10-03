const express = require('express')
const router = express.Router()
const usuarioController = require('./../controllers/usuario-controller')
const checkAuth = require('./../middlewares/check-auth')

/**
 * Utilizamos um verbo HTTP + uma rota específica para mapear quais 
 * actions/funções dos controllers irão ser chamadas. Algumas rotas 
 * só podem acessadas se o usuário estiver logado (com um token válido)
 * e é justamente esse tratamento que nosso checkAuth (middleware que 
 * nós criamos) está fazendo.
 */

router.get('/api/usuario/listar', checkAuth, usuarioController.listar)

router.post('/api/usuario/logar', usuarioController.logar)

router.post('/api/usuario/cadastrar', usuarioController.cadastrar)

router.put('/api/usuario/editar/:_id', checkAuth, usuarioController.editar)

router.delete('/api/usuario/excluir/:_id', checkAuth, usuarioController.excluir)

module.exports = router

