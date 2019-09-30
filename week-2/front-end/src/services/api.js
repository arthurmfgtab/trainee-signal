import axios from 'axios' // Módulo para fazer requisições HTTP à nossa API.
import { pegarToken } from './auth' // Função que retorna o token, caso este exista.

/* Cria uma constante chamada 'api' contendo a rota raíz como prefixo. Essa constante 
 * será muito utilizada nas requisições HTTP que fizermos. 
 * Eis um exemplo de requisição utilizando essa constante: api.post('/api/usuario/listar')
 */
const api = axios.create({ baseURL: 'http://localhost:4000' })

/**
 * O interceptors é uma das funções mais legais que temos dentro da pasta 'services'. 
 * Basicamente essa função está pegando o token, caso o mesmo exista, e salvando numa 
 * constante. Depois verifica-se se essa constante existe, e, caso exista, colocamos 
 * esse token no cabeçalho da requisição (feita através da nossa constante api criada
 * acima). Isso é importantíssimo para o que nossa API valide nosso token em rotas 
 * que necessitam de autenticação. 
 * Essa função é acionada sempre que uma requisição é feita, porém ela age antes da 
 * requisição ser enviada para a API, o que nos pouca de ter que colocar a todo 
 * momento nosso token no cabeçalho, isso fica a cargo dessa função de forma automática.
 */
api.interceptors.request.use(async config => {
    const token = pegarToken()
    if (token) config.headers.Authorization = 'Bearer ' + token
    return config
})

// Exporta o módulo para que o mesmo possa ser importado por outros arquivos.
export default api