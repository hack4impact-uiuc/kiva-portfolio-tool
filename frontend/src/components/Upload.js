import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import { uploadDocument, uploadDocumentClass } from '../utils/ApiWrapper'

class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: [],
      modal: false,
      submissionStatus: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onDrop(files) {
    this.setState({
      files
    })
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      submissionStatus: 'File uploaded - your submission is being processed.'
    })
  }

  handleSubmit = () => {
    if (this.props.uploadType == 'Document') {
      uploadDocument(this.state.files[0], this.state.files[0].name, this.props.docID)
    } else if (this.props.uploadType == 'Document Class') {
      uploadDocumentClass(
        this.state.files[0],
        this.state.files[0].name,
        this.props.docClassName,
        this.props.docClassDescription
      )
    }
    this.toggle()
  }

  render() {
    return (
      <div
        className="dropPageBackground"
        style={{ paddingTop: window.innerWidth >= 550 ? '5%' : '20%' }}
      >
        <div className="dropPage">
          <section className="droppedBox">
            <div className="dropZone">
              <Dropzone onDrop={this.onDrop.bind(this)}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Drag some files here, or click to select files</p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
            <aside>
              <h4>Files Dropped</h4>
              <ul className="droppedFilesBackground">
                {this.state.files.map(f => (
                  <li className="droppedBox" key={f.name}>
                    {f.name} - {f.size} bytes
                  </li>
                ))}
              </ul>
              <Button
                disabled={this.state.files.length === 0}
                className="right"
                onClick={this.handleSubmit}
              >
                Upload File
              </Button>
              <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalBody>File uploaded - your submission is being processed.</ModalBody>
                <ModalFooter>
                  <Button
                    className="invalidSearchButton"
                    onClick={e => {
                      this.toggle()
                    }}
                  >
                    Return
                  </Button>
                </ModalFooter>
              </Modal>
            </aside>
          </section>
          <hr />
        </div>
      </div>
    )
  }
}

export default Upload
