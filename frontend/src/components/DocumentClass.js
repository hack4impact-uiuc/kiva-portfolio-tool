import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentClassPreview from './DocumentClassPreview'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import {
  deleteDocumentClass,
  updateDocumentClass,
  getAllDocumentClasses
} from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { updateDocumentClasses } from '../redux/modules/user'
import Dropzone from 'react-dropzone'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocumentClasses
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
class DocumentClass extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: this.props.documentClass.name,
      description: this.props.documentClass.description,
      editModal: false, // modal that appears when editing a Document class
      uploadModal: false, // modal that appears indicating that a file has been uploading
      deleteModal: false, // modal that appears making sure the user actually wants to delete the document class
      files: []
    }

    this.editToggle = this.editToggle.bind(this)
    this.uploadToggle = this.uploadToggle.bind(this)
    this.deleteToggle = this.deleteToggle.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSubmitNoFile = this.handleSubmitNoFile.bind(this)
  }

  editToggle() {
    this.setState({ editModal: !this.state.editModal })
  }

  uploadToggle() {
    this.setState({ uploadModal: !this.state.uploadModal })
  }

  deleteToggle() {
    this.setState({ deleteModal: !this.state.deleteModal })
  }

  updateName = event => {
    this.setState({ name: event.target.value })
  }

  updateDescription = event => {
    this.setState({ description: event.target.value })
  }

  async handleSubmit() {
    await updateDocumentClass(
      this.props.documentClass._id,
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
    this.uploadToggle()
  }

  // for if a Document Class is being submitted without an example file
  // may be removed later
  async handleSubmitNoFile() {
    await updateDocumentClass(
      this.props.documentClass._id,
      this.state.name,
      this.state.description,
      null,
      null
    )
    const document_classes = await getAllDocumentClasses()
    if (document_classes) {
      this.props.updateDocumentClasses(document_classes)
    } else {
      this.props.updateDocumentClasses([])
    }
    this.uploadToggle()
  }

  onDrop(files) {
    this.setState({
      files
    })
  }

  async handleDelete() {
    await deleteDocumentClass(this.props.documentClass._id)
    const document_classes = await getAllDocumentClasses()
    if (document_classes) {
      this.props.updateDocumentClasses(document_classes)
    } else {
      this.props.updateDocumentClasses([])
    }
    this.deleteToggle()
  }

  render() {
    return (
      <>
        <Modal isOpen={this.state.editModal} toggle={this.editToggle}>
          <ModalBody>
            <form>
              <span> Name: </span>
              <input onChange={this.updateName} value={this.state.name} />
              <br />
              <span> Description: </span>
              <textarea
                name="paragraph_text"
                cols="50"
                rows="10"
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
                            <p>Drag a file here, or click to select a file</p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                  <aside>
                    <h4>File Dropped:</h4>
                    <ul className="droppedFilesBackground">
                      {this.state.files.map(f => (
                        <li className="droppedBox" key={f.name}>
                          {f.name} - {f.size} bytes
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="right"
                      onClick={
                        this.state.files.length == 0 ? this.handleSubmitNoFile : this.handleSubmit
                      }
                    >
                      Update Document Class
                    </Button>
                    <Modal isOpen={this.state.uploadModal} toggle={this.uploadToggle}>
                      <ModalBody>File uploaded - your submission is being processed.</ModalBody>
                      <ModalFooter>
                        <Button className="invalidSearchButton" onClick={this.uploadToggle}>
                          Return
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </aside>
                </section>
                <hr />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button className="invalidSearchButton" onClick={this.editToggle}>
              Return
            </Button>
          </ModalFooter>
        </Modal>
        <tr>
          {this.props.documentClass.name ? (
            <td data-testid="docClass">{this.props.documentClass.name}</td>
          ) : null}
          <td data-testid="interaction" className="interaction">
            <DocumentClassPreview documentClass={this.props.documentClass} />
            <Button color="primary" onClick={this.editToggle}>
              Edit
            </Button>
            <Button color="primary" onClick={this.deleteToggle}>
              Delete
            </Button>
            <Modal isOpen={this.state.deleteModal} toggle={this.deleteToggle}>
              <ModalBody>
                <p>
                  Are you sure you want to delete {this.props.documentClass.name}? This will delete
                  every document of this type for all users.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button className="invalidSearchButton" onClick={this.handleDelete}>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentClass)
