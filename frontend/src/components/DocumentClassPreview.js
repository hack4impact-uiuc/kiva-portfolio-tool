import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Iframe from 'react-iframe'

import { connect } from 'react-redux'

import preview from '../media/preview.png'

import 'box-ui-elements/dist/preview.css'

const mapStateToProps = state => ({
  language: state.user.language
})

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

  /**
   * Opens modal to show document class
   */
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }))
  }

  languages = {
    English: {
      close: 'Close'
    },
    Spanish: {
      close: 'Close (Spanish)'
    },
    French: {
      close: 'Close (French)'
    },
    Portuguese: {
      close: 'Close (Portuguese)'
    }
  }

  render() {
    const customStyles = {
      height: '500px',
      width: '500px',
      overflow: 'scroll'
    }
    const externalCloseBtn = (
      <button
        className="close"
        style={{ position: 'absolute', top: '15px', right: '15px' }}
        onClick={this.toggle}
      >
        &times;
      </button>
    )
    let text = this.languages[this.props.language]
    if (!text) {
      text = this.languages['English']
    }

    return (
      <>
        <Button color="transparent" onClick={this.toggle}>
          <img className="buttonimg" src={preview} alt="preview icon" />
        </Button>

        <Modal isOpen={this.state.modal} toggle={this.toggle} external={externalCloseBtn}>
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
              {text.close}
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

export default connect(mapStateToProps)(DocumentClassPreview)
