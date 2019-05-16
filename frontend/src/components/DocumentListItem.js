import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DocumentPreview from './DocumentPreview'
import { Button, Modal, ModalHeader, ModalFooter } from 'reactstrap'
import {
  downloadDocument,
  uploadDocument,
  getDocumentsByUser,
  deleteDocument
} from '../utils/ApiWrapper'
import { updateDocuments } from '../redux/modules/user'
import { beginLoading, endLoading } from '../redux/modules/auth'

import uploadImg from '../media/greyUpload.png'
import downloadImg from '../media/downloadGrey.png'
import visit from '../media/visit.png'
import remove from '../media/remove.png'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      beginLoading,
      endLoading,
      updateDocuments
    },
    dispatch
  )
}

/**
 * Shows each individual document in the Document List Component.
 * You can select this component to view, delete, or upload documents
 */
export class DocumentListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      files: [],
      modal: false
    }

    this.handleDownloadClick = this.handleDownloadClick.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  /**
   * Called upon uploading a file to a requirement
   */
  async onDrop(files) {
    this.setState({
      files
    })
    this.props.beginLoading()
    await uploadDocument(this.state.files[0], this.state.files[0].name, this.props.document._id)
    const documents = await getDocumentsByUser(this.props.document.userID)
    if (documents) {
      this.props.updateDocuments(documents)
    } else {
      this.props.updateDocuments([])
    }
    this.props.endLoading()
  }

  handleDownloadClick() {
    // Retrieve file from backend
    downloadDocument(document.fileID)
  }

  /**
   * Called when a user attempts to delete a document
   * The user will be prompted to confirm before the document is actually deleted
   */
  async handleDelete() {
    this.toggle()
    this.props.beginLoading()
    await deleteDocument(this.props.document._id)
    const documents = await getDocumentsByUser(this.props.document.userID)
    if (documents) {
      this.props.updateDocuments(documents)
    } else {
      this.props.updateDocuments([])
    }
    this.props.endLoading()
  }

  toggle() {
    this.setState({ modal: !this.state.modal })
  }

  render() {
    const { isPM } = this.props

    return (
      <>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader>Are you sure you want to delete this document?</ModalHeader>
          <ModalFooter>
            <Button onClick={this.toggle}>No</Button>
            <Button onClick={this.handleDelete}>Yes</Button>
          </ModalFooter>
        </Modal>
        <tr className="hoverable">
          <td data-testid="docClass">{this.props.document.docClassName}</td>
          <td data-testid="fileName">
            {this.props.document.fileName ? this.props.document.fileName : 'N/A'}
          </td>
          <td className="interaction">
            <DocumentPreview document={this.props.document} />
          </td>
          <td data-testid="interaction" className="interaction">
            {this.props.fileName ? (
              <Button color="transparent">
                <Link
                  to={{
                    pathname:
                      '/view/' + this.props.document.fileName + '/' + this.props.document._id,
                    state: { link: this.props.document.link }
                  }}
                >
                  <img className="buttonimg" src={visit} alt="Visit icon" />
                </Link>
              </Button>
            ) : null}
          </td>
          <td data-testid="interaction" className="interaction padding-right-sm">
            {this.state.fileName && (
              <Button color="transparent" onClick={this.handleDownloadClick}>
                <img className="buttonimg" src={downloadImg} alt="Download icon" />
              </Button>
            )}
            {isPM ? (
              <button className="buttonValue" onClick={this.toggle}>
                <img src={remove} width="25" alt="Remove icon" />
              </button>
            ) : (
              <Dropzone onDrop={this.onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <img className="buttonimg" src={uploadImg} alt="Upload icon" />
                    </div>
                  </section>
                )}
              </Dropzone>
            )}
          </td>
        </tr>
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DocumentListItem))
