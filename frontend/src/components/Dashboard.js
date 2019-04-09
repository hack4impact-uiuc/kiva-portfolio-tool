import React from 'react'
import DocumentList from './DocumentList'
import { getAllDocuments } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import NavBar from './NavBar';

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
      navbar: []
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
        navbar: ["a navbar"]
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
        {Object.keys(this.state.navbar).map(key => {
          return (
            <NavBar/>
          )
        })}
      </div>
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
