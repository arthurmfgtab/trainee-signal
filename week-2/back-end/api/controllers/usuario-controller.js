/**
 * 1. Model do usuário contendo o mapeamento da entidade usuario.
 * 2. O mongoose é um pacote que facilita nosso acesso a funções 
 *    e a manipulação de dados contidos no nosso banco de dados 
 *    MongoDB. Além disso ele consegue nos ajudar de outras formas,
 *    como facilitando a conexão da aplicação node com o banco mongo.
 * 3. Usaremos o pacote bcrypt para fazer a criptografia e 
 *    descriptografia de alguns dados na nossa aplicação.
 * 4. O JWT (JSON Web Token) é o pacote que usaremos para manipular
 *    tokens de autenticação aqui na nossa aplicação.
 */
const ModelUsuario = require('./../models/usuario-model')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


/**
 * ASYNC-AWAIT: é uma forma atual e prática de trabalhar 
 * com funções assíncronas com JavaScript. Aconselha-se dar um 
 * pesquisada por fora para entender o uso desse recurso.
 * 
 * TRY-CATCH: é uma forma de tratarmos erros de forma organizada. 
 * Dentro do 'try' colocamos nosso trecho de código a ser executado,
 * caso o mesmo não tenha dado certo por motivos não lógicos o erro 
 * é pego pelo 'catch'. O tratamento que estamos dando a partir do
 * 'catch' é padrão para todas as funções, que é o seguinte: 
 * pegamos a mensagem de erro gerado pelo próprio try-catch e salvamos
 * numa variável chamada 'mensagemErro'. Imprimimos essa mensagem no 
 * console/terminal e enviamos tanto essa mensagem (através de uma 
 * variável que também se chama mensagemErro; e, justamente por ser 
 * de mesmo nome [tanto a variável quanto o valor dela] não precisamos 
 * escrever 'mensagemErro: mensagemErro') quanto uma outra variável, 
 * essa booleana, chamada 'erro' contendo apenas o valor 'true'.
 */


/**
 * Salva-se todos os usuários contidos no banco dados em um vetor 
 * de objetivos chamado 'usuarios'. Requisitamos esse registros 
 * através da função 'find' do mongoose que basicamente faz essa 
 * busca. Retornamos em formato JSON todos esses usuaários para 
 * quem faz essa requisição.
 */
exports.listar = async (req, res) => {

    try {
        const usuarios = await ModelUsuario.find()
        return res.json({ usuarios })
    } catch (mensagemErro) {
        console.log(mensagemErro)
        return res.json({ erro: true, mensagemErro })
    }
}


/**
 * Depois de fazer as validações dos campos que esperados receber na requisição
 * verificamos se o email está ou não em uso. Se não tiver nós criptografamos 
 * a senha e criamos e salvamos o usuário no banco de dados, retortando, no fim,
 * esse usuário para o requisitor.
 */
exports.cadastrar = async (req, res) => {

    const { nome, email, senha } = req.body

    /**
     * Os 3 blocos condições abaixo validam se os campos não estão vazios
     * (ex: nome=''), numeros (o campo nome não existe) ou simplesmente 
     * indefinimos. Se alguma dessas afirmações for verdadeira retornamos 
     * duas variáveis ao requisitor: um 'erro' booleando e a mensagem do erro. 
     */ 

    if (nome === '' || nome === null || nome === undefined) {
        console.log('O campo nome é obrigatório!')
        return res.json({ erro: true, mensagemErro: 'O campo nome é obrigatório!' })
    }

    if (email === '' || email === null || email === undefined) {
        console.log('O campo email é obrigatório!')
        return res.json({ erro: true, mensagemErro: 'O campo email é obrigatório!' })
    }

    if (senha === '' || senha === null || senha === undefined) {
        console.log('O campo senha é obrigatório!')
        return res.json({ erro: true, mensagemErro: 'O campo senha é obrigatório!' })
    }

    try {
        
        const usuario = await ModelUsuario.findOne({ email })
        if (usuario) {
            return res.json({ erro: true, mensagemErro: 'Email em uso!' })
        }

        bcrypt.hash(senha, 10, async (erro, hash) => {

            if (erro) {
                return res.json({ erro: true, mensagemErro: 'Erro na criptografia da senha' })
            }

            const usuario = await ModelUsuario.create({
                ...req.body,
                senha: hash,
                _id: new mongoose.Types.ObjectId()
            })

            return res.json({ usuario })

        })

    } catch (mensagemErro) {
        console.log(mensagemErro)
        return res.json({ erro: true, mensagemErro })
    }

}


/**
 * Após as validações dos campos validamos também se o usuário de fato
 * existe através do email enviado sendo passado como filtro para a 
 * função 'findOne' do mongoose. Utilizamos a função 'compare' para 
 * validar se a senha enviada pela usuário bate com a senha criptografada
 * do mesmo contida no banco. Se passar por essa autenticação criamos um 
 * token com base em 3 parâmetros: chave pública (no mínimo 1 dado do 
 * usuário requisitor), chave privada (alguma variável ou hash que só o 
 * back-end sabe) e um tempo de expiração. Após essa criação retornamos 
 * esse token para o requisitor estruturado com JSON.
 */
exports.logar = async (req, res) => {

    const { email, senha } = req.body

    if (email === '' || email === null || email === undefined) {
        console.log('O campo email é obrigatório!')
        return res.json({ erro: true, mensagemErro: 'O campo email é obrigatório!' })
    }

    if (senha === '' || senha === null || senha === undefined) {
        console.log('O campo senha é obrigatório!')
        return res.json({ erro: true, mensagemErro: 'O campo senha é obrigatório!' })
    }

    try {
        
        const usuario = await ModelUsuario.findOne({ email })
        if (!usuario) {
            console.log('Usuário não existe!')
            return res.json({ erro: true, mensagemErro: 'Email e/ou senha incorretos!' })
        }

        bcrypt.compare(senha, usuario.senha, (mensagemErro, resultado) => {
            
            if (mensagemErro) {
                console.log('Email e/ou senha incorretos!')
                return res.json({ erro: true, mensagemErro: 'Email e/ou senha incorretos!' })
            }

            if (resultado) {

                const token = jwt.sign(
                    {
                        email: usuario.email,
                        _id: usuario._id
                    },
                    process.env.JWT_KEY,
                    { 
                        expiresIn: 86400 
                    }
                )

                return res.json({ token })

            } else {
                console.log('Email e/ou senha incorretos!')
                res.json({ erro: true, mensagemErro: 'Email e/ou senha incorretos!' })
            }

        })

    } catch (mensagemErro) {
        console.log(mensagemErro)
        return res.json({ erro: true, mensagemErro })
    }

}


/**
 * Após as validações modificamos o usuário através da função 
 * 'findByIdAndUpdate'. Abaixo ainda há outra validação caso 
 * o usuário de fato não exista.
 * Aqui recebemos dados tanto do corpo da requisição quanto 
 * via parâmetro de URL.
 */
exports.editar = async (req, res) => {

    const { nome, email } = req.body
    const { _id } = req.params

    if (nome === '' || nome === null || nome === undefined) {
        console.log('O campo nome é obrigatório!')
        return res.json({ erro: true, mensagemErro: 'O campo nome é obrigatório!' })
    }

    if (email === '' || email === null || email === undefined) {
        console.log('O campo email é obrigatório!')
        return res.json({ erro: true, mensagemErro: 'O campo email é obrigatório!' })
    }


    try {
        
        const usuario = await ModelUsuario.findByIdAndUpdate(
            { _id },
            { nome, email },
            { new: true }
        )

        if (!usuario) {
            return res.json({ erro: true, mensagemErro: 'Usuário não encontrado!' })
        }
        return res.json('Usuário editado com sucesso!')

    } catch (mensagemErro) {
        console.log(mensagemErro)
        return res.json({ erro: true, mensagemErro })
    }
}


/**
 * Recebe-se um ID via parâmetro de URL e usando um filtro na 
 * função 'findOne' verificamos se o usuário existe, se de fato 
 * existir o excluimos.
 */
exports.excluir = async (req, res) => {
    
    const { _id } = req.params

    try {
        
        const usuario = await ModelUsuario.findOne({ _id })
        if (!usuario) {
            return res.json({ erro: true, mensagemErro: 'Usuário inexistente!' })
        }
        await ModelUsuario.deleteOne({ _id })
        return res.json('Usuário deletado!')

    } catch (mensagemErro) {
        console.log(mensagemErro)
        return res.json({ erro: true, mensagemErro })
    }
}