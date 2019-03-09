import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalFooter } from 'reactstrap'
import Upload from './Upload'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class DocumentListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      docClass: this.props.docClass,
      fileName: this.props.fileName,
      modal: false
    }

    this.handleDownloadClick = this.handleDownloadClick.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  handleDownloadClick() {
    // Download click handling
  }

  handleUploadClick() {
    // Upload click handling
    this.setState({ modal: !this.state.modal })
  }

  handleApproveClick() {
    // Approve click handling
  }

  toggle = () => {
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
            {this.state.fileName ? (
              <Button color="primary" onClick={this.handleDownloadClick}>
                DOWNLOAD
              </Button>
            ) : (
              ''
            )}
            {isPM ? (
              <Button color="primary" onClick={this.handleApproveClick}>
                APPROVE
              </Button>
            ) : (
              <Button color="primary" onClick={this.toggle}>
                UPLOAD
              </Button>
            )}
          </td>
        </tr>
      </div>
    )
  }
}

export default connect(mapStateToProps)(DocumentListItem)
