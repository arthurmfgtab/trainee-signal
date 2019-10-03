const express = require('express')
const router = express.Router()
const usuarioController = require('./../controllers/usuario-controller')
const checkAuth = require('./../middlewares/check-auth')

router.get('/api/usuario/listar', checkAuth, usuarioController.listar)

router.post('/api/usuario/logar', usuarioController.logar)

router.post('/api/usuario/cadastrar', usuarioController.cadastrar)

router.put('/api/usuario/editar/:_id', checkAuth, usuarioController.editar)

router.delete('/api/usuario/excluir/:_id', checkAuth, usuarioController.excluir)

module.exports = router

