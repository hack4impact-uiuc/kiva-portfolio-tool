import React, { Component } from 'react'
import { Table } from 'reactstrap'
import DocumentListItem from './DocumentListItem'
import '../styles/documentlist.css'
import expand from '../media/expand.png'
import collapse from '../media/collapse.png'

export class DocumentList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
      showLess: 5
    }
  }

  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded })
    // console.log(this.props.documents.length)
  }

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
            ? this.state.expanded
              ? this.props.documents.map(document => (
                  <DocumentListItem
                    document={document}
                    docClass={document.docClass}
                    fileName={document.fileName}
                    fileId={document.fileId}
                  />
                ))
              : this.props.documents
                  .slice(0, this.state.showLess)
                  .map(document => (
                    <DocumentListItem
                      document={document}
                      docClass={document.docClass}
                      fileName={document.fileName}
                      fileId={document.fileId}
                    />
                  ))
            : null}
          {this.props.documents ? (
            this.props.documents.length > this.state.showLess ? (
              <tr className="text-centered">
                <td colSpan="5" id="buttonRowData">
                  {this.state.expanded ? (
                    <button
                      className={'expandButton ' + this.props.status + 'Color'}
                      onClick={this.toggleExpand}
                    >
                      <img className="expandButtonImage" src={collapse} />
                    </button>
                  ) : (
                    <button
                      className={'expandButton ' + this.props.status + 'Color'}
                      onClick={this.toggleExpand}
                    >
                      <img className="expandButtonImage" src={expand} />
                    </button>
                  )}
                </td>
              </tr>
            ) : null
          ) : null}
        </tbody>
      </Table>
    )
  }
}

export default DocumentList
