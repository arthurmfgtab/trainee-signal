/**
 * Para entender as funções abaixo é importantíssimo que você entenda um pouco sobre Local Storage.
 * Esse recurso é muito útil para quem trabalha com front-end. Esse carinha faz parte das 
 * opções de armazenamento que temos no browser/navegador. Com ele podemos salvar objetos, 
 * variáveis e outros tipos de recursos na memória do navegado. 
 * Usaremos o local storage para armazenar nosso token recebido da API. Isso será necessário  
 * em futuras requisições após logarmos, uma vez que nossa rota '/home' só pode ser acessada 
 * por usuários que estão logados. 
 */


/* Verifica se existe um token válido. Se existir essa função retorna o valor 'true',
 * se não retorna o valor 'false'.
 */
export const estaAutenticado = () => localStorage.getItem('TOKEN') !== null 


// Essa função retorna o token, caso o mesmo exista, para quem a chamou.
export const pegarToken = () => localStorage.getItem('TOKEN')


// Essa função recebe um token como parâmetro e coloca ele dentro da constante 'TOKEN'.
export const login = (token) => localStorage.setItem('TOKEN', token)


// Essa aqui retira nossa constante 'TOKEN' do local storage, deslogando, assim, o usuário.
export const logout = () => localStorage.removeItem('TOKEN')