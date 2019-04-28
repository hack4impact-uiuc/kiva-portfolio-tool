import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Iframe from 'react-iframe'
import 'box-ui-elements/dist/preview.css'
import '../styles/index.css'

// Not needed unless working with non "en" locales
// addLocaleData(enLocaleData);

/*
Used to view information about a Document CLass when pressing 'View'
Allows users to see the name & description of a Document Class
ALso has a box Preview
*/
export class DocumentClassPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false // whether or not this component is showing
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }))
  }

  render() {
    const customStyles = {
      height: '500px',
      width: '500px',
      overflow: 'scroll'
    }

    return (
      <>
        <Button color="primary" onClick={this.toggle}>
          View
        </Button>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader>{this.props.documentClass.name}</ModalHeader>
          <ModalBody style={customStyles}>
            <p>{this.props.documentClass.description}</p>
            <Iframe
              url={this.props.documentClass.example}
              width="450px"
              height="500px"
              allowFullScreen
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

export default DocumentClassPreview
