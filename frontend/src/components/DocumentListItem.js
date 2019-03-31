import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentPreview from './DocumentPreview'
import { Button, Modal, ModalFooter } from 'reactstrap'
import Upload from './Upload'
import { downloadDocument } from '../utils/ApiWrapper'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class DocumentListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      document: this.props.document,
      modal: false
    }

    this.handleDownloadClick = this.handleDownloadClick.bind(this)
    this.handleUploadClick = this.handleUploadClick.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal })
  }

  handleDownloadClick() {
    // Download click handling
    downloadDocument(document.fileID)
  }

  handleUploadClick() {
    // Upload click handling
    this.setState({ modal: !this.state.modal })
  }

  render() {
    const { isPM } = this.props
    return (
      <>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <Upload />
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
          <td>{this.state.document.docClass}</td>
          <td>{this.state.document.fileName ? this.state.document.fileName : 'N/A'}</td>
          <td class="interaction">
            {this.state.fileName && (
              <Button color="primary" onClick={this.handleDownloadClick}>
                DOWNLOAD
              </Button>
            )}
            {!isPM && (
              <Button color="primary" onClick={this.handleUploadClick}>
                UPLOAD
              </Button>
            )}
            <DocumentPreview document={this.state.document} />
          </td>
        </tr>
      </>
    )
  }
}

export default connect(mapStateToProps)(DocumentListItem)
