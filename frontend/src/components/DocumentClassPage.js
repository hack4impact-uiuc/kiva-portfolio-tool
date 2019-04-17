import React from 'react'
import DocumentClass from './DocumentClass'
import Upload from './Upload'
import { getAllDocumentClasses, createDocumentClass } from '../utils/ApiWrapper'
import { Button, Modal, ModalBody, ModalFooter, Table } from 'reactstrap'
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

/*
A page accessible by admins and PMs with an overview of all Document Classes
Functionality: Allows creation of new Document Classes and viewing/editing/deletion of existing ones through the DocumentClass component
*/
class DocumentClassPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addModal: false, // modal that appears after clicking 'Add New Document Class'
      uploadModal: false, // modal that appears to confirm that a file has been uploaded
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
    this.setState({ addModal: !this.state.addModal })
  }

  secondToggle() {
    this.setState({ uploadModal: !this.state.uploadModal })
  }

  updateName = event => {
    this.setState({ name: event.target.value })
  }

  updateDescription = event => {
    this.setState({ description: event.target.value })
  }

  handleSubmit() {
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
        <Modal isOpen={this.state.addModal} toggle={this.toggle}>
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
                    <Modal isOpen={this.state.uploadModal} toggle={this.secondToggle}>
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
        <Table>
          <tbody>
            <tr>
              <th className="theader-centered">Document Class Name</th>
              <th />
            </tr>
            {this.props.documentClasses
              ? this.props.documentClasses.map(documentClass => (
                  <DocumentClass documentClass={documentClass} />
                ))
              : null}
          </tbody>
        </Table>
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentClassPage)
