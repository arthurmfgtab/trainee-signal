const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    try {
        /**
         * 1. Recebe um token via o cabeçalho da requisição através da variável
         *    'authorization'. Essa variável deve ter algo como 'Bearer ajd9j8j', 
         *    sendo esse 'ajd9j8j' um código bem maior que é o token propriamente 
         *    dito. Utilizamos o 'split' para separar o bearer do token (essa 
         *    string é separada em 2 partes e cada parte vira um item de um vetor;
         *    o 1 refere-se ao segundo indice desse vetor, ou seja, ao token).
         * 2. Verifica se o token descriptografado bate com a chave privada.
         * 3. Coloca os dados descriptografados no request.
         * 4. Deixa que a requisição siga o fluxo e chegue no controller.
         */
        const token = req.headers.authorization.split(' ')[1]
        const tokenDecodificado = jwt.verify(token, process.env.JWT_KEY)
        req.dadosUsuario = tokenDecodificado
        next()
    } catch (mensagemErro) {
        console.log(mensagemErro)
        return res.json({ erro: true, mensagemErro: 'Erro na autenticação!' })
    }
}
