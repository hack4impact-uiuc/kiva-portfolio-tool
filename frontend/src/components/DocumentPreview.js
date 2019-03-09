import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ContentPreview } from 'box-ui-elements'
import { IntlProvider } from 'react-intl' 

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class DocumentPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileName: this.props.fileName
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
