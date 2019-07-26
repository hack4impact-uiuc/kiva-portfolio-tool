import React, { Component } from 'react'
import { Table } from 'reactstrap'

import { connect } from 'react-redux'

import DocumentListItem from './DocumentListItem'

import expand from '../media/expand.png'
import collapse from '../media/collapse.png'

import '../styles/documentlist.scss'

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
      statuses: {
        Missing: 'Missing',
        Pending: 'Pending',
        Rejected: 'Rejected',
        Approved: 'Approved'
      },
      documents: ' documents',
      documentName: 'Document name',
      file: 'File'
    },
    Spanish: {
      statuses: {
        Missing: 'Incompleto',
        Pending: 'Pendiente',
        Rejected: 'Rechazado',
        Approved: 'Aprobado'
      },
      documents: ' documentos',
      documentName: 'Nombre de documento',
      file: 'Archivo'
    },
    French: {
      statuses: {
        Missing: 'Manquant',
        Pending: 'En attente',
        Rejected: 'Rejeté',
        Approved: 'Approuvé'
      },
      documents: ' documents',
      documentName: 'Nom du document',
      file: 'Fichier'
    },
    Portuguese: {
      statuses: {
        Missing: 'Falta',
        Pending: 'Pendente ',
        Rejected: 'Rejeitado',
        Approved: 'Aprovado'
      },
      documents: ' documentos',
      documentName: 'Nome do documento',
      file: 'Arquivo'
    }
  }

  render() {
    let text = this.languages[this.props.language]
    if (!text) {
      text = this.languages['English']
    }

    return (
      <Table className="document-table">
        <tbody>
          <tr className="dlist-header">
            <th
              colSpan="3"
              className={
                'background-' +
                (this.props.status ? this.props.status.toLowerCase() : 'null') +
                ' text-white'
              }
            >
              {text.statuses[this.props.status] + text.documents}
            </th>
          </tr>
          <tr>
            <th className="text-centered">{text.documentName}</th>
            <th className="text-centered">{text.file}</th>
            <th />
          </tr>
          {this.props.documents
            ? this.state.expanded
              ? this.props.documents.map((document, index) => (
                  /* using index should differentiate the documents from the siblings */
                  <DocumentListItem
                    key={index}
                    document={document}
                    docClass={document.docClass}
                    fileName={document.fileName}
                    fileId={document.fileId}
                  />
                ))
              : this.props.documents
                  .slice(0, this.state.showLess)
                  .map((document, index) => (
                    <DocumentListItem
                      key={index}
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
                <td colSpan="3" id="buttonRowData">
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
