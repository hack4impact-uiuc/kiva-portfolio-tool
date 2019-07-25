import React, { Component } from 'react'
import { Button, Modal, ModalBody, ModalFooter, Table, Input, Form } from 'reactstrap'
import Dropzone from 'react-dropzone'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateDocumentClasses, beginLoading, endLoading } from '../redux/modules/user'

import WithAuth from './auth/WithAuth'
import DocumentClass from './DocumentClass'
import NavBar from './NavBar'

import { getAllDocumentClasses, createDocumentClass } from '../utils/ApiWrapper'

import add from '../media/add.png'

import '../styles/variables.scss'
import '../styles/documentclasspage.scss'

const mapStateToProps = state => ({
  documentClasses: state.user.documentClasses,
  language: state.user.language
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocumentClasses,
      beginLoading,
      endLoading
    },
    dispatch
  )
}

/*
A page accessible by admins and PMs with an overview of all Document Classes
Functionality: Allows creation of new Document Classes and viewing/editing/deletion of existing ones through the DocumentClass component
*/
export class DocumentClassPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addModal: false, // modal that appears after clicking 'Add New Document Class'
      name: '',
      description: '',
      files: []
    }
    this.toggle = this.toggle.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  /**
   * Gets all document classes once component is ready
   */
  async componentDidMount() {
    this.props.beginLoading()
    const document_classes = await getAllDocumentClasses()
    if (document_classes) {
      this.props.updateDocumentClasses(document_classes)
    } else {
      this.props.updateDocumentClasses([])
    }
    this.props.endLoading()
  }

  /**
   * Opens/Closes the addModal
   */
  toggle() {
    this.setState({ addModal: !this.state.addModal })
  }

  /**
   * updates name in state
   */
  updateName = event => {
    this.setState({ name: event.target.value })
  }

  /**
   * updates description in state
   */
  updateDescription = event => {
    this.setState({ description: event.target.value })
  }

  /**
   * updates document class and closes add modal
   */
  async handleSubmit() {
    this.props.beginLoading()
    await createDocumentClass(
      this.state.name,
      this.state.description,
      this.state.files[0],
      this.state.files[0].name
    )
    const document_classes = await getAllDocumentClasses()
    if (document_classes) {
      this.props.updateDocumentClasses(document_classes)
    } else {
      this.props.updateDocumentClasses([])
    }
    this.props.endLoading()
    this.toggle()
  }

  onDrop(files) {
    this.setState({
      files
    })
  }

  languages = {
    English: {
      name: 'Name:',
      description: 'Description:',
      fileUploaded: 'File uploaded: ',
      click: 'Click to upload',
      return: 'Return',
      close: 'Close',
      create: 'Create new document class',
      edit: 'Edit document classes',
      add: 'Add new document class',
      docClassName: 'Document class name'
    },
    Spanish: {
      name: 'Nombre:',
      description: 'Descripción:',
      fileUploaded: 'Archivo cargado: ',
      click: 'Haga clic para cargar el archivo',
      return: 'Regresar',
      close: 'Cerrar',
      create: 'Crear una nueva clase de documento',
      edit: 'Editar classe de documento existente',
      add: 'Agregar una nueva clase de documento',
      docClassName: 'Nombre de clase de documento'
    },
    French: {
      name: 'Nom:',
      description: 'Description:',
      fileUploaded: 'Fichier téléchargé: ',
      click: 'Click to upload (French)',
      return: 'Retour',
      close: 'Fermer',
      create: 'Créer nouveau type de document',
      edit: 'Modifier type de document',
      add: 'Ajouter nouveau type de document',
      docClassName: 'Nom du type de document'
    },
    Portuguese: {
      name: 'Nome',
      description: 'Descrição:',
      fileUploaded: 'Arquivo carregado: ',
      click: 'Clique para carregar',
      return: 'Retornar',
      close: 'Fechar',
      create: 'Criar a nova classe de documento',
      edit: 'Editar classes de documento',
      add: 'Adicionar nova classe de documento',
      docClassName: 'Nome de classe de documento'
    }
  }

  render() {
    let text = this.languages[this.props.language]
    if (!text) {
      text = this.languages['English']
    }

    return (
      <div className="background-rectangles maxheight">
        <NavBar />
        <Modal isOpen={this.state.addModal} toggle={this.toggle}>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              <span>{text.name}</span>
              <Input type="textarea" className="textarea-input" onChange={this.updateName} />
              <br />
              <span>{text.description}</span>
              <Input
                type="textarea"
                className="textarea-input textarea-height"
                onChange={this.updateDescription}
              />
              <br />
              <div className="dropPage">
                <section className="droppedBox">
                  <div className="dropZone">
                    <Dropzone onDrop={this.onDrop.bind(this)}>
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {this.state.files.length > 0 ? (
                              <p>{text.fileUploaded + this.state.files[0].name}</p>
                            ) : (
                              <Button>{text.click}</Button>
                            )}
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                </section>
                <hr />
              </div>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button className="invalidSearchButton" onClick={this.toggle}>
              {text.close}
            </Button>
            <Button
              type="submit"
              disabled={this.state.files.length === 0}
              color="success"
              onClick={this.handleSubmit}
            >
              {text.create}
            </Button>
          </ModalFooter>
        </Modal>
        <div className="edit-banner">
          <h1 className="h1">{text.edit}</h1>
          <Button
            className="add-doc-text"
            id="add-new-class"
            color="transparent"
            onClick={this.toggle}
          >
            <img className="addImg" src={add} alt="Add icon" />
            <span className="add-doc-text">{text.add}</span>
          </Button>
        </div>

        <div className="doc-table">
          <Table>
            <tbody>
              <tr id="doc-table-top-row">
                <th className="theader-centered">{text.docClassName}</th>
                <th />
              </tr>
              {this.props.documentClasses
                ? this.props.documentClasses.map(documentClass => (
                    <DocumentClass key={documentClass.name} documentClass={documentClass} />
                  ))
                : null}
            </tbody>
          </Table>
        </div>

        <div className="returnBtnContainer text-centered padding-bottom-sm">
          <Button className="returnButton" onClick={this.props.history.goBack}>
            {text.return}
          </Button>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithAuth(DocumentClassPage))
