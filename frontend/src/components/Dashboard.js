import React from 'react'
import MockData from '../utils/MockData'
import DocumentList from './DocumentList'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      //put actions here
    },
    dispatch
  )
}
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
            <DocumentList
              isPM={this.state.isPM}
              documents={this.state.documents[key]}
              status={key}
            />
          )
        })}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
