import React from 'react'
import DocumentClass from './DocumentClass'
import { getAllDocumentClasses, createDocumentClass } from '../utils/ApiWrapper'
import { Button, Modal, ModalBody, ModalFooter, Table, Input } from 'reactstrap'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateDocumentClasses } from '../redux/modules/user'
import { beginLoading, endLoading } from '../redux/modules/auth'
import Dropzone from 'react-dropzone'
import WithAuth from './WithAuth'
import NavBar from './NavBar'

import '../styles/variables.css'
import '../styles/index.css'
import '../styles/documentclasspage.css'

import add from '../media/add.png'

const mapStateToProps = state => ({
  documentClasses: state.user.documentClasses,
  loading: state.auth.loading
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
export class DocumentClassPage extends React.Component {
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
            <img className="addImg" src={add} />
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
