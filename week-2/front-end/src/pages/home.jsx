import React from 'react' // Módulo principal do React.
import api from './../services/api' // Função com a qual faremos requisições HTTP para a API.
import { // Submódulos do Reactstrap.
    Collapse, 
    Navbar, 
    NavbarToggler, 
    NavbarBrand, 
    Nav, 
    NavItem, 
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
    ModalFooter, 
    Table, 
    UncontrolledDropdown, 
    DropdownToggle, 
    DropdownMenu, 
    DropdownItem
} from 'reactstrap'
import { logout } from './../services/auth' // Função que destrói o token do local storare.


export default class Home extends React.Component {

  
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
            usuarios: [],                    // Vetor contendo todos os nossos usuários. 
            navbarEstaAberto: false,         // Boolean que seta de o navbar está aberto.
            modalCadastrarEstaAberto: false, // Boolean que diz se o modal de cadastro está aberto.
            modalEditarEstaAberto: false,    // Boolean que diz se o modal de edição está aberto.
            erroEditar: '',                  // Mensagem de erro ao editar dados de um usuário.
            erroCadastrar: '',               // Mensagem de erro ao cadastrar determinado usuário.
            usuario: {                       // Objeto usuário contendo _id, nome, email e senha.
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
                console.log(resposta.data.erro)
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
    excluir = async (_id) => {
        
        const { usuarios } = this.state
      
        try {
            const resposta = await api.delete('/api/usuario/excluir/' + _id)
            if (resposta.data.erro) {
                console.log(resposta.data.mensagemErro)
            } else {
                console.log('Usuário deletado com sucesso!')
                this.setState({ usuarios: usuarios.filter(usuario => usuario._id !== _id) })
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

        const { usuarios, usuario } = this.state

        try {
            const resposta = await api.post('/api/usuario/cadastrar', usuario)
            if (resposta.data.erro) {
                this.setState({ erroCadastrar: resposta.data.mensagemErro })
                return console.log(resposta.data.mensagemErro)
            } else {
                console.log('Usuario cadastrado com sucesso!')
                usuario._id = resposta.data.usuario._id
                usuarios.push(usuario)
                this.setState({ usuarios })
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
    editar = async (event) => {
      event.preventDefault()

      const { usuario } = this.state

      try {
          const resposta = await api.put('/api/usuario/editar/' + usuario._id, usuario)
          if (resposta.data.erro) {
              this.setState({ erroEditar: resposta.data.mensagemErro })
              console.log(resposta.data.mensagemErro)
          } else {
              console.log('Usuario editado com sucesso!')
              this.toggleModalEditar(usuario)
          }
      } catch (erro) {
          console.log(erro)
      }
    }


    /**
     * 
     */
    toggleNavbar = () => {
        this.setState(prevState => ({ navbarEstaAberto: !prevState.navbarEstaAberto }))
    }


    /**
     * 
     */
    toggleModalCadastrar = () => {
        this.setState(prevState => ({ 
            modalCadastrarEstaAberto: !prevState.modalCadastrarEstaAberto 
        }))
    }


    /**
     * 
     */
    toggleModalEditar = (usuario) => {
      this.setState(prevState => ({ 
        modalEditarEstaAberto: !prevState.modalEditarEstaAberto,
        usuario
      }))
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
        this.setState({ usuario, erroEditar: '', erroCadastrar: '' })
    }


    /**
     * 
     */
    renderNavbar = () => {
        return (
            <Navbar color="success" dark expand="md">
                <NavbarBrand href="/home"> Signal Jr </NavbarBrand>
                <NavbarToggler onClick={this.toggleNavbar} />
                <Collapse isOpen={this.state.navbarEstaAberto} navbar>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <Button color='success' onClick={ this.toggleModalCadastrar }> Cadastrar Usuário </Button>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            Opções
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem target="_blank" href="https://github.com/arthurmfgtab/trainee-signal-2019.2">
                                GitHub
                            </DropdownItem>
                            <DropdownItem target="_blank" href="https://reactstrap.github.io/components/">
                                Componentes Reactstrap 
                            </DropdownItem>
                            <DropdownItem href='/' onClick={ logout }>
                                Sair
                            </DropdownItem>
                        </DropdownMenu>
                  </UncontrolledDropdown>
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
            <Modal isOpen={this.state.modalCadastrarEstaAberto} toggle={this.toggleModalCadastrar}>
                <ModalHeader toggle={this.toggleModalCadastrar}> Cadastrar Usuário </ModalHeader>
                <ModalBody>
                    
                    <Form onSubmit={ this.cada }>

                        { (this.state.erroCadastrar) && <Alert color="danger"> { this.state.erroCadastrar } </Alert> }
                        
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
                            <Button color="primary"> Cadastrar </Button>{' '}
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
    renderModalEditar = () => {
      
      const { usuario } = this.state

      return (
          <Modal isOpen={this.state.modalEditarEstaAberto} toggle={() => this.toggleModalEditar(usuario)}>
              <ModalHeader toggle={this.toggleModalCadastrar}> Editar Usuário </ModalHeader>
              <ModalBody>
                  
                  <Form onSubmit={ this.editar }>

                      { (this.state.erroEditar) && <Alert color="danger"> { this.state.erroEditar } </Alert> }
                      
                      <FormGroup row>
                          <Label sm={2}> <strong> Nome </strong> </Label>
                          <Col sm={10}>
                              <Input type="text" onChange={ this.atualizarCampo } value={ usuario.nome } name="nome" />
                          </Col>
                      </FormGroup>
                      
                      <FormGroup row>
                          <Label sm={2}> <strong> Email </strong> </Label>
                          <Col sm={10}>
                              <Input type="email" onChange={ this.atualizarCampo } value={ (usuario.email) && usuario.email } name="email" />
                          </Col>
                      </FormGroup>

                      <ModalFooter>
                          <Button type='submit' color="primary"> Cadastrar </Button>{' '}
                          <Button color="secondary" onClick={() => this.toggleModalEditar(usuario)}> Cancelar </Button>
                      </ModalFooter>
                  
                  </Form>

              </ModalBody>
          </Modal>
      )
    }


    /**
     * 
     */
    renderTabelaUsuarios = () => {
        return (
            <div style={{ marginRight: 100, marginLeft: 100, marginTop: 100, backgroundColor: '#EFFFEF' }}>
                <Table hover striped bordered responsive>
                    <thead>
                      <tr>
                        <th> ID </th>
                        <th> Nome </th>
                        <th> Email </th>
                        <th> Opções </th>
                      </tr>
                    </thead>
                    <tbody>
                        { this.renderTabelaUsuarioItem() }
                    </tbody>
              </Table>
            </div>
        )
    }


    /**
     * 
     */
    renderTabelaUsuarioItem = () => {

        const { usuarios } = this.state

        return usuarios.map(usuario => {
            return (
                <tr key={ usuario._id }>
                    <td> { usuario._id } </td>
                    <td> { usuario.nome } </td>
                    <td> { usuario.email } </td>
                    <td>
                        <button 
                            className='btn btn-outline-success' 
                            style={{ marginRight: 10 }}
                            onClick={ (event) => this.toggleModalEditar(usuario) }> 
                            Editar 
                        </button>
                        <button 
                            className='btn btn-outline-danger' 
                            onClick={ (event) => { if (window.confirm('Certeza?')) this.excluir(usuario._id) } }> 
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
    render() {
        return (
            <div>
                { this.renderNavbar() }
                { this.renderTabelaUsuarios() }
                { this.renderModalCadastrar() }
                { this.renderModalEditar() }
            </div>
        )
    }
}