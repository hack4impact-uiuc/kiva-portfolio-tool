import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ContentPreview } from 'box-ui-elements'
import { getAccessToken, updateDocumentStatus } from '../utils/ApiWrapper'
import 'box-ui-elements/dist/preview.css'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

const container = document.querySelector('.container')
class DocumentPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.document._id,
      fileName: this.props.document.fileName,
      fileId: 419072325627,
      accessToken: null
    }

    this.toggle = this.toggle.bind(this)
    this.handleApproveClick = this.handleApproveClick.bind(this)
    this.handleRejectClick = this.handleRejectClick.bind(this)
  }

  handleApproveClick() {
    updateDocumentStatus(this.state.id, 'Approved')
    this.toggle()
  }

  handleRejectClick() {
    updateDocumentStatus(this.state.id, 'Rejected')
    this.toggle()
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }))
  }

  async componentDidMount() {
    const res = await getAccessToken()
    if (res) {
      this.setState({
        accessToken: res
      })
    } else {
      this.setState({
        accessToken: null
      })
    }
  }

  render() {
    const { isPM } = this.props

    return (
      <>
        {this.state.fileName && (
          <Button color="primary" onClick={this.toggle}>
            {isPM ? 'REVIEW' : 'VIEW'}
          </Button>
        )}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader>{this.state.fileName}</ModalHeader>
          <ModalBody>
            <ContentPreview
              hasHeader
              fileId={this.state.fileId}
              token={this.state.accessToken}
              language={'en-US'}
              messages={'messages'}
            />
          </ModalBody>
          <ModalFooter>
            {isPM && (
              <div>
                <Button color="success" onClick={this.handleApproveClick}>
                  Approve
                </Button>
                <Button color="danger" onClick={this.handleRejectClick}>
                  Reject
                </Button>
              </div>
            )}
            <Button color="secondary" onClick={this.toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

export default connect(mapStateToProps)(DocumentPreview)
