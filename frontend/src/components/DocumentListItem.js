import React, { Component } from 'react'

class DocumentListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  render() {
    return (
      <tr>
        <td>{this.props.docClass}</td>
        <td>{this.props.fileName ? this.props.fileName : 'N/A'}</td>
      </tr>
    )
  }
}

export default DocumentListItem
