import React, { Component } from 'react'
import Iframe from 'react-iframe'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateDocuments, beginLoading, endLoading } from '../redux/modules/user'

import WithAuth from './auth/WithAuth'
import NavBar from './NavBar'

import { updateDocumentStatus, getDocumentsByUser } from '../utils/ApiWrapper'

import '../styles/documentpreview.scss'

const mapStateToProps = state => ({
  isPM: state.user.isPM,
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
export class DocumentView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rejectModal: false,
      rejectInstructions: ''
    }

    this.rejectToggle = this.rejectToggle.bind(this)
    this.handleApproveClick = this.handleApproveClick.bind(this)
    this.handleRejectClick = this.handleRejectClick.bind(this)
  }

  async handleApproveClick() {
    this.props.beginLoading()
    await updateDocumentStatus(this.props.match.params.user, this.props.match.params.id, 'Approved')
    const res = await getDocumentsByUser(this.props.match.params.user)
    if (res) {
      this.props.updateDocuments(res)
    } else {
      this.props.updateDocuments([])
    }
    this.props.history.push('/dashboard/pm/' + this.props.match.params.user)
    this.props.endLoading()
  }

  async handleRejectClick() {
    this.props.beginLoading()
    this.rejectToggle()
    await updateDocumentStatus(
      this.props.match.params.user,
      this.props.match.params.id,
      'Rejected',
      this.state.rejectReason
    )
    const res = await getDocumentsByUser(this.props.match.params.user)
    if (res) {
      this.props.updateDocuments(res)
    } else {
      this.props.updateDocuments([])
    }
    this.props.history.push('/dashboard/pm/' + this.props.match.params.user)
    this.props.endLoading()
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
      reject: 'Reject'
    },
    Spanish: {
      rejectInstructions:
        'Please provide some reasoning as to why you rejected this document: (Spanish)',
      submit: 'Submit (Spanish)',
      approve: 'Approve (Spanish)',
      reject: 'Reject (Spanish)'
    },
    French: {
      rejectInstructions:
        'Please provide some reasoning as to why you rejected this document: (French)',
      submit: 'Submit (French)',
      approve: 'Approve (French)',
      reject: 'Reject (French)'
    },
    Portuguese: {
      rejectInstructions:
        'Please provide some reasoning as to why you rejected this document: (Portuguese)',
      submit: 'Submit (Portuguese)',
      approve: 'Approve (Portuguese)',
      reject: 'Reject (Portuguese)'
    }
  }

  render() {
    let text = this.languages[this.props.language]
    if (!text) {
      text = this.languages['English']
    }

    return (
      <div className="maxheight text-centered">
        <NavBar/>
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
        <h1>{this.props.match.params.name}</h1>
        <Iframe
          className="iframe-relative maxheight"
          url={this.props.location.state.link}
          allowFullScreen
        />
        {this.props.isPM && (
          <div id="review-fullscreen">
            <div id="button-space">
              <Button color="success" onClick={this.handleApproveClick}>
                {text.approve}
              </Button>
              <Button color="danger" onClick={this.rejectToggle}>
                {text.reject}
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithAuth(DocumentView))
