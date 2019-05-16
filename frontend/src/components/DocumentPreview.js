import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { getAccessToken, updateDocumentStatus, getDocumentsByUser } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { updateDocuments } from '../redux/modules/user'
import { beginLoading, endLoading } from '../redux/modules/auth'
import Iframe from 'react-iframe'

import 'box-ui-elements/dist/preview.css'
import '../styles/index.css'
import '../styles/documentpreview.css'

import preview from '../media/preview.png'
import WithAuth from './WithAuth'

// Not needed unless working with non "en" locales
// addLocaleData(enLocaleData);

const mapStateToProps = state => ({
  isPM: state.user.isPM,
  documents: state.user.documents
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

export class DocumentPreview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accessToken: null
    }

    this.toggle = this.toggle.bind(this)
    this.handleApproveClick = this.handleApproveClick.bind(this)
    this.handleRejectClick = this.handleRejectClick.bind(this)
  }

  async handleApproveClick() {
    this.props.beginLoading()
    this.toggle()
    if (this.props.match) {
      await updateDocumentStatus(this.props.match.params.id, 'Approved')
    } else {
      await updateDocumentStatus(this.props.document._id, 'Approved')
    }
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
    if (this.props.match) {
      await updateDocumentStatus(this.props.match.params.id, 'Rejected')
    } else {
      await updateDocumentStatus(this.props.document._id, 'Rejected')
    }
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
        {this.props.location ? (
          <div className="maxheight">
            <Iframe
              className="iframe-relative maxheight"
              url={this.state.fileURL}
              allowFullScreen
            />
            <div id="review-fullscreen">
              <div id="button-space">
                <Button color="success" onClick={this.handleApproveClick}>
                  Approve
                </Button>
                <Button color="danger" onClick={this.handleRejectClick}>
                  Reject
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {(this.props.match && this.props.match.params.name) ||
              (this.props.document.fileName && (
                <Button color="transparent" onClick={this.toggle}>
                  <img className="buttonimg" src={preview} alt="Preview icon" />
                </Button>
              ))}
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
              <ModalHeader>
                {this.props.match ? this.props.match.params.name : this.props.document.fileName}
              </ModalHeader>
              <ModalBody id="modal-box">
                <Iframe
                  className="iframe-relative iframe-modal"
                  url={this.props.match ? this.props.location.state.link : this.props.document.link}
                  allowFullScreen
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
        )}
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithAuth(DocumentPreview))
