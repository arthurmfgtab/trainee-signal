import React from 'react'
import api from './../services/api'
import { logout } from './../services/auth'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Col,
         Form, FormGroup, Label, Input, Button, Modal, 
         ModalHeader, ModalBody, ModalFooter, Alert, Table
} from 'reactstrap'


export default class Login extends React.Component {

    
    constructor(props) {
        super(props)
        /**
         * States, ou estados, são uma espécie de variável que dinamizam os dados 
         * que são renderizados na nossa aplicação. Tudo quanto é informação dinâmica,
         * ou seja, que pode sofrer mudanças, está aqui.
         * 
         * Cada state aqui começa vazia, porém são manipuladas (preenchidas, editadas e 
         * esvaziadas) pelas funções que estão após o construtor.
         */
        this.state = {
            usuarios: [],
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
     * Essa é uma das funções de ciclo de vida do React. Tem um nome específico que não 
     * podemos mudar e é executada sempre que o componente é renderizada, ou seja, 
     * sempre que essa página for aberto no navegador.
     * 
     * Estamos utilizando essa função para buscar todos os usuários cadastrados na nossa 
     * API. A requisição é feita utilizando a constante 'api' criada e configurada no
     * arquivo 'api.js' que está dentro da pasta 'services'.
     * Utilizamos um try-catch para fazer a requisição e 'dar um catch', isto é, pegar, 
     * um erro que não previmos. No 'try' salvamos a resposta da requisição numa constante.
     * Com essa constante testamos se existe um erro, caso exista eu imprimo no console do 
     * browser, caso não exista eu receberei todos os usuários registrados no banco de dados.
     * Com isso eu posso utilizar a função 'setState' para atribuir à minha state 'usuarios' 
     * todos os usuários que foram recebidos através da requisição, sacaram? :)
     * 
     * OBS: o conhecimento dos principios dessa função serão utilizados nas funções abaixo.
     */
    componentDidMount = async () => {
        try {
            const resposta = await api.get('/api/usuario/listar')
            if (resposta.data.erro) {
                console.log(resposta.data.mensagemErro)
            } else {
                this.setState({ usuarios: resposta.data.usuarios })
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

        const { usuario, usuarios } = this.state

        try {
            
            const resposta = await api.post('/api/usuario/cadastrar', usuario)
            if (resposta.data.erro) {
                this.setState({ erroCadastrar: resposta.data.mensagemErro })
                console.log(resposta.data.mensagemErro)
            } else {
                alert('Usuário cadastrado com sucesso!')
                console.log('Usuário cadastrado com sucesso!')
                usuario._id = resposta.data.usuario._id
                usuarios.push(usuario)
                this.setState({ usuarios })
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
    excluir = async (_id) => {
        
        const { usuarios } = this.state

        try {
            const resposta = await api.delete('/api/usuario/excluir/' + _id)
            if (resposta.data.erro) {
                console.log(resposta.data.mensagemErro)
            } else {
                console.log('Usuário deletado com sucesso!')
                this.setState({ usuarios: usuarios.filter((usuario) => usuario._id !== _id) })
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
                            <Button 
                                color='success' 
                                onClick={ this.toggleModal }> 
                                    Cadastrar Usuário
                            </Button>
                        </NavItem>
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
                        <NavItem>
                            <NavLink onClick={ logout } href="/">
                                Sair
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
     * 
     */
    renderTabela = () => {
        return (
            <div style={{ backgroundColor: '#EFFFEF', marginLeft: 100, marginRight: 100, marginTop: 100 }}>
                <Table bordered>
                    <thead>
                        <tr>
                            <th> ID </th>
                            <th> Nome </th>
                            <th> E-mail </th>
                            <th> Opções </th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderUsuario() }
                    </tbody>
                </Table>
            </div>
        )
    }


    /**
     * 
     */
    renderUsuario = () => {

        const { usuarios } = this.state

        return usuarios.map((usuario) => {
            return (
                <tr key={ usuario._id }>
                    <td> { usuario._id } </td>
                    <td> { usuario.nome } </td>
                    <td> { usuario.email } </td>
                    <td>
                        <button 
                            className='btn btn-info'
                            onClick={ () => console.log('Funcionalidade de editar usuário!') } 
                            style={{ marginRight: 10 }}> 
                                Editar 
                        </button>
                        <button 
                            className='btn btn-danger'
                            onClick={ () => { if (window.confirm('Certeza?')) this.excluir(usuario._id) } }>
                                Excluir 
                        </button>
                    </td>
                </tr>
            )
        })
    }


    /**
     * Essa função é obrigatória na renderização do componente. Estamos utilizando ela 
     * para chamar as funções que renderizam elementos em tela.
     */
    render = () => {
        return (
            <div>
                { this.renderNavbar() }
                { this.renderTabela() }
                { this.renderModal() }
            </div>
        )
    }

}