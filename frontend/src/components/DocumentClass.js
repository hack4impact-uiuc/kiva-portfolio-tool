import React, { Component } from 'react'
import { Button, Modal, ModalBody, ModalFooter, Input, Form } from 'reactstrap'
import Dropzone from 'react-dropzone'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateDocumentClasses, beginLoading, endLoading } from '../redux/modules/user'

import DocumentClassPreview from './DocumentClassPreview'

import {
  deleteDocumentClass,
  updateDocumentClass,
  getAllDocumentClasses
} from '../utils/ApiWrapper'

import edit from '../media/greyEdit.png'
import remove from '../media/remove.png'

import '../styles/documentclasspage.scss'

const mapStateToProps = state => ({
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
Corresponds to each individual Document Class in the Admin/PM overview page
Name is represented normally
Buttons exist to view, edit, and delete
View shows the description and a Box preview
*/
export class DocumentClass extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: this.props.documentClass.name,
      description: this.props.documentClass.description,
      editModal: false, // modal that appears when editing a Document class
      deleteModal: false, // modal that appears making sure the user actually wants to delete the document class
      files: []
    }

    this.editToggle = this.editToggle.bind(this)
    this.deleteToggle = this.deleteToggle.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  /**
   * Opens/closes edit modal
   */
  editToggle() {
    this.setState({ editModal: !this.state.editModal })
  }

  /**
   * Opens/closes delete modal
   */
  deleteToggle() {
    this.setState({ deleteModal: !this.state.deleteModal })
  }

  /**
   * updates name in edit modal
   */
  updateName = event => {
    this.setState({ name: event.target.value })
  }

  /**
   * updates description in edit modal
   */
  updateDescription = event => {
    this.setState({ description: event.target.value })
  }

  /**
   * updates document class information from information in inputs
   * called in edit modal
   */
  async handleSubmit() {
    this.props.beginLoading()
    if (this.state.files.length === 0) {
      await updateDocumentClass(
        this.props.documentClass._id,
        this.state.name,
        this.state.description,
        null,
        null
      )
    } else {
      await updateDocumentClass(
        this.props.documentClass._id,
        this.state.name,
        this.state.description,
        this.state.files[0],
        this.state.files[0].name
      )
    }
    const document_classes = await getAllDocumentClasses()
    if (document_classes) {
      this.props.updateDocumentClasses(document_classes)
    } else {
      this.props.updateDocumentClasses([])
    }
    this.props.endLoading()
    this.editToggle()
  }

  onDrop(files) {
    this.setState({
      files
    })
  }

  /**
   * deletes a document class
   * called in delete modal
   */
  async handleDelete() {
    this.props.beginLoading()
    await deleteDocumentClass(this.props.documentClass._id)
    const document_classes = await getAllDocumentClasses()
    if (document_classes) {
      this.props.updateDocumentClasses(document_classes)
    } else {
      this.props.updateDocumentClasses([])
    }
    this.props.endLoading()
    this.deleteToggle()
  }

  languages = {
    English: {
      name: 'Name:',
      description: 'Description:',
      fileUploaded: 'File uploaded: ',
      click: 'Click to upload',
      return: 'Return',
      update: 'Update document class',
      confirm1: 'Are you sure you want to delete ',
      confirm2: '? This will delete every document of this type for all users.',
      deleteReturn: 'Delete and return'
    },
    Spanish: {
      name: 'Nombre:',
      description: 'Descripción:',
      fileUploaded: 'Archivo cargado: ',
      click: 'Haga clic para cargar el archivo',
      return: 'Regresar',
      update: 'Actualizar la clase de documento',
      confirm1: 'Estás seguro de borrar ',
      confirm2: '? Esto borrará todos los documentos de esta clase para todos los usarios.',
      deleteReturn: 'Borrar y regresar'
    },
    French: {
      name: 'Nom:',
      description: 'Description:',
      fileUploaded: 'Fichier téléchargé: ',
      click: 'Cliquez pour téléharger',
      return: 'Retour',
      update: 'Actualiser type de document',
      confirm1: 'Êtes-vous sur de vouloir supprimer ',
      confirm2: ' ? Cela supprimera tous les documents de ce type pour tous les utilisateurs.',
      deleteReturn: 'Supprimer et retourner'
    },
    Portuguese: {
      name: 'Nome:',
      description: 'Descrição:',
      fileUploaded: 'Arquivo carregado: ',
      click: 'Clique para carregar',
      return: 'Retornar',
      update: 'Atualizar a classe de documento',
      confirm1: 'Tem certeza que quer apagar (deletar) ',
      confirm2: ' ? Isto irá apagar todos os documentos deste tipo para todos os usuários.',
      deleteReturn: 'Apagar e retornar'
    }
  }

  render() {
    let text = this.languages[this.props.language]
    if (!text) {
      text = this.languages['English']
    }

    return (
      <>
        <Modal isOpen={this.state.editModal} toggle={this.editToggle}>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              <span>{text.name}</span>
              <Input
                type="textarea"
                className="textarea-input"
                onChange={this.updateName}
                value={this.state.name}
              />
              <br />
              <span>{text.description}</span>
              <Input
                type="textarea"
                className="textarea-input textarea-height"
                onChange={this.updateDescription}
                value={this.state.description}
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
            <Button className="invalidSearchButton" onClick={this.editToggle}>
              {text.return}
            </Button>
            <Button type="submit" onClick={this.handleSubmit} color="success">
              {text.update}
            </Button>
          </ModalFooter>
        </Modal>
        <tr className="hoverable">
          {this.props.documentClass.name ? (
            <td data-testid="docClass">{this.props.documentClass.name}</td>
          ) : null}
          <td data-testid="interaction" className="interaction">
            <DocumentClassPreview documentClass={this.props.documentClass} />
            <Button color="transparent" onClick={this.editToggle}>
              <img className="buttonimg" src={edit} alt="Edit icon" />
            </Button>
            <Button color="transparent" onClick={this.deleteToggle}>
              <img className="buttonimg" src={remove} alt="Remove icon" />
            </Button>
            <Modal isOpen={this.state.deleteModal} toggle={this.deleteToggle}>
              <ModalBody>
                <p>{text.confirm1 + this.props.documentClass.name + text.confirm1}</p>
              </ModalBody>
              <ModalFooter>
                <Button className="invalidSearchButton" color="primary" onClick={this.handleDelete}>
                  {text.deleteReturn}
                </Button>
                <Button className="invalidSearchButton" onClick={this.deleteToggle}>
                  {text.return}
                </Button>
              </ModalFooter>
            </Modal>
          </td>
        </tr>
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentClass)
