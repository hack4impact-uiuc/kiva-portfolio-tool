import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentClassPreview from './DocumentClassPreview'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import { deleteDocumentClass } from '../utils/ApiWrapper'
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

class DocumentClass extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      description: '',
      modal: false,
      secondModal: false,
      deleteModal: false,
      files: []
    }

    this.toggle = this.toggle.bind(this)
    this.secondToggle = this.secondToggle.bind(this)
    this.deleteToggle = this.deleteToggle.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  toggle() {
    this.setState({ modal: !this.state.modal })
  }

  secondToggle() {
    this.setState({ secondModal: !this.state.secondModal })
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
    /*
    updateDocumentClass(
      this.state.name,
      this.state.description,
      this.state.files[0],
      this.state.files[0].name
    )
    this.secondToggle()
    */
  }

  onDrop(files) {
    this.setState({
      files
    })
  }

  handleDelete() {
    deleteDocumentClass(this.props.documentClass._id)
    this.deleteToggle()
  }

  render() {
    return (
      <>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalBody>
            <form>
              <span> Name: </span>
              <input onChange={this.updateName} value={this.props.documentClass.name} />
              <br />
              <span> Description: </span>
              <textarea
                name="paragraph_text"
                cols="50"
                rows="10"
                onChange={this.updateDescription}
                value={this.props.documentClass.description}
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
                            <p>Drag some files here, or click to select files</p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                  <aside>
                    <h4>Files Dropped</h4>
                    <ul className="droppedFilesBackground">
                      {this.state.files.map(f => (
                        <li className="droppedBox" key={f.name}>
                          {f.name} - {f.size} bytes
                        </li>
                      ))}
                    </ul>
                    <Button
                      disabled={this.state.files.length === 0}
                      className="right"
                      onClick={this.handleSubmit}
                    >
                      Create Document Class
                    </Button>
                    <Modal isOpen={this.state.secondModal} toggle={this.secondToggle}>
                      <ModalBody>File uploaded - your submission is being processed.</ModalBody>
                      <ModalFooter>
                        <Button
                          className="invalidSearchButton"
                          onClick={e => {
                            this.secondToggle()
                          }}
                        >
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
            <Button className="invalidSearchButton" onClick={this.toggle}>
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
            <Button color="primary" onClick={this.toggle}>
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
