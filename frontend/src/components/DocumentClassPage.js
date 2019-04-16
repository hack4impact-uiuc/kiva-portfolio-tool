import React from 'react'
import DocumentClassList from './DocumentClassList'
import Upload from './Upload'
import { getAllDocumentClasses, createDocumentClass } from '../utils/ApiWrapper'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import '../styles/dashboard.css'
import { updateDocumentClasses } from '../redux/modules/user'
import '../styles/index.css'
import Dropzone from 'react-dropzone'

const mapStateToProps = state => ({
  documentClasses: state.user.documentClasses
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocumentClasses
    },
    dispatch
  )
}

class DocumentClassPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      secondModal: false,
      name: '',
      description: '',
      files: []
    }
    this.toggle = this.toggle.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.secondToggle = this.secondToggle.bind(this)
  }

  async componentDidMount() {
    const res = await getAllDocumentClasses()
    if (res) {
      this.props.updateDocumentClasses(res)
    } else {
      this.props.updateDocumentClasses([])
    }
  }

  toggle() {
    this.setState({ modal: !this.state.modal })
  }

  secondToggle() {
    this.setState({ secondModal: !this.state.secondModal })
  }

  updateName = event => {
    this.setState({ name: event.target.value })
  }

  updateDescription = event => {
    this.setState({ description: event.target.value })
  }

  async handleSubmit() {
    createDocumentClass(
      this.state.name,
      this.state.description,
      this.state.files[0],
      this.state.files[0].name
    )
    this.secondToggle()
  }

  onDrop(files) {
    this.setState({
      files
    })
  }

  render() {
    return (
      <>
        <Modal isOpen={this.state.uploadModal} toggle={this.toggleUpload}>
          <Upload uploadType="DocumentClass" />
        </Modal>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalBody>
            <form>
              <span> Name: </span>
              <input onChange={this.updateName} />
              <br />
              <span> Description: </span>
              <textarea
                name="paragraph_text"
                cols="50"
                rows="10"
                onChange={this.updateDescription}
              />
              <br />
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
                      Create Document Class
                    </Button>
                    <Modal isOpen={this.state.secondModal} toggle={this.secondToggle}>
                      <ModalBody>File uploaded - your submission is being processed.</ModalBody>
                      <ModalFooter>
                        <Button
                          className="invalidSearchButton"
                          onClick={e => {
                            this.secondToggle()
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
            </form>
          </ModalBody>
          <ModalFooter>
            <Button className="invalidSearchButton" onClick={this.toggle}>
              Return
            </Button>
          </ModalFooter>
        </Modal>
        <h1>Edit Document Classes</h1>
        <Button color="primary" onClick={this.toggle}>
          Add New Document Class
        </Button>
        <DocumentClassList documentClasses={this.props.documentClasses} />
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentClassPage)
