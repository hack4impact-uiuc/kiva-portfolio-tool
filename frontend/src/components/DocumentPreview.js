import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
//import { ContentPreview } from 'box-ui-elements'
import { IntlProvider } from 'react-intl'
import { getAccessToken, updateDocumentStatus } from '../utils/ApiWrapper'

import { ContentPreview } from 'box-ui-elements';
import messages from 'box-ui-elements/i18n/en-US';
import 'box-ui-elements/dist/preview.css';
import './index.scss';

// Not needed unless working with non "en" locales
// addLocaleData(enLocaleData);

const container = document.querySelector('.container');
const token = 'aRPU7COQG1ozVy1pyRonB5S2hKTv13OR';
const language = 'en-US';

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class DocumentPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.document._id,
      fileName: this.props.document.fileName,
      fileId: 421186798979,
      accessToken: null
    }

    this.toggle = this.toggle.bind(this)
    this.handleApproveClick = this.handleApproveClick.bind(this)
    this.handleRejectClick = this.handleRejectClick.bind(this)
  }

  handleApproveClick() {
    updateDocumentStatus(this.state.id, 'Approved')
    this.toggle()
  }

  handleRejectClick() {
    updateDocumentStatus(this.state.id, 'Rejected')
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
            <ContentPreview
              hasHeader
              fileId={this.state.fileId}
              token={token}
              language={language}
              messages={messages}
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
    )
  }
}

export default connect(mapStateToProps)(DocumentPreview)
