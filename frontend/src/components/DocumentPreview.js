import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ContentPreview } from 'box-ui-elements'
import { IntlProvider } from 'react-intl'
import { getAccessToken, updateDocumentStatus, getAllDocuments } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { updateDocuments, beginLoading, endLoading } from '../redux/modules/user'
import Dashboard from './Dashboard'

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
      fileId: 418675740558,
      accessToken: null
    }

    this.toggle = this.toggle.bind(this)
    this.handleApproveClick = this.handleApproveClick.bind(this)
    this.handleRejectClick = this.handleRejectClick.bind(this)
  }

  handleApproveClick() {
    updateDocumentStatus(this.state.id, 'Approved')
    this.props.beginLoading()
    getAllDocuments().then(res => {
      this.props.updateDocuments(res)
      this.props.endLoading()
    })
    this.toggle()
  }

  handleRejectClick() {
    updateDocumentStatus(this.state.id, 'Rejected')
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
            <IntlProvider locale="en" textComponent={React.Fragment}>
              <ContentPreview
                contentSidebarProps={{
                  detailsSidebarProps: {
                    hasAccessStats: false,
                    hasClassification: false,
                    hasNotices: false,
                    hasProperties: false,
                    hasRetentionPolicy: false,
                    hasVersions: true
                  },
                  hasActivityFeed: false,
                  hasMetadata: false,
                  hasSkills: false
                }}
                fileId={this.state.fileId}
                token={this.state.accessToken}
              />
            </IntlProvider>
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
