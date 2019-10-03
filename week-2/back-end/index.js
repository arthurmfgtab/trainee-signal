/**
 * Cria-se um servidor na porta 4000 (ou na porta que a hospedagem decidir)
 * e, caso dê tudo certo na configuração desse servidor, imprime uma 
 * mensagem dizendo que ta rodando certinho.
 */
const http = require('http')
const app = require('./app')
const server = http.createServer(app)
const port = process.env.PORT || 4000

server.listen(port, () => console.log('\n Servidor rodando na porta 4000 \n'))
