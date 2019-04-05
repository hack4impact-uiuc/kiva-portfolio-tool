import React from 'react'
import DocumentList from './DocumentList'
import { getAllDocuments, getAllMessages } from '../utils/ApiWrapper'
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
      documents: [],
      statuses: [],
      messages: []
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
    let messages = await getAllMessages()
    this.setState(this.updateMessages(messages))
    let documents = await getAllDocuments()
    this.setState(this.updateDocuments(documents))
  }

  updateDocuments(res) {
    if (res) {
      return {
        documents: res,
        statuses: ['Missing', 'Pending', 'Rejected', 'Approved']
      }
    } else {
      return {
        documents: [],
        statuses: []
      }
    }
  }

  updateMessages(res) {
    if (res) {
      return {
        messages: res
      }
    } else {
      return {
        messages: []
      }
    }
  }

  render() {
    return (
      <div>
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
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
