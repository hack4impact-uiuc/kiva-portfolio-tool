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
import { beginLoading, endLoading } from '../redux/modules/auth'
import Dropzone from 'react-dropzone'

import '../styles/documentclasspage.css'

import edit from '../media/greyEdit.png'
import remove from '../media/remove.png'

const mapStateToProps = state => ({})

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

  editToggle() {
    this.setState({ editModal: !this.state.editModal })
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
    this.props.beginLoading()
    if (this.state.files.length == 0) {
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
            <Button onClick={this.handleSubmit}>Update Document Class</Button>
          </ModalFooter>
        </Modal>
        <tr className="hoverable">
          {this.props.documentClass.name ? (
            <td data-testid="docClass">{this.props.documentClass.name}</td>
          ) : null}
          <td data-testid="interaction" className="interaction">
            <DocumentClassPreview documentClass={this.props.documentClass} />
            <Button color="transparent" onClick={this.editToggle}>
              <img className="buttonimg" src={edit} />
            </Button>
            <Button color="transparent" onClick={this.deleteToggle}>
              <img className="buttonimg" src={remove} />
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
