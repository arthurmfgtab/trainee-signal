const express = require('express')
const app = express()
const morgan = require('morgan') // Log de requisições no terminal/console
const bodyParser = require('body-parser') // Tratamento de dados da requisição(JSON)
const mongoose = require('mongoose') // Manipulação e abstração de funções mongodb
// Por padrão portas diferentes não podem se comunicar, o cors possibilita essa conversa)
const cors = require('cors') 


/**
 * A conexão com o banco de dados utilizando mongoose é bem simples. E ficou 
 * ainda mais simples aqui porque estamos utilizando um banco de dados que 
 * está na nuvem, ou seja, não precisamos instalar o banco, precisamos apenas 
 * de uma String de conexão. 
 * 
 * A função 'connect' abaixo recebe 2 parâmetros. O primeiro é essa string
 * de conexão com o MongoDB Atlas e o segundo é um objeto contendo alguns
 * subparâmetros de configuração.
 */
mongoose.connect(
    "mongodb+srv://signaljr:signaljr@trainee-8oaih.mongodb.net/trainee?retryWrites=true&w=majority",
    {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true, 
        useNewUrlParser: true
    }
)

/**
 * Execução dos middlewares.
 * 
 * Os middlewares basicamente são filtros que agem entre a 
 * requisição e a função que executado o que se pede. 
 * Ex: um requisição de cadastro POST pode chegar, porém 
 * antes de chamarmos a action/função no controller 
 * referente ao processamento isso passa pelos middlewares.
 */
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())


/**
 * Toda rota que chegar será tratada pelo arquivo 'usuario-routes',
 * caso este não consiga tratar, ou seja, a rota buscada não está 
 * mapeada, retorna-se 'Página não encontrada'. 
 */ 
app.use( '/', require('./api/routes/usuario-routes') )
app.use((req, res) => res.json('Página não encontrada!') )


// Exportar o módulo
module.exports = app