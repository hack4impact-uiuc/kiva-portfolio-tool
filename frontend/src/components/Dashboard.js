import React, { Component } from 'react'
//import DocumentList from './DocumentList'
import WithAuth from './auth/WithAuth'
import NavBar from './NavBar'
import {
  getDocumentsByUser,
  getMessagesByFP,
  updateFieldPartnerStatus,
  getFPByID
} from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Row, Col, Button } from 'reactstrap'
import {
  updateDocuments,
  updateMessages,
  updateInstructions,
  setUserType,
  beginLoading,
  endLoading
} from '../redux/modules/user'

import add from '../media/add.png'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import '../styles/index.css'
import 'box-ui-elements/dist/preview.css'

import { Table } from 'reactstrap'

import '../styles/documentlist.css'
import '../styles/index.css'

import expand from '../media/expand.png'
import collapse from '../media/collapse.png'

import Dropzone from 'react-dropzone'
import DocumentPreview from './DocumentPreview'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Iframe from 'react-iframe'
import { downloadDocument, uploadDocument, deleteDocument } from '../utils/ApiWrapper'

import uploadImg from '../media/greyUpload.png'
import downloadImg from '../media/downloadGrey.png'
import visit from '../media/visit.png'
import remove from '../media/remove.png'

import { Link } from 'react-router-dom'

// Not needed unless working with non "en" locales
// addLocaleData(enLocaleData);

const mapStateToProps = state => ({
  isPM: state.user.isPM,
  documents: state.user.documents,
  messages: state.user.messages,
  information: state.user.information
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocuments,
      updateMessages,
      setUserType,
      beginLoading,
      endLoading,
      updateInstructions
    },
    dispatch
  )
}
export class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fp_statuses: ['Missing', 'Rejected', 'Pending', 'Approved'],
      pm_statuses: ['Pending', 'Missing', 'Rejected', 'Approved']
    }

    this.handleFinish = this.handleFinish.bind(this)
  }

  async componentDidMount() {
    /**
     * Contains all documents received from backend
     */

    this.props.beginLoading()
    let documentsReceived = []

    // temporary - REMOVE after auth integration
    documentsReceived = await getDocumentsByUser(this.props.match.params.id)
    this.props.setUserType(this.props.match.params.user === 'pm')

    /**
     * Contains all messages received from backend
     */
    const messagesReceived = await getMessagesByFP(
      this.props.match.params.id,
      this.props.match.params.user === 'fp'
    )

    /**
     * Contains all information received from backend
     */
    const fp = await getFPByID(this.props.match.params.id)
    const instructionsReceived = fp.instructions

    if (documentsReceived) {
      this.props.updateDocuments(documentsReceived)
    } else {
      this.props.updateDocuments([])
    }

    if (messagesReceived) {
      this.props.updateMessages(messagesReceived)
    } else {
      this.props.updateMessages([])
    }

    if (instructionsReceived) {
      this.props.updateInstructions(instructionsReceived)
    } else {
      this.props.updateInstructions('')
    }
    this.props.endLoading()
  }

  /**
   * When a Field Partner has finished the process, this method is called to move their status to 'Complete'
   */
  async handleFinish() {
    this.props.beginLoading()
    await updateFieldPartnerStatus(this.props.match.params.id, 'Complete')
    this.props.history.push('/overview/' + this.props.match.params.id)
    this.props.endLoading()
  }

  pStyle = {
    margin: 'auto'
  }

  render() {
    return (
      <div className="background-rectangles maxheight">
        <NavBar inDashboard />
        {this.props.isPM ? (
          <div>
            <Button
              className="add-doc-text"
              color="transparent"
              onClick={() => this.props.history.push('/setup/' + this.props.match.params.id)}
            >
              <img className="addImg" src={add} alt="Add icon" />
              <span className="add-doc-text">Update requirements/instructions</span>
            </Button>
            <br />
            <Button color="success" onClick={this.handleFinish}>
              Finish Process
            </Button>
          </div>
        ) : null}
        <Container>
          <Row>
            {this.props.documents
              ? this.props.isPM
                ? this.state.pm_statuses.map(key => {
                    return (
                      <Col sm="12" md="6">
                        <DocumentList documents={this.props.documents[key]} status={key} />
                      </Col>
                    )
                  })
                : this.state.fp_statuses.map(key => {
                    return (
                      <Col sm="12" md="6">
                        <DocumentList documents={this.props.documents[key]} status={key} />
                      </Col>
                    )
                  })
              : null}
          </Row>
        </Container>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithAuth(Dashboard))

/**
 * Displays all documents for a given document status in its own box
 */
export class DocumentList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
      /**
       * showLess is the maximum number to be shown before an expand button appears
       */
      showLess: 5
    }
  }

  /**
   * Expands the number of documents shown only if there are more than 5 documents in current
   * document class
   */
  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    return (
      <Table>
        <tbody>
          <tr className="dlist-header">
            <th
              colSpan="5"
              className={
                'background-' +
                (this.props.status ? this.props.status.toLowerCase() : 'null') +
                ' text-white'
              }
            >
              {this.props.status + ' Documents'}
            </th>
          </tr>
          <tr>
            <th className="text-centered">Document Name</th>
            <th className="text-centered">File</th>
            <th />
          </tr>
          {this.props.documents
            ? this.state.expanded
              ? this.props.documents.map(document => (
                  <DocumentListItem
                    document={document}
                    docClass={document.docClass}
                    fileName={document.fileName}
                    fileId={document.fileId}
                  />
                ))
              : this.props.documents
                  .slice(0, this.state.showLess)
                  .map(document => (
                    <DocumentListItem
                      document={document}
                      docClass={document.docClass}
                      fileName={document.fileName}
                      fileId={document.fileId}
                    />
                  ))
            : null}
          {this.props.documents ? (
            this.props.documents.length > this.state.showLess ? (
              <tr className="text-centered">
                <td colSpan="5" id="buttonRowData">
                  {this.state.expanded ? (
                    <button
                      className={
                        'expandButton ' +
                        'background-' +
                        (this.props.status ? this.props.status.toLowerCase() : 'null')
                      }
                      onClick={this.toggleExpand}
                    >
                      <img className="expandButtonImage" src={collapse} alt="Expand icon" />
                    </button>
                  ) : (
                    <button
                      className={
                        'expandButton ' +
                        'background-' +
                        (this.props.status ? this.props.status.toLowerCase() : 'null')
                      }
                      onClick={this.toggleExpand}
                    >
                      <img className="expandButtonImage" src={expand} alt="Expand icon" />
                    </button>
                  )}
                </td>
              </tr>
            ) : null
          ) : null}
        </tbody>
      </Table>
    )
  }
}

/**
 * Shows each individual document in the Document List Component.
 * You can select this component to view, delete, or upload documents
 */
export class DocumentListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      files: [],
      deleteModal: false,
      docClassModal: false
    }

    this.handleDownloadClick = this.handleDownloadClick.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.deleteToggle = this.deleteToggle.bind(this)
    this.docClassToggle = this.docClassToggle.bind(this)
  }

  /**
   * Called upon uploading a file to a requirement
   */
  async onDrop(files) {
    this.setState({
      files
    })
    this.props.beginLoading()
    await uploadDocument(
      this.props.document.userID,
      this.state.files[0],
      this.state.files[0].name,
      this.props.document._id
    )
    const documents = await getDocumentsByUser(this.props.document.userID)
    if (documents) {
      this.props.updateDocuments(documents)
    } else {
      this.props.updateDocuments([])
    }
    this.props.endLoading()
  }

  handleDownloadClick() {
    // Retrieve file from backend
    downloadDocument(document.fileID)
  }

  /**
   * Called when a user attempts to delete a document
   * The user will be prompted to confirm before the document is actually deleted
   */
  async handleDelete() {
    this.deleteToggle()
    this.props.beginLoading()
    await deleteDocument(this.props.document._id)
    const documents = await getDocumentsByUser(this.props.document.userID)
    if (documents) {
      this.props.updateDocuments(documents)
    } else {
      this.props.updateDocuments([])
    }
    this.props.endLoading()
  }

  deleteToggle() {
    this.setState({ deleteModal: !this.state.deleteModal })
  }

  docClassToggle() {
    this.setState({ docClassModal: !this.state.docClassModal })
  }

  render() {
    const { isPM } = this.props
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

    return (
      <>
        <Modal isOpen={this.state.deleteModal} toggle={this.deleteToggle}>
          <ModalHeader>Are you sure you want to delete this document?</ModalHeader>
          <ModalFooter>
            <Button onClick={this.deleteToggle}>No</Button>
            <Button onClick={this.handleDelete}>Yes</Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.docClassModal}
          toggle={this.docClassToggle}
          external={externalCloseBtn}
        >
          <ModalHeader>{this.props.document.docClass.name}</ModalHeader>
          <ModalBody style={customStyles}>
            <p>{this.props.document.docClass.description}</p>
            <Iframe
              url={this.props.document.docClass.example}
              width="450px"
              height="500px"
              allowFullScreen
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.docClassToggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        <tr className="hoverable">
          <td data-testid="docClass">
            <Button className="add-doc-text" color="transparent" onClick={this.docClassToggle}>
              <span className="add-doc-text">{this.props.document.docClass.name}</span>
            </Button>
          </td>
          <td data-testid="fileName">
            {this.props.document.fileName ? this.props.document.fileName : 'N/A'}
          </td>
          <td className="interaction">
            <DocumentPreview document={this.props.document} />
          </td>
          <td data-testid="interaction" className="interaction">
            {this.props.fileName ? (
              <Button color="transparent">
                <Link
                  to={{
                    pathname:
                      '/view/' + this.props.document.fileName + '/' + this.props.document._id,
                    state: { link: this.props.document.link }
                  }}
                >
                  <img className="buttonimg" src={visit} alt="Visit icon" />
                </Link>
              </Button>
            ) : null}
          </td>
          <td data-testid="interaction" className="interaction padding-right-sm">
            {this.state.fileName && (
              <Button color="transparent" onClick={this.handleDownloadClick}>
                <img className="buttonimg" src={downloadImg} alt="Download icon" />
              </Button>
            )}
            {isPM ? (
              <button className="buttonValue" onClick={this.deleteToggle}>
                <img src={remove} width="25" alt="Remove icon" />
              </button>
            ) : (
              <Dropzone onDrop={this.onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <img className="buttonimg" src={uploadImg} alt="Upload icon" />
                    </div>
                  </section>
                )}
              </Dropzone>
            )}
          </td>
        </tr>
      </>
    )
  }
}
