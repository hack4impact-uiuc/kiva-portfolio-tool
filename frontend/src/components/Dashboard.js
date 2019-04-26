import React from 'react'
import DocumentList from './DocumentList'
<<<<<<< HEAD
<<<<<<< HEAD
import NotificationsBar from './NotificationsBar'
=======
>>>>>>> 604bea01f6c88d040a3567d41a3b1945161a94a2
import { getAllDocuments, getAllMessages } from '../utils/ApiWrapper'
=======
import Notification from './Notification'
import NavBar from './NavBar'
import NotificationsBar from './NotificationsBar'
import { getAllDocuments, getAllMessages, getAllInformation } from '../utils/ApiWrapper'
>>>>>>> 6ef974f08359ab4d54cd9e9735f73e81a4de9aa0
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import { updateDocuments, updateMessages, updateInformation } from '../redux/modules/user'
import Loader from 'react-loader-spinner'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import '../styles/dashboard.css'
import '../styles/index.css'
import 'box-ui-elements/dist/preview.css'

// Not needed unless working with non "en" locales
// addLocaleData(enLocaleData);

const mapStateToProps = state => ({
  isPM: state.user.isPM,
  documents: state.user.documents,
  messages: state.user.messages,
  information: state.user.information,
  loading: state.auth.loading
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocuments,
      updateMessages,
      updateInformation
    },
    dispatch
  )
}
class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fp_statuses: ['Missing', 'Rejected', 'Pending', 'Approved'],
      pm_statuses: ['Pending', 'Missing', 'Rejected', 'Approved']
    }
  }

  async componentDidMount() {
<<<<<<< HEAD
      </Container>
>>>>>>> 553bb00141e25681d6f63aa89809bef8ed5925c7
    )
=======
    /**
     * Contains all documents received from backend
     */
    const documentsReceived = await getAllDocuments()

    /**
     * Contains all messages received from backend
     */
    const messagesReceived = await getAllMessages()

    /**
     * Contains all information received from backend
     */
    const informationReceived = await getAllInformation()

    if (documentsReceived) {
      this.props.updateDocuments(documentsReceived)
    } else {
      this.props.updateDocuments([])
    }

    if (messagesReceived) {
      this.props.updateMessages(messagesReceived)
    } else {
      this.props.updateMessages([])
    }

    if (informationReceived) {
      this.props.updateInformation(informationReceived)
    } else {
      this.props.updateInformation([])
    }
  }

  pStyle = {
    margin: 'auto'
  }

  render() {
    if (this.props.loading) {
      return (
        <div
          className="resultsText"
          style={{ paddingTop: window.innerWidth >= 550 ? '10%' : '20%' }}
        >
          Loading
          <Loader type="Puff" color="green" height="100" width="100" />
        </div>
      )
    } else {
      return (
        <div>
          <NavBar />
          <Container>
            <Row>
              {this.props.documents
                ? this.props.isPM
                  ? this.state.pm_statuses.map(key => {
                      return (
                        <Col sm="12" md="6">
                          <DocumentList documents={this.props.documents[key]} status={key} />
                        </Col>
                      )
                    })
                  : this.state.fp_statuses.map(key => {
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
        </div>
      )
    }
>>>>>>> 6ef974f08359ab4d54cd9e9735f73e81a4de9aa0
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
