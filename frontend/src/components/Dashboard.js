import React from 'react'
import MockData from '../utils/MockData'
import DocumentList from './DocumentList'
import { getAllDocuments } from '../utils/ApiWrapper'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      documents: []
    }
  }

  async componentDidMount() {
    /* await getAllDocuments().then(results => {
      results ? 
      this.setState({
        documents: results
      }) :
      this.setState({
        documents: []
      }) */
    const res = await getAllDocuments()
    if (res) {
      this.setState({
        documents: res
      })
    } else {
      this.setState({
        documents: []
      })
    }
  }

  render() {
    return (
      <div>
        <DocumentList documents={this.state.documents} status="Accepted" />
      </div>
    )
  }
}

export default Dashboard
