import React, { Component } from 'react'
import { Table } from 'reactstrap'
import DocumentListItem from './DocumentListItem'
import { getAccessToken } from '../utils/ApiWrapper'

class DocumentList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      documents: this.props.documents,
      status: this.props.status,
      accessToken: null
    }
  }

  async componentDidMount() {
    const res = await getAccessToken()
    if (res) {
      this.setState({
        accessToken: res
      })
    } else {
      this.setState({
        accessToken: null
      })
    }
  }

  render() {
    console.log(this.state.documents)
    return (
      <Table>
        <caption>{this.state.status}</caption>
        <tbody>
          <tr>
            <th>DOC NAME</th>
            <th>FILE</th>
            <th />
          </tr>
          {this.state.documents.map(document => (
            <DocumentListItem
              docClass={document.docClass}
              fileName={document.fileName}
              fileId={document.fileId}
              accessToken={this.state.accessToken}
            />
          ))}
        </tbody>
      </Table>
    )
  }
}

export default DocumentList
