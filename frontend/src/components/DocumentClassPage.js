import React from 'react'
import DocumentClass from './DocumentClass'
import { getAllDocumentClasses, createDocumentClass } from '../utils/ApiWrapper'
import { Button, Modal, ModalBody, ModalFooter, Table } from 'reactstrap'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import '../styles/dashboard.css'
import { updateDocumentClasses } from '../redux/modules/user'
import { beginLoading, endLoading } from '../redux/modules/auth'
import '../styles/index.css'
import Dropzone from 'react-dropzone'

const mapStateToProps = state => ({
  documentClasses: state.user.documentClasses
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocumentClasses,
      beginLoading,
      endLoading
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
      name: '',
      description: '',
      files: []
    }
    this.toggle = this.toggle.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    const document_classes = await getAllDocumentClasses()
    if (document_classes) {
      this.props.updateDocumentClasses(document_classes)
    } else {
      this.props.updateDocumentClasses([])
    }
  }

  toggle() {
    this.setState({ addModal: !this.state.addModal })
  }

  updateName = event => {
    this.setState({ name: event.target.value })
  }

  updateDescription = event => {
    this.setState({ description: event.target.value })
  }

  async handleSubmit() {
    this.props.beginLoading()
    this.toggle()
    await createDocumentClass(
      this.state.name,
      this.state.description,
      this.state.files[0],
      this.state.files[0].name
    )
    const document_classes = await getAllDocumentClasses()
    if (document_classes) {
      this.props.updateDocumentClasses(document_classes)
    } else {
      this.props.updateDocumentClasses([])
    }
    this.props.endLoading()
  }

  onDrop(files) {
    this.setState({
      files
    })
  }

  render() {
    return (
      <>
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
                            {this.state.files.length > 0 ? (
                              <p>File uploaded: {this.state.files[0].name}</p>
                            ) : (
                              <p>Click to Upload</p>
                            )}
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                </section>
                <hr />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button className="invalidSearchButton" onClick={this.toggle}>
              Return
            </Button>
            <Button disabled={this.state.files.length === 0} onClick={this.handleSubmit}>
              Create Document Class
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
