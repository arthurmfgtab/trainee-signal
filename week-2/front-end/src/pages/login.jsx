import React from 'react'
import { login } from './../services/auth'
import api from './../services/api'
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavLink,
    NavItem,
    Col,
    Form,
    FormGroup,
    Label,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Alert
} from 'reactstrap'

export default class Login extends React.Component {


    constructor(props) {
        super(props)

        this.state = {
            modal: false,
            erro: '',
            usuario: {
                _id: '',
                nome: '',
                email: '',
                senha: ''
            }
        }
    }


    renderNavbar = () => {
        return (
            <Navbar expand="md" color="navbar navbar-dark bg-info">
                <NavbarBrand href="/"> Trainee Signal Jr </NavbarBrand>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink target="_blank" href="https://google.com">
                            <Button color="light" outline> GitHub </Button>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink target="_blank" href="https://www.signaljunior.com.br">
                            <Button color="light" outline> Signal Jr Site </Button>
                        </NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        )
    }


    renderFormLogin = () => {
        return (
            <div className="container-fluid" style={{ marginTop: 40 }}>
                <div className="d-flex flex-row align-items-center justify-content-center">
                    <div
                        className="bg-light"
                        style={{
                            border: '1px solid #DDD',
                            borderRadius: 15,
                            padding: 20,
                            paddingTop: 30,
                            paddingBottom: 30
                        }}>

                           <Form onSubmit={ this.enviarFormLogin }>

                               {
                                   (this.state.erro) ? <Alert color="danger"> { this.state.erro } </Alert> : null
                               }

                                <FormGroup row>
                                    <Label sm={ 2 }> Email </Label>
                                    <Col> <Input onChange={ this.atualizarCampo } type="email" name="email" placeholder="Informe o seu email..." /> </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm={ 2 }> Senha </Label>
                                    <Col> <Input onChange={ this.atualizarCampo } type="password" name="senha" placeholder="Informe o sua senha..." /> </Col>
                                </FormGroup>

                                <br/>

                                <div className="d-flex flex-column">
                                    <Button color="info"> Entrar </Button> <br/>
                                    <Button color="info" outline onClick={ this.alternarModal }> Cadastre-se </Button>
                                </div>

                           </Form>

                    </div>
                </div>
            </div>
        )
    }


    alternarModal = () => {
        this.setState(prevState => ({ modal: !prevState.modal }))
    }


    enviarFormCadastro = async (evento) => {
        evento.preventDefault() 

        const { nome, email, senha } = this.state.usuario

        const novoUsuario = {
            nome: nome,
            email: email,
            senha: senha
        }      
        
        try {
            
            const resposta = await api.post('/api/usuario/cadastrar', novoUsuario)
            if (resposta.data.erro) {
                alert('Ocorreu um erro, favor checar o console!')
                this.alternarModal()
                return console.log(resposta.data.mensagemErro)
            } else {
                alert('Usuário cadastrado com sucesso!')
                this.alternarModal()
                return console.log(resposta.data.usuario)
            }

        } catch (erro) {
            console.log(erro)
        }
    }


    enviarFormLogin = async (evento) => {
        evento.preventDefault()

        const { email, senha } = this.state.usuario

        const usuario = { email: email, senha: senha }

        try {
            
            const resposta = await api.post('/api/usuario/logar', usuario)
            if (resposta.data.erro) {
                this.setState({ erro: resposta.data.mensagemErro })
                return console.log(resposta.data.mensagemErro)
            } else {
                login(resposta.data.token)
                return this.props.history.push('/home')
            }

        } catch (erro) {
            console.log(erro)
        }
    }


    atualizarCampo = (evento) => {
        const { usuario } = this.state
        usuario[evento.target.name] = evento.target.value 
        this.setState({ usuario, erro: '' })
    }


    renderModalCadastrar = () => {
        return (
            
            <Modal isOpen={ this.state.modal } toggle={ this.alternarModal }>
                <ModalHeader> Cadastro de Usuário </ModalHeader>
                <ModalBody>

                <Form onSubmit={ this.enviarFormCadastro }>
                    <FormGroup row>
                        <Label sm={ 2 }> Nome </Label>
                        <Col> <Input onChange={ this.atualizarCampo } type="text" name="nome" placeholder="Informe o seu nome..." /> </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label sm={ 2 }> Email </Label>
                        <Col> <Input onChange={ this.atualizarCampo } type="email" name="email" placeholder="Informe o seu email..." /> </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label sm={ 2 }> Senha </Label>
                        <Col> <Input onChange={ this.atualizarCampo } type="password" name="senha" placeholder="Informe o sua senha..." /> </Col>
                    </FormGroup>

                    <ModalFooter>
                        <Button type="submit" color="primary"> Cadastrar </Button>{' '}
                        <Button color="secondary" onClick={ this.alternarModal }> Cancelar </Button>
                    </ModalFooter>
                </Form>

                </ModalBody>
            </Modal>
        )
    }


    render = () => {
        return (
            <div>
                { this.renderNavbar() }
                { this.renderFormLogin() }
                { this.renderModalCadastrar() }
            </div>
        )
    }

}