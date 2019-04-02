import React from 'react'
import DocumentList from './DocumentList'
import { getAllDocuments } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateDocuments } from '../redux/modules/user'

const mapStateToProps = state => ({
  isPM: state.user.isPM,
  documents: state.user.documents
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocuments
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
      this.props.updateDocuments(res)
      this.props.history.push('/dashboard')
      console.log(typeof res)
    } else {
      this.props.updateDocuments([])
    }
  }

  render() {
    console.log(this.props.documents)
    return (
      <div>
        {Object.keys(this.props.documents).map(key => {
          return <DocumentList documents={this.props.documents[key]} status={key} />
        })}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
