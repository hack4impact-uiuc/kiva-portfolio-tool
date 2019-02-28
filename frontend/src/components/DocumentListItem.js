import React, { Component } from 'react'

class DocumentListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isPM: this.props.isPM,
      docClass: this.props.docClass,
      fileName: this.props.fileName
    }
  }
  render() {
    return (
      <tr>
        <td>{this.state.docClass}</td>
        <td>{this.state.fileName ? this.state.fileName : 'N/A'}</td>
        <td class="interaction">
          {this.state.fileName ? 'DOWNLOAD ' : '' }
          {this.state.isPM ? 'APPROVE' : 'UPLOAD'}
        </td>
      </tr>
    )
  }
}

export default DocumentListItem
