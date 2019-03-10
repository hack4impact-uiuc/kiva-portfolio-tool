import React, { Component } from 'react'
import { connect } from 'react-redux'
<<<<<<< HEAD
import { Button } from 'reactstrap'
import DocumentPreview from './DocumentPreview'
=======
import { Button, Modal, ModalFooter } from 'reactstrap'
import Upload from './Upload'
>>>>>>> master

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class DocumentListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      docClass: this.props.docClass,
      fileName: this.props.fileName,
      fileId: this.props.fileId,
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
  }

  handleUploadClick() {
    // Upload click handling
    this.setState({ modal: !this.state.modal })
  }

  render() {
    const { isPM } = this.props
    return (
      <div>
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
          <td>{this.state.docClass}</td>
          <td>{this.state.fileName ? this.state.fileName : 'N/A'}</td>
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
            <DocumentPreview fileName={this.state.fileName} fileId={this.state.fileId} />
          </td>
        </tr>
      </div>
    )
  }
}

export default connect(mapStateToProps)(DocumentListItem)
