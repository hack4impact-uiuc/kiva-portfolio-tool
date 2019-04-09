import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { getAccessToken, updateDocumentStatus, getAllDocuments } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { updateDocuments, beginLoading, endLoading } from '../redux/modules/user'
import Iframe from 'react-iframe'
import 'box-ui-elements/dist/preview.css'
import './index.scss'

// Not needed unless working with non "en" locales
// addLocaleData(enLocaleData);

const mapStateToProps = state => ({
  isPM: state.user.isPM,
  documents: state.user.documents,
  loading: state.user.loading
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
      fileId: this.props.document.fileId,
      accessToken: null,
      fileURL: null
    }

    this.toggle = this.toggle.bind(this)
    this.handleApproveClick = this.handleApproveClick.bind(this)
    this.handleRejectClick = this.handleRejectClick.bind(this)
  }

  async handleApproveClick() {
    await updateDocumentStatus(this.state.id, 'Approved')
    this.props.beginLoading()
    getAllDocuments().then(res => {
      this.props.updateDocuments(res)
      this.props.endLoading()
    })
    this.toggle()
  }

  async handleRejectClick() {
    await updateDocumentStatus(this.state.id, 'Rejected')
    this.props.beginLoading()
    getAllDocuments().then(results => {
      this.props.updateDocuments(results)
      this.props.endLoading()
    })
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
    this.setState({
      fileURL: 'https://app.box.com/s/' + this.state.fileId
    })
  }

  render() {
    const { isPM } = this.props

    const customStyles = {
      height: '500px',
      width: '500px',
      overlfow: 'scroll'
    }

    return (
      <>
        {this.state.fileName && (
          <Button color="primary" onClick={this.toggle}>
            {isPM ? 'REVIEW' : 'VIEW'}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentPreview)
