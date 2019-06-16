import React, { Component } from 'react'
import Iframe from 'react-iframe'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateDocuments, beginLoading, endLoading } from '../redux/modules/user'

import { updateDocumentStatus, getDocumentsByUser } from '../utils/ApiWrapper'

import preview from '../media/preview.png'

import '../styles/documentpreview.scss'

const mapStateToProps = state => ({
  isPM: state.user.isPM,
  documents: state.user.documents,
  language: state.user.language
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocuments,
      beginLoading,
      endLoading
    },
    dispatch
  )
}

/**
 * This page allows a small modal to open up that is connected to BOX
 * It allows the user to preview and look at any documents that are in BOX that are related to
 * what the user clicked on to open this modal
 * In case of a PM, it allows them to accept or reject documents
 * For both parties, they are able to upload documents to the backend through this component
 */
export class DocumentPreview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: false
    }

    this.toggle = this.toggle.bind(this)
    this.handleApproveClick = this.handleApproveClick.bind(this)
    this.handleRejectClick = this.handleRejectClick.bind(this)
  }

  async handleApproveClick() {
    this.props.beginLoading()
    this.toggle()
    await updateDocumentStatus(this.props.document.userID, this.props.document._id, 'Approved')
    const res = await getDocumentsByUser(this.props.document.userID)
    if (res) {
      this.props.updateDocuments(res)
    } else {
      this.props.updateDocuments([])
    }
    this.props.endLoading()
  }

  async handleRejectClick() {
    this.props.beginLoading()
    this.toggle()
    await updateDocumentStatus(this.props.document.userID, this.props.document._id, 'Rejected')
    const res = await getDocumentsByUser(this.props.document.userID)
    if (res) {
      this.props.updateDocuments(res)
    } else {
      this.props.updateDocuments([])
    }
    this.props.endLoading()
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }))
  }

  languages = {
    English: {
      approve: 'Approve',
      reject: 'Reject',
      close: 'Close'
    },
    Spanish: {
      approve: 'Approve (Spanish)',
      reject: 'Reject (Spanish)',
      close: 'Close (Spanish)'
    },
    French: {
      approve: 'Approve (French)',
      reject: 'Reject (French)',
      close: 'Close (French)'
    },
    Portuguese: {
      approve: 'Approve (Portuguese)',
      reject: 'Reject (Portuguese)',
      close: 'Close (Portuguese)'
    }
  }

  render() {
    const { isPM } = this.props
    let text = this.languages[this.props.language]
    if (!text) {
      text = this.languages['English']
    }

    return (
      <>
        {this.props.document.fileName && (
          <Button color="transparent" onClick={this.toggle}>
            <img className="buttonimg" src={preview} alt="Preview icon" />
          </Button>
        )}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader>{this.props.document.fileName}</ModalHeader>
          <ModalBody id="modal-box">
            <Iframe
              className="iframe-relative iframe-modal"
              url={this.props.document.link}
              allowFullScreen
            />
          </ModalBody>
          <ModalFooter>
            {isPM && (
              <div>
                <Button color="success" onClick={this.handleApproveClick}>
                  {text.approve}
                </Button>
                <Button color="danger" onClick={this.handleRejectClick}>
                  {text.reject}
                </Button>
              </div>
            )}
            <Button color="secondary" onClick={this.toggle}>
              {text.close}
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentPreview)
