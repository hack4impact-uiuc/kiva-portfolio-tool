import React, { Component } from 'react'
import {
  getAllDocumentClasses,
  createDocumentClass,
  deleteDocumentClass,
  updateDocumentClass
} from '../utils/ApiWrapper'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Input } from 'reactstrap'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateDocumentClasses, beginLoading, endLoading } from '../redux/modules/user'
import Dropzone from 'react-dropzone'
import WithAuth from './auth/WithAuth'
import NavBar from './NavBar'

import '../styles/variables.css'
import '../styles/index.css'
import '../styles/documentclasspage.css'

import add from '../media/add.png'
import edit from '../media/greyEdit.png'
import remove from '../media/remove.png'

import Iframe from 'react-iframe'

import 'box-ui-elements/dist/preview.css'
import '../styles/index.css'

import preview from '../media/preview.png'

const mapStateToProps = state => ({
  documentClasses: state.user.documentClasses
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
    const document_classes = await getAllDocumentClasses()
    if (document_classes) {
      this.props.updateDocumentClasses(document_classes)
    } else {
      this.props.updateDocumentClasses([])
    }
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

  render() {
    return (
      <div className="background-rectangles maxheight">
        <NavBar />
        <Modal isOpen={this.state.addModal} toggle={this.toggle}>
          <ModalBody>
            <form>
              <span> Name: </span>
              <Input type="textarea" className="textarea-input" onChange={this.updateName} />
              <br />
              <span> Description: </span>
              <Input
                type="textarea"
                className="textarea-input"
                style={{ height: '200px' }}
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
                              <p>File uploaded: {this.state.files[0].name}</p>
                            ) : (
                              <p>Click to Upload</p>
                            )}
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                </section>
                <hr />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button className="invalidSearchButton" onClick={this.toggle}>
              Close
            </Button>
            <Button
              disabled={this.state.files.length === 0}
              color="success"
              onClick={this.handleSubmit}
            >
              Create Document Class
            </Button>
          </ModalFooter>
        </Modal>
        <div className="edit-banner">
          <h1 className="h1">Edit Document Classes</h1>
          <Button
            className="add-doc-text"
            id="add-new-class"
            color="transparent"
            onClick={this.toggle}
          >
            <img className="addImg" src={add} alt="Add icon" />
            <span className="add-doc-text">Add New Document Class</span>
          </Button>
        </div>

        <div className="doc-table">
          <Table>
            <tbody>
              <tr id="doc-table-top-row">
                <th className="theader-centered">Document Class Name</th>
                <th />
              </tr>
              {this.props.documentClasses
                ? this.props.documentClasses.map(documentClass => (
                    <DocumentClass documentClass={documentClass} />
                  ))
                : null}
            </tbody>
          </Table>
        </div>

        <div className="returnBtnContainer text-centered padding-bottom-sm">
          <Button className="returnButton" onClick={this.props.history.goBack}>
            Return
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

  render() {
    return (
      <>
        <Modal isOpen={this.state.editModal} toggle={this.editToggle}>
          <ModalBody>
            <form>
              <span> Name: </span>
              <Input type="textarea" className="textarea-input" onChange={this.updateName} />
              <br />
              <span> Description: </span>
              <Input
                type="textarea"
                className="textarea-input"
                style={{ height: '200px' }}
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
                              <p>File uploaded: {this.state.files[0].name}</p>
                            ) : (
                              <p>Click to Upload</p>
                            )}
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                </section>
                <hr />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button className="invalidSearchButton" onClick={this.editToggle}>
              Return
            </Button>
            <Button onClick={this.handleSubmit} color="success">
              Update Document Class
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
                <p>
                  Are you sure you want to delete {this.props.documentClass.name}? This will delete
                  every document of this type for all users.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button className="invalidSearchButton" color="primary" onClick={this.handleDelete}>
                  Delete and return
                </Button>
                <Button className="invalidSearchButton" onClick={this.deleteToggle}>
                  Return
                </Button>
              </ModalFooter>
            </Modal>
          </td>
        </tr>
      </>
    )
  }
}

/*
Used to view information about a Document CLass when pressing 'View'
Allows users to see the name & description of a Document Class
ALso has a box Preview
*/
export class DocumentClassPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false // whether or not this component is showing
    }

    this.toggle = this.toggle.bind(this)
  }

  /**
   * Opens modal to show document class
   */
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }))
  }

  render() {
    const customStyles = {
      height: '500px',
      width: '500px',
      overflow: 'scroll'
    }
    const externalCloseBtn = (
      <button
        className="close"
        style={{ position: 'absolute', top: '15px', right: '15px' }}
        onClick={this.toggle}
      >
        &times;
      </button>
    )

    return (
      <>
        <Button color="transparent" onClick={this.toggle}>
          <img className="buttonimg" src={preview} alt="preview icon" />
        </Button>

        <Modal isOpen={this.state.modal} toggle={this.toggle} external={externalCloseBtn}>
          <ModalHeader>{this.props.documentClass.name}</ModalHeader>
          <ModalBody style={customStyles}>
            <p>{this.props.documentClass.description}</p>
            <Iframe
              url={this.props.documentClass.example}
              width="450px"
              height="500px"
              allowFullScreen
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}
