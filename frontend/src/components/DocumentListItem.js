import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class DocumentListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      docClass: this.props.docClass,
      fileName: this.props.fileName
    }

    this.handleDownloadClick = this.handleDownloadClick.bind(this)
  }

  handleDownloadClick() {
    // Download click handling
  }

  handleUploadClick() {
    // Upload click handling
  }

  handleApproveClick() {
    // Approve click handling
  }

  render() {
    const { isPM } = this.props
    return (
      <tr>
        <td>{this.state.docClass}</td>
        <td>{this.state.fileName ? this.state.fileName : 'N/A'}</td>
        <td class="interaction">
          {this.state.fileName ? (
            <Button color="primary" onClick={this.handleDownloadClick}>
              DOWNLOAD
            </Button>
          ) : (
            ''
          )}
          {isPM ? (
            <Button color="primary" onClick={this.handleApproveClick}>
              APPROVE
            </Button>
          ) : (
            <Button color="primary" onClick={this.handleUploadClick}>
              UPLOAD
            </Button>
          )}
        </td>
      </tr>
    )
  }
}

export default connect(mapStateToProps)(DocumentListItem)
