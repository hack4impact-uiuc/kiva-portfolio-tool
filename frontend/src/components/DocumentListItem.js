import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import DocumentPreview from './DocumentPreview'
import { Button, Modal, ModalFooter } from 'reactstrap'
import Upload from './Upload'
import { downloadDocument } from '../utils/ApiWrapper'
import uploadImg from '../media/greyUpload.png'
import downloadImg from '../media/downloadGrey.png'
import visit from '../media/visit.png'

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
    // Retrieve file from backend
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
          <Upload docID={this.props.document._id} />
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
        <tr className="hoverable">
          <td data-testid="docClass">{this.state.document.docClassName}</td>
          <td data-testid="fileName">
            {this.state.document.fileName ? this.state.document.fileName : 'N/A'}
          </td>
          <td className="interaction">
            <DocumentPreview document={this.state.document} />
          </td>
          <td data-testid="interaction" className="interaction">
            <Button color="transparent">
              <Link to={'/view/' + this.state.document._id + '/' + this.state.document.fileName + '/' + this.state.document.link}>
                <img className="buttonimg" src={visit} />
              </Link>
            </Button>
          </td>
          <td data-testid="interaction" className="interaction padding-right-sm">
            {this.state.fileName && (
              <Button color="transparent" onClick={this.handleDownloadClick}>
                <img className="buttonimg" src={downloadImg} />
              </Button>
            )}
            {!isPM && (
              <Button color="transparent" onClick={this.handleUploadClick}>
                <img className="buttonimg" src={uploadImg} />
              </Button>
            )}
          </td>
        </tr>
      </>
    )
  }
}

export default connect(mapStateToProps)(withRouter(DocumentListItem))
