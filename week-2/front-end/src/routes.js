import React from 'react' // Módulo principal do React.
// Esses submódulos serão utilizados no roteamento dos componentes.
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom'
import Home from './pages/home' // Nossa página/componente 'Home' vindo da pasta 'pages'.
import Login from './pages/login' // Nossa página/componente 'Login' vindo da pasta 'pages'.
import { estaAutenticado } from './services/auth' // Nossa função de verificação de autenticidade.

/**
 * Bom, essa função modifica um pouco nosso componente nativo 'Route'. 
 * O Route mapeia uma rota através do atributo 'path' e renderiza um componente 
 * através do atributo 'render'. Aqui nessa função utilizamos o Routes para 
 * apenas renderizar o componente caso a resposta da nossa função 'estaAutenticado' 
 * seja 'true', isto é, seja positiva. 
 */
const PrivateRoute = ({ component: Component }) => (
    <Route 
        render={props => ( // Recebe as propriedades passadas no render por quem chamou.
            /**
             * As 3 linhas abaixo fazem parte de um modo diferente de declarar uma condição.
             * Ao invés de utilizar o 'if-else' aqui utilizados o condicional ternário.
             * Basicamente funciona assim: 
             * (condição) ? ação-caso-a-condição-seja-satisfeita : ação-caso-não-seja
             * O legal desse modo de declarar condições é que da pra fazer tudo numa linha só.
             * Abaixo estamos utilizando em várias linhas, mas ainda sim fica bem legal.
             * Então renderizamos o componente caso o usuário esteja autenticado ou redirecionamos
             * ele para a página de login caso não esteja.
             */
            estaAutenticado()
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )}
    />
)

/**
 * 
 */
const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={ Login } />
            <PrivateRoute path='/home' component={ Home } />
            <Route path='*' component={ () => <h1> Page not found! </h1> } />
        </Switch>
    </BrowserRouter>
)

// Exporta o módulo para que o mesmo possa ser importado por outros arquivos.
export default Routes