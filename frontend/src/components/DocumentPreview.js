import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { getAccessToken, updateDocumentStatus, getAllDocuments } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { updateDocuments } from '../redux/modules/user'
import { beginLoading, endLoading } from '../redux/modules/auth'
import Iframe from 'react-iframe'
import Loader from 'react-loader-spinner'
import 'box-ui-elements/dist/preview.css'
import '../styles/index.css'
import preview from '../media/preview.png'

// Not needed unless working with non "en" locales
// addLocaleData(enLocaleData);

const mapStateToProps = state => ({
  isPM: state.user.isPM,
  documents: state.user.documents,
  loading: state.auth.loading
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

class DocumentPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.document._id,
      fileName: this.props.document.fileName,
      accessToken: null,
      fileURL: this.props.document.link
    }

    this.toggle = this.toggle.bind(this)
    this.handleApproveClick = this.handleApproveClick.bind(this)
    this.handleRejectClick = this.handleRejectClick.bind(this)
  }

  async handleApproveClick() {
    this.props.beginLoading()
    await updateDocumentStatus(this.state.id, 'Approved')
    const res = await getAllDocuments()
    if (res) {
      this.props.updateDocuments(res)
    } else {
      this.props.updateDocuments([])
    }
    this.props.endLoading()
    this.toggle()
  }

  async handleRejectClick() {
    this.props.beginLoading()
    await updateDocumentStatus(this.state.id, 'Rejected')
    const res = await getAllDocuments()
    if (res) {
      this.props.updateDocuments(res)
    } else {
      this.props.updateDocuments([])
    }
    this.props.endLoading()
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

    const customStyles = {
      height: '500px',
      width: '500px',
      overlfow: 'scroll'
    }

    if (this.props.loading) {
      return (
        <div
          className="resultsText"
          style={{ paddingTop: window.innerWidth >= 550 ? '10%' : '20%' }}
        >
          Loading
          <Loader type="Puff" color="green" height="100" width="100" />
        </div>
      )
    } else {
      return (
        <>
          {this.state.fileName && (
            <Button color="transparent" onClick={this.toggle}>
              <img className="buttonimg" src={preview} />
            </Button>
          )}
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader>{this.state.fileName}</ModalHeader>
            <ModalBody style={customStyles}>
              <Iframe url={this.state.fileURL} width="450px" height="500px" allowFullScreen />
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
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentPreview)
