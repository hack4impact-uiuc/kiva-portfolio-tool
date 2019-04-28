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

    if (this.props.match) {
      this.state = {
        id: this.props.match.params.id,
        fileName: this.props.match.params.name,
        accessToken: null,
        fileURL: this.props.location.state.link
      }
    } else {
      this.state = {
        id: this.props.document._id,
        fileName: this.props.document.fileName,
        accessToken: null,
        fileURL: this.props.document.link
      }
    }

    this.toggle = this.toggle.bind(this)
    this.handleApproveClick = this.handleApproveClick.bind(this)
    this.handleRejectClick = this.handleRejectClick.bind(this)
  }

  async handleApproveClick() {
    this.props.beginLoading()
    this.toggle()
    await updateDocumentStatus(this.state.id, 'Approved')
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
    await updateDocumentStatus(this.state.id, 'Rejected')
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
          <>
            <Iframe className="iframe-relative" url={this.state.fileURL} allowFullScreen />
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
          </>
        ) : (
          <>
            {this.state.fileName && (
              <Button color="transparent" onClick={this.toggle}>
                <img className="buttonimg" src={preview} />
              </Button>
            )}
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
              <ModalHeader>{this.state.fileName}</ModalHeader>
              <ModalBody id="modal-box">
                <Iframe
                  classname="iframe-relative iframe-modal"
                  url={this.state.fileURL}
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
)(DocumentPreview)
