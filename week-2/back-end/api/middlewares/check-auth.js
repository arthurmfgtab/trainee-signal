const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    try {

        const token = req.headers.authorization.split(' ')[1]
        const tokenDecodificado = jwt.verify(token, process.env.JWT_KEY)
        req.dadosUsuario = tokenDecodificado
        next()
    } catch (mensagemErro) {
        console.log(mensagemErro)
        return res.json({ erro: true, mensagemErro: 'Erro na autenticação!' })
    }
}
