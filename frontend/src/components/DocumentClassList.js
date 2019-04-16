import React, { Component } from 'react'
import { Table } from 'reactstrap'
import DocumentClass from './DocumentClass'
import '../styles/documentlist.css'

class DocumentClassList extends Component {
  render() {
    return (
      <Table>
        <tbody>
          <tr>
            <th className="theader-centered">Document Class Name</th>
            <th />
          </tr>
          {this.props.documentClasses
            ? this.props.documentClassess.map(documentClass => (
                <DocumentClass documentClass={documentClass} />
              ))
            : null}
        </tbody>
      </Table>
    )
  }
}

export default DocumentClassList
