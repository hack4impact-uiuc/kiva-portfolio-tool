import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DocumentPreview from './DocumentPreview'
import { Button, Modal, ModalFooter } from 'reactstrap'
import { downloadDocument, uploadDocument, getAllDocuments } from '../utils/ApiWrapper'
import { updateDocuments } from '../redux/modules/user'
import { beginLoading, endLoading } from '../redux/modules/auth'
import uploadImg from '../media/greyUpload.png'
import downloadImg from '../media/downloadGrey.png'
import visit from '../media/visit.png'

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
class DocumentListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      document: this.props.document,
      files: []
    }

    this.handleDownloadClick = this.handleDownloadClick.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  async onDrop(files) {
    const docTypes = [
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint',
      'application/pdf',
      'image/jpeg',
      'image/png',
      'text/plain'
    ]

    if (!docTypes.includes(files[0].type)) {
      window.alert('Document not acceptable')
    } else {
      this.setState({
        files
      })
      this.props.beginLoading()
      await uploadDocument(this.state.files[0], this.state.files[0].name, this.state.document._id)
      const documents = await getAllDocuments()
      if (documents) {
        this.props.updateDocuments(documents)
      } else {
        this.props.updateDocuments([])
      }
      this.props.endLoading()
    }
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
          <td data-testid="docClass">{this.state.document.docClassName}</td>
          <td data-testid="fileName">
            {this.state.document.fileName ? this.state.document.fileName : 'N/A'}
          </td>
          <td className="interaction">
            <DocumentPreview document={this.state.document} />
          </td>
          <td data-testid="interaction" className="interaction">
            <Button color="transparent">
              <img className="buttonimg" src={visit} />
            </Button>
          </td>
          <td data-testid="interaction" className="interaction padding-right-sm">
            {this.state.fileName && (
              <Button color="transparent" onClick={this.handleDownloadClick}>
                <img className="buttonimg" src={downloadImg} />
              </Button>
            )}
            {!isPM && (
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
)(DocumentListItem)
