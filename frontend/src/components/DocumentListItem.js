import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Iframe from 'react-iframe'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateDocuments, beginLoading, endLoading } from '../redux/modules/user'

import DocumentPreview from './DocumentPreview'

import {
  downloadDocument,
  uploadDocument,
  getDocumentsByUser,
  deleteDocument
} from '../utils/ApiWrapper'

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
      deleteModal: false,
      docClassModal: false
    }

    this.handleDownloadClick = this.handleDownloadClick.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.deleteToggle = this.deleteToggle.bind(this)
    this.docClassToggle = this.docClassToggle.bind(this)
  }

  /**
   * Called upon uploading a file to a requirement
   */
  async onDrop(files) {
    // The MIME types of common filetypes
    const docTypes = [
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint',
      'application/pdf',
      'image/jpeg',
      'image/png',
      'text/plain'
    ]

    if (!docTypes.includes(files[0].type)) {
      window.alert('Document type not acceptable')
    } else {
      this.setState({
        files
      })
      this.props.beginLoading()
      await uploadDocument(
        this.props.document.userID,
        this.state.files[0],
        this.state.files[0].name,
        this.props.document._id
      )
      const documents = await getDocumentsByUser(this.props.document.userID)
      if (documents) {
        this.props.updateDocuments(documents)
      } else {
        this.props.updateDocuments([])
      }
      this.props.endLoading()
    }
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
    this.deleteToggle()
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

  deleteToggle() {
    this.setState({ deleteModal: !this.state.deleteModal })
  }

  docClassToggle() {
    this.setState({ docClassModal: !this.state.docClassModal })
  }

  render() {
    const { isPM } = this.props
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
        <Modal isOpen={this.state.deleteModal} toggle={this.deleteToggle}>
          <ModalHeader>Are you sure you want to delete this document?</ModalHeader>
          <ModalFooter>
            <Button onClick={this.deleteToggle}>No</Button>
            <Button onClick={this.handleDelete}>Yes</Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.docClassModal}
          toggle={this.docClassToggle}
          external={externalCloseBtn}
        >
          <ModalHeader>{this.props.document.docClass.name}</ModalHeader>
          <ModalBody style={customStyles}>
            <p>{this.props.document.docClass.description}</p>
            <Iframe
              url={this.props.document.docClass.example}
              width="450px"
              height="500px"
              allowFullScreen
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.docClassToggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        <tr className="hoverable">
          <td data-testid="docClass">
            <Button className="add-doc-text" color="transparent" onClick={this.docClassToggle}>
              <span className="add-doc-text">{this.props.document.docClass.name}</span>
            </Button>
          </td>
          <td data-testid="fileName">
            {this.props.document.fileName ? this.props.document.fileName : 'N/A'}
          </td>
          <td className="interaction">
            {
              // little bit of a hack to coerce all images into one row inside one td element instead of having blank td elements taking up space
            }
            <Row className="button-tablerow">
              <Col sm="4" md="4">
                <DocumentPreview document={this.props.document} />
              </Col>
              <Col sm="4" md="4">
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
              </Col>
              <Col sm="4" md="4">
                {isPM ? (
                  <Button color="transparent" onClick={this.deleteToggle}>
                    <img className="buttonimg" src={remove} width="23" alt="Remove icon" />
                  </Button>
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
              </Col>
            </Row>
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
