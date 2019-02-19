import React, { Component } from 'react'

class DocumentListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  render() {
    return (
      <div>
        <div>{this.props.fileName ? this.props.fileName : 'empty'}</div>
        <div>{this.props.docStatus}</div>
        <div>{this.props.docType}</div>
        <div>{this.props.uploadTime ? this.props.uploadTime : ''}</div>
      </div>
    )
  }
}

export default DocumentListItem
