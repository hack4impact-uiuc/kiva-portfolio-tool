import React from 'react'
import DocumentList from './DocumentList'
<<<<<<< HEAD
import Notification from './Notification'
import NavBar from './NavBar'
=======
>>>>>>> master
import { getAllDocuments } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import '../styles/dashboard.css'
import { updateDocuments } from '../redux/modules/user'
import '../styles/index.css'

// Not needed unless working with non "en" locales
// import { addLocaleData } from 'react-intl';
// import enLocaleData from 'react-intl/locale-data/en';

// Not needed unless working with non "en" locales
// addLocaleData(enLocaleData);

const mapStateToProps = state => ({
  isPM: state.user.isPM,
  documents: state.user.documents
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocuments
    },
    dispatch
  )
}
class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      statuses: ['Missing', 'Rejected', 'Pending', 'Approved']
    }
  }

  async componentDidMount() {
    const res = await getAllDocuments()
    if (res) {
      this.props.updateDocuments(res)
    } else {
      this.props.updateDocuments([])
    }
  }

  render() {
    return (
      <div>
        <NavBar />
        <Container>
          <Row>
            {this.props.documents
              ? this.state.statuses.map(key => {
                  return (
                    <Col sm="12" md="6">
                      <DocumentList documents={this.props.documents[key]} status={key} />
                    </Col>
                  )
                })
              : null}
          </Row>
        </Container>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
