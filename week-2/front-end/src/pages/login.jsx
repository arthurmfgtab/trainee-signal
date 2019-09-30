import React from 'react'
import api from './../services/api'
import { 
    Collapse, 
    Navbar, 
    NavbarToggler, 
    NavbarBrand, 
    Nav, 
    NavItem, 
    NavLink, 
    Col, 
    Button, 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    Alert, 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter
} from 'reactstrap'
import { login } from './../services/auth'


export default class Login extends React.Component {

  
    constructor(props) {
        super(props)

        this.state = {
            navbarEstaAberto: false,
            modalEstaAberto: false,
            erroLogin: '',
            erroCadastro: '',
            usuario: {
                _id: '',
                nome: '',
                email: '',
                senha: ''
            }
        }
    }


    /**
     * 
     */
    logar = async (event) => {
        event.preventDefault()

        const { usuario } = this.state

        try {
            const resposta = await api.post('/api/usuario/logar', usuario)
            if (resposta.data.erro) {
                this.setState({ erroLogin: resposta.data.mensagemErro })
                console.log(resposta.data.mensagemErro)
            } else {
                login(resposta.data.token)
                this.zerarStateUsuario()
                return this.props.history.push('/home')
            }
        } catch (erro) {
            console.log(erro)
        }
    }


    /**
     * 
     */
    cadastrar = async (event) => {
        event.preventDefault()

        const { usuario } = this.state 

        try {
            const resposta = await api.post('/api/usuario/cadastrar', usuario)
            if (resposta.data.erro) {
                this.setState({ erroCadastro: resposta.data.mensagemErro })
                console.log(resposta.data.mensagemErro)
            } else {
                alert('Usuário cadastrado com sucesso!')
                this.toggleModalCadastrar()
                this.zerarStateUsuario()
            }
        } catch (erro) {
            console.log(erro)
        }
    }


    /**
     * 
     */
    toggleNavbar = () => {
        this.setState({ navbarEstaAberto: !this.state.navbarEstaAberto })
    }


    /**
     * 
     */
    toggleModalCadastrar = () => {
        this.setState(prevState => ({ modalEstaAberto: !prevState.modalEstaAberto }))
    }


    /**
     * 
     */
    zerarStateUsuario = () => {
        const usuario = {
            _id: '',
            nome: '',
            email: '',
            senha: ''
        }
        this.setState({ usuario })
    }


    /**
     * 
     */
    atualizarCampo = (event) => {
        const { usuario } = this.state
        usuario[event.target.name] = event.target.value 
        this.setState({ usuario, erroLogin: '', erroCadastro: '' })
    }


    /**
     * 
     */
    renderNavbar = () => {
        return (
            <Navbar color="success" dark expand="md">
                <NavbarBrand href="/"> Signal Jr </NavbarBrand>
                <NavbarToggler onClick={this.toggleNavbar} />
                <Collapse isOpen={this.state.navbarEstaAberto} navbar>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink 
                            target="_blank" 
                            href="https://reactstrap.github.io/components/"> 
                            Componentes Reactstrap 
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink 
                            target="_blank" 
                            href="https://github.com/arthurmfgtab/trainee-signal-2019.2">
                            GitHub
                        </NavLink>
                    </NavItem>
                </Nav>
                </Collapse>
            </Navbar>
        )
    }


    /**
     * 
     */
    renderModalCadastrar = () => {
        return (
            <Modal isOpen={this.state.modalEstaAberto} toggle={this.toggleModalCadastrar} className={this.props.className}>
                <ModalHeader toggle={this.toggleModalCadastrar}> Cadastrar Usuário </ModalHeader>
                <ModalBody>
                    
                    <Form onSubmit={ this.cadastrar }>

                        { (this.state.erroCadastro) && <Alert color="danger"> { this.state.erroCadastro } </Alert> }
                        
                        <FormGroup row>
                            <Label sm={2}> <strong> Nome </strong> </Label>
                            <Col sm={10}>
                                <Input type="text" onChange={ this.atualizarCampo } name="nome" />
                            </Col>
                        </FormGroup>
                        
                        <FormGroup row>
                            <Label sm={2}> <strong> Email </strong> </Label>
                            <Col sm={10}>
                                <Input type="email" onChange={ this.atualizarCampo } name="email" />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label sm={2}> <strong> Senha </strong> </Label>
                            <Col sm={10}>
                                <Input type="password" onChange={ this.atualizarCampo } name="senha" />
                            </Col>
                        </FormGroup>

                        <ModalFooter>
                            <Button color="primary" onClick={this.toggle}> Cadastrar </Button>{' '}
                            <Button color="secondary" onClick={this.toggleModalCadastrar}> Cancelar </Button>
                        </ModalFooter>
                    
                    </Form>

                </ModalBody>
            </Modal>
        )
    }


    /**
     * 
     */
    renderForm = () => {
        return (
            <div style={{
                backgroundColor: '#DFFDE5',
                display: 'flex',
                justifyContent:'center',
                alignItems:'center',
                height: '100vh' }}>
                
                <div style={{ borderRadius: 15, padding: 50, marginTop: -200 }}>
                    <img alt="avatar" src='https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortWaved&accessoriesType=Round&hairColor=BrownDark&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=BlazerSweater&clotheColor=Gray01&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'/>
                    <br/>
                    <hr/>
                    
                    { (this.state.erroLogin) && <Alert color="danger"> { this.state.erroLogin } </Alert> }
                    
                    <Form onSubmit={ this.logar }>
                        <FormGroup row>
                            <Label sm={2}> <strong>Email</strong> </Label>
                            <Col sm={10}>
                                <Input type="email" onChange={ this.atualizarCampo } name="email" placeholder="Informe seu email..." />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}> <strong>Senha</strong> </Label>
                            <Col sm={10}>
                                <Input type="password" onChange={ this.atualizarCampo } name="senha" placeholder="Informe sua senha..." />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col>
                                <Button outline color='success' block> Entrar </Button>
                                <Button onClick={ this.toggleModalCadastrar } outline color='success' block> Cadastre-se </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>

            </div>
        )
    }


    /**
     * Essa função é obrigatória na renderização do componente. Estamos utilizando ela 
     * para chamar as funções que renderizam elementos em tela.
     */
    render() {
        return (
            <div>
                { this.renderNavbar() }
                { this.renderForm() }
                { this.renderModalCadastrar() }
            </div>
        )
    }
}