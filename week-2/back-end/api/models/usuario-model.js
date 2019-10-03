const mongoose = require('mongoose')

/**
 * Modelagem de como queremos que nosso registro 'usuário' seja 
 * persistido no banco de dados. No caso queremos apenas um ID 
 * (que será posto de forma automática com a tipagem padrão de 
 * um objeto do tipo ID pelo mongodb), nome, email e senha, esses 
 * 3 últimos obrigatórios (required: true) e textuais (String).
 */
const usuarioSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    nome: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    senha: {
        required: true,
        type: String
    }
})

// Exporta-se esse model com o nome Usuario recebendo nosso schema.
module.exports = mongoose.model('Usuario', usuarioSchema)


