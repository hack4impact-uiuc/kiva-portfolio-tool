import React, { Component } from 'react'
import { Table } from 'reactstrap'

import { connect } from 'react-redux'

import DocumentListItem from './DocumentListItem'

import expand from '../media/expand.png'
import collapse from '../media/collapse.png'

import '../styles/documentlist.css'
import '../styles/index.css'

const mapStateToProps = state => ({
  language: state.user.language
})

/**
 * Displays all documents for a given document status in its own box
 */
export class DocumentList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
      /**
       * showLess is the maximum number to be shown before an expand button appears
       */
      showLess: 5
    }
  }

  /**
   * Expands the number of documents shown only if there are more than 5 documents in current
   * document class
   */
  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  languages = {
    English: {
      documents: ' documents',
      documentName: 'Document name',
      file: 'File'
    },
    Spanish: {
      documents: ' documents (Spanish)',
      documentName: 'Document name (Spanish)',
      file: 'File (Spanish)'
    },
    French: {
      documents: ' documents (French)',
      documentName: 'Document name (French)',
      file: 'File (French)'
    },
    Portuguese: {
      documents: ' documents (Portuguese)',
      documentName: 'Document name (Portuguese)',
      file: 'File (Portuguese)'
    }
  }

  render() {
    let text = this.languages[this.props.language]

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
              {this.props.status + text.documents}
            </th>
          </tr>
          <tr>
            <th className="text-centered">{text.documentName}</th>
            <th className="text-centered">{text.file}</th>
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
                      className={
                        'expandButton ' +
                        'background-' +
                        (this.props.status ? this.props.status.toLowerCase() : 'null')
                      }
                      onClick={this.toggleExpand}
                    >
                      <img className="expandButtonImage" src={collapse} alt="Expand icon" />
                    </button>
                  ) : (
                    <button
                      className={
                        'expandButton ' +
                        'background-' +
                        (this.props.status ? this.props.status.toLowerCase() : 'null')
                      }
                      onClick={this.toggleExpand}
                    >
                      <img className="expandButtonImage" src={expand} alt="Expand icon" />
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

export default connect(mapStateToProps)(DocumentList)
