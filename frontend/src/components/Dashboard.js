import React from 'react'
import DocumentList from './DocumentList'
import NotificationsBar from './NotificationsBar'
import { getAllDocuments, getAllMessages } from '../utils/ApiWrapper'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import '../styles/dashboard.css'
import { updateDocuments, updateMessages, updateInformation } from '../redux/modules/user'
import '../styles/index.css'

// Not needed unless working with non "en" locales
// import { addLocaleData } from 'react-intl';
// import enLocaleData from 'react-intl/locale-data/en';

// Not needed unless working with non "en" locales
// addLocaleData(enLocaleData);

const mapStateToProps = state => ({
  isPM: state.user.isPM,
  documents: state.user.documents,
  messages: state.user.messages
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocuments,
      updateMessages
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
    const res2 = await getAllMessages()
    if (res) {
      this.props.updateDocuments(res)
    } else {
      this.props.updateDocuments([])
    }
    if (res2) {
      this.props.updateMessages(res2)
    } else {
      this.props.updateMessages([])
    }
  }
  pStyle = {
    margin: 'auto'
  }

  render() {
    return (
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
        <NotificationsBar />
      </Container>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
