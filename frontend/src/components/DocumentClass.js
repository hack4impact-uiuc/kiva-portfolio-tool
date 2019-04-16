import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentPreview from './DocumentPreview'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import Upload from './Upload'
import { downloadDocument } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { updateDocumentClasses } from '../redux/modules/user'

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
      document: this.props.document,
      name: '',
      description: '',
      modal: false
    }

    this.handleDownloadClick = this.handleDownloadClick.bind(this)
    this.handleUploadClick = this.handleUploadClick.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal })
  }

  updateName = event => {
    this.setState({ name: event.target.value })
  }

  updateDescription = event => {
    this.setState({ description: event.target.value })
  }

  handleDownloadClick() {
    // Retrieve file from backend
    downloadDocument(document.fileID)
  }

  handleUploadClick() {
    // Upload click handling
    this.setState({ modal: !this.state.modal })
  }

  render() {
    return (
      <>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          {
            //<Upload docID={this.props.documentClass._id} />
          }
          <ModalBody>
            <form>
              <span> Name: </span>
              <input onChange={this.updateName} />
              <br />
              <span> Description: </span>
              <textarea
                name="paragraph_text"
                cols="50"
                rows="10"
                onChange={this.updateDescription}
              />
              <br />
              <Button type="submit">Upload</Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              className="invalidSearchButton"
              onClick={e => {
                this.toggle()
              }}
            >
              Return
            </Button>
          </ModalFooter>
        </Modal>
        <tr>
          {this.props.documentClass.name ? (
            <td data-testid="docClass">{this.props.documentClass.name}</td>
          ) : null}
          <td data-testid="interaction" className="interaction">
            <Button color="primary">UPLOAD</Button>
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
