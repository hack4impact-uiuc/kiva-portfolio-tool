import React, { Component } from 'react'
import Iframe from 'react-iframe'
import { Button } from 'reactstrap'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateDocuments, beginLoading, endLoading } from '../redux/modules/user'

import WithAuth from './auth/WithAuth'

import { updateDocumentStatus, getDocumentsByUser } from '../utils/ApiWrapper'

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
export class DocumentView extends Component {
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
    this.toggle()
    await updateDocumentStatus(this.props.match.params.user, this.props.match.params.id, 'Rejected')
    const res = await getDocumentsByUser(this.props.match.params.user)
    if (res) {
      this.props.updateDocuments(res)
    } else {
      this.props.updateDocuments([])
    }
    this.props.history.push('/dashboard/pm/' + this.props.match.params.user)
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
      reject: 'Reject'
    },
    Spanish: {
      approve: 'Approve (Spanish)',
      reject: 'Reject (Spanish)'
    },
    French: {
      approve: 'Approve (French)',
      reject: 'Reject (French)'
    },
    Portuguese: {
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
        <h1>{this.props.match.params.name}</h1>
        <Iframe
          className="iframe-relative maxheight"
          url={this.props.location.state.link}
          allowFullScreen
        />
        <div id="review-fullscreen">
          <div id="button-space">
            <Button color="success" onClick={this.handleApproveClick}>
              {text.approve}
            </Button>
            <Button color="danger" onClick={this.handleRejectClick}>
              {text.reject}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithAuth(DocumentView))
