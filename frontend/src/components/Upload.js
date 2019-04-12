import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import { sendFile } from '../utils/ApiWrapper'

class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: [],
      modal: false,
      submissionStatus: ''
    }
  }

  onDrop(files) {
    console.log(files[0].type)
    // check the type of the file
    const doctypes = [
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint',
      'application/pdf',
      'image/jpeg',
      'image/png',
      'text/plain'
    ]
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
                onClick={e => {
                  sendFile(this.state.files[0], this.state.files[0].name)
                  this.toggle()
                }}
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
