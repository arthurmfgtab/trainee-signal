import React from 'react'
import {
    BrowserRouter,
    Route,
    Switch
} from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Home from './pages/home'
import Login from './pages/login'

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={ Login } />
            <Route path="/home" component={ Home } />
            <Route path="*" component={ () => <h3>Page not found!</h3> } />
        </Switch>
    </BrowserRouter>
)

export default Routes