import React from 'react'
import MockData from '../utils/MockData'
import DocumentList from './DocumentList'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      documents: MockData
    }
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
