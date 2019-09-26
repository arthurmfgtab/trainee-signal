import React from 'react'
import api from './../services/api'
import {
    Navbar, 
    NavbarBrand,
    NavLink,
    Table,
    Nav,
    NavItem,
    Col,
    Input, 
    Label,
    Form,
    FormGroup,
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button
} from 'reactstrap'

export default class Home extends React.Component {


    constructor(props) {
        super(props)

        this.state = {
            erro: '',
            usuarios: [],
            usuario: {
                _id: '',
                nome: '',
                email: '',
                senha: ''
            }
        }
    }


    componentDidMount = async () => {
        
        try {
            
            const resposta = await api.get('/api/usuario/listar')
            if (resposta.data.erro) {
                return this.setState({ erro: resposta.data.mensagemErro })
            }
            this.setState({ usuarios: resposta.data.usuarios })

        } catch (erro) {
            console.log(erro)
        }
    }


    excluirUsuario = async (_id) => {
        console.log(_id)
    }


    editarUsuario = async () => {

    }

    
    cadastrarUsuario = async () => {

    }


    renderNavbar = () => {
        return (
            <Navbar expand="md" color="navbar navbar-dark bg-info">
                <NavbarBrand href="/"> Trainee Signal Jr </NavbarBrand>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink target="_blank" href="https://google.com">
                            <Button color="light" outline> Cadastrar </Button>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink target="_blank" href="https://www.signaljunior.com.br">
                            <Button color="light" outline> Sair </Button>
                        </NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        )
    }


    renderTabelaUsuarios = () => {
        return (
            <div style={{ marginLeft: 200, marginRight: 200, marginTop: 100 }}>
                <Table hover striped size="sm">
                    <thead>
                        <tr>
                            <th> ID </th>
                            <th> Nome </th>
                            <th> Email </th>
                            <th> Operações </th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderTabelaItem() }
                    </tbody>
                </Table>
            </div>
        )
    }


    renderTabelaItem = () => {

        const { usuarios } = this.state

        return usuarios.map(usuario => {
            return (
                <tr key={ usuario._id }>
                    <td> { usuario._id } </td>
                    <td> { usuario.nome } </td>
                    <td> { usuario.email } </td>
                    <td>
                        <Button style={{ marginRight: 10 }} color='warning'> Editar </Button>
                        <Button onClick={ () => this.excluirUsuario(usuario._id) } color='danger'> Excluir </Button>
                    </td>
                </tr>
            )
        })
    }


    render = () => {
        return (
            <div>
                { this.renderNavbar() }
                { this.renderTabelaUsuarios() }
            </div>
        )
    }
}