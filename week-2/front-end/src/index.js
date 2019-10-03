import React from 'react' // Módulo principal do React.
import ReactDOM from 'react-dom' // Módulo de manipulação dos elementos DOM.
import App from './App' // Arquivo App.js contendo apenas as rotas.
import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap para estilização.

/**
 * O React basicamente roda inteiramente em cima de uma div. Essa div está no index.html
 * dentro da pasta 'public'. A partir dessa div toda nossa aplicação é sobrescrita.
 * A função 'render' abaixo basicamente pega essa div e coloca nossa App.js inteiro nela.
 * O App.js por sua vez chama as rotas, que por sua vez chama os componentes de acordo 
 * com cada rota, é muito legal.
 */
ReactDOM.render(<App />, document.getElementById('root'))

