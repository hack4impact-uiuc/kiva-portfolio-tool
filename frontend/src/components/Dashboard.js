import React from 'react'
import MockData from '../utils/MockData'
import DocumentList from './DocumentList'
import { getAllDocuments } from '../utils/ApiWrapper'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      documents: MockData
    }
  }

  async componentDidMount() {
    await getAllDocuments().then(results => {
      this.setState({
        documents: results
      })
    })
  }

  render() {
    return (
      <div>
        {Object.keys(this.state.documents).map(key => {
          return (
            <p>
              <DocumentList documents={this.state.documents[key]} status={key} />
            </p>
          )
        })}
      </div>
    )
  }
}

export default Dashboard
