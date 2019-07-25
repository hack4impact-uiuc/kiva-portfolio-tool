import React, { Component } from 'react'
import Iframe from 'react-iframe'
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

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
      modal: false,
      rejectModal: false,
      accessToken: null,
      rejectReason: ''
    }

    this.toggle = this.toggle.bind(this)
    this.rejectToggle = this.rejectToggle.bind(this)
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
    this.rejectToggle()
    this.toggle()
    await updateDocumentStatus(
      this.props.document.userID,
      this.props.document._id,
      'Rejected',
      this.state.rejectReason
    )
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

  rejectToggle() {
    this.setState(prevState => ({
      rejectModal: !prevState.rejectModal
    }))
  }

  updateRejectReason = event => {
    this.setState({ rejectReason: event.target.value })
  }

  languages = {
    English: {
      rejectInstructions: 'Please provide some reasoning as to why you rejected this document:',
      submit: 'Submit',
      approve: 'Approve',
      reject: 'Reject',
      close: 'Close'
    },
    Spanish: {
      rejectInstructions:
        'Por Favor incluye una explicación de porque has rechazado este documento: ',
      submit: 'Someter/Enviar',
      approve: 'Aprobar',
      reject: 'Rechazar',
      close: 'Cerrar'
    },
    French: {
      rejectInstructions: "Merci d'expliquer pourquoi vous avez rejeté ce document:",
      submit: 'Envoyer',
      approve: 'Approuver',
      reject: 'Rejeter',
      close: 'Fermer'
    },
    Portuguese: {
      rejectInstructions: 'Por favor explicar o motivo pelo qual você rejeitou este documento:',
      submit: 'Submeter/Enviar',
      approve: 'Aprovar',
      reject: 'Rejeitar',
      close: 'Fechar'
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
        <Modal isOpen={this.state.rejectModal} toggle={this.rejectToggle}>
          <ModalHeader>{text.rejectInstructions}</ModalHeader>
          <ModalBody>
            <Input
              type="textarea"
              className="textarea-input"
              style={{ height: '200px' }}
              onChange={this.updateRejectReason}
              value={this.state.rejectReason}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleRejectClick}>
              {text.submit}
            </Button>
          </ModalFooter>
        </Modal>
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
                <Button color="danger" onClick={this.rejectToggle}>
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
