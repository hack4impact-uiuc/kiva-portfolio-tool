import React from 'react'
import DocumentList from './DocumentList'
import Notification from "./Notification"
import { getAllDocuments } from '../utils/ApiWrapper'
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
      notification: "H"
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
        statuses: ['Missing', 'Pending', 'Rejected', 'Approved'],
        notification: ["a notification"]
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
        <div>
          <p> {"Notifications"} </p>
          {Object.keys(this.state.notification).map(key => {
            return (
              <Notification
                name={"PM Name"}
                time={"4/8/19"}
                description={"Something happened"}
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
