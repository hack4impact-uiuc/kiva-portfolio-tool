import React from 'react'
import MockData from '../utils/MockData'
import DocumentList from './DocumentList'
import { getAllDocuments } from '../utils/ApiWrapper'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      documents: [],
      statuses: []
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
        documents: res,
        statuses: ["Missing", "Pending", "Rejected", "Approved"]
      })
    } else {
      this.setState({
        documents: [],
        statuses: []
      })
    }
  }

  render() {
    return (
      (this.state.documents.length > 0 && this.state.statuses.length > 0) ?
        <div>
          {(this.state.statuses).map(status => {
            return (
             <p>
               <DocumentList documents={this.state.documents.filter(document => document.status == status)} status={status}/>
             </p>
            )
          })}
        </div>
      :
        null
    )
  }
}

export default Dashboard


