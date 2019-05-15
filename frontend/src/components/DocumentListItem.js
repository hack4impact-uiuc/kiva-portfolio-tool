import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DocumentPreview from './DocumentPreview'
import { Button, Modal, ModalFooter } from 'reactstrap'
import { downloadDocument, uploadDocument, getDocumentsByUser } from '../utils/ApiWrapper'
import { updateDocuments } from '../redux/modules/user'
import { beginLoading, endLoading } from '../redux/modules/auth'

import uploadImg from '../media/greyUpload.png'
import downloadImg from '../media/downloadGrey.png'
import visit from '../media/visit.png'
import remove from '../media/remove.png'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      beginLoading,
      endLoading,
      updateDocuments
    },
    dispatch
  )
}
export class DocumentListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      files: []
    }

    this.handleDownloadClick = this.handleDownloadClick.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  async onDrop(files) {
    this.setState({
      files
    })
    this.props.beginLoading()
    await uploadDocument(this.state.files[0], this.state.files[0].name, this.props.document._id)
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

  render() {
    const { isPM } = this.props

    return (
      <>
        <tr className="hoverable">
          <td data-testid="docClass">{this.props.document.docClassName}</td>
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
                  <img className="buttonimg" src={visit} />
                </Link>
              </Button>
            ) : null}
          </td>
          <td data-testid="interaction" className="interaction padding-right-sm">
            {this.state.fileName && (
              <Button color="transparent" onClick={this.handleDownloadClick}>
                <img className="buttonimg" src={downloadImg} />
              </Button>
            )}
            {isPM ? (
              <button className="buttonValue">
                <img src={remove} width="25" />
              </button>
            ) : (
              <Dropzone onDrop={this.onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <img className="buttonimg" src={uploadImg} />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DocumentListItem))
