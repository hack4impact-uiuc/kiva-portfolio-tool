import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ContentPreview } from 'box-ui-elements'
import { IntlProvider } from 'react-intl'
import { getAccessToken } from '../utils/ApiWrapper'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class DocumentPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileName: this.props.fileName,
      fileId: 418675740558,
      accessToken: null
    }

    this.toggle = this.toggle.bind(this)
    this.handleApproveClick = this.handleApproveClick.bind(this)
    this.handleRejectClick = this.handleRejectClick.bind(this)
  }

  handleApproveClick() {
    // Approve click handling
  }

  handleRejectClick() {
    // Reject click handling
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

export default connect(mapStateToProps)(DocumentPreview)
