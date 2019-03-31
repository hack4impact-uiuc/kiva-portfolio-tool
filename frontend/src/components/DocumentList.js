import React, { Component } from 'react'
import { Table } from 'reactstrap'
import DocumentListItem from './DocumentListItem'
import '../styles/documentlist.css'

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
        <tbody>
          <tr className="dlist-header">
            <th colSpan="3" className={'background-' + this.state.status.toLowerCase() + ' text-white'}>{this.state.status + ' Documents'}</th>
          </tr>
          <tr>
            <th className="theader-centered">Document Name</th>
            <th className="theader-centered">File</th>
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
