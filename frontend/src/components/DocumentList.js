import React, { Component } from 'react'
import { Table } from 'reactstrap'
import DocumentListItem from './DocumentListItem'

class DocumentList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      documents: this.props.documents,
      status: this.props.status
    }
  }

  render() {
    return (
      <Table>
        <caption>{this.state.status}</caption>
        <tbody>
          <tr>
            <th>DOC NAME</th>
            <th>FILE</th>
            <th></th>
          </tr>
          {this.state.documents.map(document => (
            <DocumentListItem docClass={document.docClass} fileName={document.fileName} />
          ))}
        </tbody>
      </Table>
    )
  }
}

export default DocumentList
