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
            <th />
          </tr>
          {this.state.documents &&
            this.state.documents.map((document, index) => (
              <DocumentListItem
                key={index}
                document={document}
                docClass={document.docClass}
                fileName={document.fileName}
                fileId={document.fileId}
              />
            ))}
        </tbody>
      </Table>
    )
  }
}

export default DocumentList
