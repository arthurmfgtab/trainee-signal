import React from 'react'
import api from './../services/api'
import { login } from './../services/auth'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink,
         Col, Form, FormGroup, Label, Input, Button, 
         Modal, ModalHeader, ModalBody, ModalFooter, Alert
} from 'reactstrap'


// Classe exportada de maneira padrão.
export default class Login extends React.Component {

    /**
     * O construtor é a primeira coisa que é executada quando uma 
     * classe é instanciada/chamada. Essa função inclusive nos 
     * possibilita receber propriedades passadas por quem chamou 
     * este componente. 
     * 
     * Porém o que realmente importa pra gente aqui nesse contexto 
     * são os states. States basicamente são estados dinâmicos que 
     * vão dinamizar algumas informações que são renderizadas. 
     * Nomes, registros de tabela, várias coisas podem mudar de acordo 
     * com interações com usuários, essas coisas são estados. 
     * Pense nos states como variáveis que tornam nossa aplicação dinâmica.
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
     * Função chamada quando o botão 'Logar' for clicado. 
     * Basicamente pega-se o objeto/state 'usuario' e utilizando
     * ele enviamos no requisição à API.
     * 
     * Se houver um erro (lembrando que tanto a variável booleada 'erro' quanto a 
     * mensagem 'mensagemErro' são variáveis que nossa API está 
     * enviando, os nomes devem ser estes) imprime esse erro, se não chama-se 
     * a função 'login' importada fo arquivo '/services/auth' passando o token 
     * retornado da API. Após isso zera-se o state e redirecionados o usuário 
     * para a home que é nossa única página sem ser o login.
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
     * Função chamada quando o formulário de cadastro for enviado. 
     * Fazemos a requisição para a API enviando o objeto usuário, 
     * objeto este que é o state 'usuario' e foi preenchido pela 
     * função 'atualizarCampo'. Caso haja um erro imprime-se esse 
     * erro (lembrando que tanto a variável booleada 'erro' quanto a 
     * mensagem 'mensagemErro' são variáveis que nossa API está 
     * enviando, os nomes devem ser estes), se não fecha-se o modal 
     * e zera-se os valores contidos no objeto/state 'usuario'. 
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
     * Faz com que todos os atributos do objeto/state usuário sejam 
     * strings vazias.
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
     * Abre ou fecha o modal. Basicamente coloca-se no state modal (state esse 
     * responsável por dizer se o modal está aberto ou fechado) o contrário do 
     * valor atual, ou seja, se essa state for true no momento, ela vai pra false,
     * e vice versa.
     */
    toggleModal = () => {
        this.zerarStateUsuario()
        this.setState(prevState => ({ modal: !prevState.modal }))
    }


    /**
     * Essa função é chamada sempre que o usuário digitar algo nos campos 
     * do formulário de login ou do formulário de cadastro.
     * Basicamente colocamos no campo correto do objeto usuário o valor digitado. 
     * Sabemos qual atributo/campo preencher com determinado valor porque tanto 
     * esse campo quanto o valor são determinado e passados pelo 'event' que a 
     * função que chama o atualizarCampo manda, o famoso 'onChange' contido nos
     * inputs dos formulários.
     */
    atualizarCampo = (event) => {
        const { usuario } = this.state
        usuario[event.target.name] = event.target.value
        this.setState({ usuario, erroCadastrar: '', erroLogar: '' })
    }


    /**
     * Navbar feito com Reactstrap.
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
     * Formulário de login feito com Reactstrap.
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
     * Modal de cadastro feito com Reactstrap. 
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