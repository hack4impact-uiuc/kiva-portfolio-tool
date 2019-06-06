import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Iframe from 'react-iframe'

import { connect } from 'react-redux'

import add from '../media/add.png'
import remove from '../media/remove.png'
import info from '../media/blueinfo.png'

import '../styles/selector.scss'

const mapStateToProps = state => ({
  language: state.user.language
})

/**
 * Class for individual docClasses in SelectDocumentsPage.
 * Shows docClass name, info button, and add/remove button
 */
export class Selector extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: false,
      docClass: null
    }

    this.toggle = this.toggle.bind(this)
  }

  viewDocClass = docClass => {
    this.setState({ docClass: docClass })
    this.toggle()
  }

  toggle() {
    this.setState({ modal: !this.state.modal })
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
        {this.state.docClass ? (
          <Modal isOpen={this.state.modal} toggle={this.toggle} external={externalCloseBtn}>
            <ModalHeader>{this.state.docClass.name}</ModalHeader>
            <ModalBody style={customStyles}>
              <p>{this.state.docClass.description}</p>
              <Iframe
                url={this.state.docClass.example}
                width="450px"
                height="500px"
                allowFullScreen
              />
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggle} className="exit">
                {text.close}
              </Button>
            </ModalFooter>
          </Modal>
        ) : null}
        <div className="surround-box">
          <h3>{this.props.name}</h3>
          <div>
            {this.props.documents.map(docClass => {
              let buttonType
              if (this.props.name === 'Selected') {
                buttonType = remove // placeholders for red delete X
              } else {
                buttonType = add // placeholder for green add button (see chloe design documentation)
              }
              return (
                <div className="panel">
                  <div className="docClassValue">{docClass.name}</div>
                  <Button
                    color="transparent"
                    className="info"
                    onClick={() => this.viewDocClass(docClass)}
                  >
                    <img src={info} className="imageValue" width="26" alt="Info icon" />
                  </Button>
                  <Button
                    color="transparent"
                    onClick={() => {
                      this.props.update(docClass.name)
                    }}
                    className="update"
                  >
                    <img src={buttonType} width="30" alt="Add/remove icon" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </>
    )
  }
}
export default connect(mapStateToProps)(Selector)
