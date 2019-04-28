import React, { Component } from 'react'
import { Table } from 'reactstrap'
import DocumentListItem from './DocumentListItem'
import '../styles/documentlist.css'

class DocumentList extends Component {
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
            ? this.props.documents.map(document => (
                <DocumentListItem
                  document={document}
                  docClass={document.docClass}
                  fileName={document.fileName}
                  fileId={document.fileId}
                />
              ))
            : null}
        </tbody>
      </Table>
    )
  }
}

export default DocumentList
