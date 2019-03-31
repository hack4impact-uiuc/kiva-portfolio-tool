import React from 'react'
import DocumentList from './DocumentList'
import { getAllDocuments } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'

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
        statuses: ['Missing', 'Pending', 'Rejected', 'Approved']
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
      <Container>
        <Row>
          {Object.keys(this.state.documents).map(key => {
            return (
              <Col sm="12" md="6">
                <DocumentList
                  isPM={this.state.isPM}
                  documents={this.state.documents[key]}
                  status={key}
                />
              </Col>
            )
          })}
        </Row>
      </Container>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
