import React from 'react'
import MockData from '../utils/MockData'
import DocumentList from './DocumentList'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isPM: false,
      documents: MockData
    }
  }

  render() {
    return (
      <div>
        {Object.keys(this.state.documents).map(key => {
          return (
            <p>
              <DocumentList isPM={this.state.isPM} documents={this.state.documents[key]} status={key} />
            </p>
          )
        })}
      </div>
    )
  }
}

export default Dashboard
