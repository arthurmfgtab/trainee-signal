import React from 'react'
import api from './../services/api'
import { login } from './../services/auth'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink,
         Col, Form, FormGroup, Label, Input, Button, 
         Modal, ModalHeader, ModalBody, ModalFooter, Alert
} from 'reactstrap'


export default class Login extends React.Component {

    /**
     * 
     */
    constructor(props) {
        super(props)

        this.state = {
            erroLogar: '',
            erroCadastrar: '',
            modal: false,
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
                this.setState({ erroLogar: resposta.data.mensagemErro })
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
                this.setState({ erroCadastrar: resposta.data.mensagemErro })
                console.log(resposta.data.mensagemErro)
            } else {
                alert('Usuário cadastrado com sucesso!')
                console.log('Usuário cadastrado com sucesso!')
                this.toggleModal()
                this.zerarStateUsuario()
            }

        } catch (erro) {
            console.log(erro)
        }
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
    toggleModal = () => {
        this.zerarStateUsuario()
        this.setState(prevState => ({ modal: !prevState.modal }))
    }


    /**
     * 
     */
    atualizarCampo = (event) => {
        const { usuario } = this.state
        usuario[event.target.name] = event.target.value
        this.setState({ usuario, erroCadastrar: '', erroLogar: '' })
    }


    /**
     * 
     */
    renderNavbar = () => {
        return (
            <div>
                <Navbar color="success" dark expand="md">
                    <NavbarBrand href="/"> Signal Jr </NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink 
                                target="_blank" 
                                href="https://reactstrap.github.io/components">
                                    Componentes
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
                </Navbar>
            </div>
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
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>
                    <img style={{ marginTop: -100 }} alt="avatar" src='https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Prescription01&hairColor=Auburn&facialHairType=BeardMagestic&facialHairColor=Brown&clotheType=CollarSweater&clotheColor=Blue03&eyeType=Wink&eyebrowType=AngryNatural&mouthType=Default&skinColor=Tanned'/>
                    <br/>
                    <br/>
                    { (this.state.erroLogar) ? <Alert color="danger"> { this.state.erroLogar } </Alert> : undefined }

                    <hr/>
                    <Form onSubmit={ this.logar }>
                        <FormGroup row>
                            <Label sm={2}> <strong> Email </strong> </Label>
                            <Col sm={10}>
                                <Input onChange={ this.atualizarCampo } type="email" name="email" placeholder="seuEmail" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}> <strong> Senha </strong> </Label>
                            <Col sm={10}>
                                <Input onChange={ this.atualizarCampo } type="password" name="senha" placeholder="suaSenha" />
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col>
                                <Button type='submit' size="sm" block color="success"> Entrar </Button>
                                <Button onClick={ this.toggleModal } size="sm" block color="success" outline> Cadastrar </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        )
    }


    /**
     * 
     */
    renderModal = () => {
        return (
            <div>
                <Modal isOpen={ this.state.modal } toggle={ this.toggleModal }>
                    <ModalHeader toggle={ this.toggleModal }> Cadastrar Usuário </ModalHeader>
                    <ModalBody>

                        { (this.state.erroCadastrar) ? <Alert color="danger"> { this.state.erroCadastrar } </Alert> : undefined }
                        
                        <Form onSubmit={ this.cadastrar }>
                            <FormGroup row>
                                <Label sm={2}> <strong> Nome </strong> </Label>
                                <Col sm={10}>
                                    <Input onChange={ this.atualizarCampo } type="text" name="nome" placeholder="seuNome" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label sm={2}> <strong> Email </strong> </Label>
                                <Col sm={10}>
                                    <Input onChange={ this.atualizarCampo } type="email" name="email" placeholder="seuEmail" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label sm={2}> <strong> Senha </strong> </Label>
                                <Col sm={10}>
                                    <Input onChange={ this.atualizarCampo } type="password" name="senha" placeholder="suaSenha" />
                                </Col>
                            </FormGroup>
                            <ModalFooter>
                                <Button type='submit' color="success"> Cadastrar </Button>
                                <Button outline color="success" onClick={ this.toggleModal }> Cancelar </Button>
                            </ModalFooter>
                        </Form>
                    </ModalBody>
                    
                </Modal>
            </div>
        )
    }


    /**
     * Essa função é obrigatória na renderização do componente. Estamos utilizando ela 
     * para chamar as funções que renderizam elementos em tela.
     */
    render = () => {
        return (
            <div>
                { this.renderNavbar() }
                { this.renderForm() }
                { this.renderModal() }
            </div>
        )
    }

}