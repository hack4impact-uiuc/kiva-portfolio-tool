import React from 'react'
import DocumentList from './DocumentList'
import NavBar from './NavBar'
import {
  getAllDocuments,
  getDocumentsByUser,
  getAllMessages,
  getAllInformation,
  finishFieldPartner
} from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Row, Col, Button } from 'reactstrap'
import {
  updateDocuments,
  updateMessages,
  updateInformation,
  setUserType
} from '../redux/modules/user'
import { beginLoading, endLoading } from '../redux/modules/auth'

import add from '../media/add.png'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import '../styles/index.css'
import 'box-ui-elements/dist/preview.css'

// Not needed unless working with non "en" locales
// addLocaleData(enLocaleData);

const mapStateToProps = state => ({
  isPM: state.user.isPM,
  documents: state.user.documents,
  messages: state.user.messages,
  information: state.user.information
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocuments,
      updateMessages,
      updateInformation,
      setUserType,
      beginLoading,
      endLoading
    },
    dispatch
  )
}
export class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fp_statuses: ['Missing', 'Rejected', 'Pending', 'Approved'],
      pm_statuses: ['Pending', 'Missing', 'Rejected', 'Approved']
    }

    this.handleFinish = this.handleFinish.bind(this)
  }

  async componentDidMount() {
    /**
     * Contains all documents received from backend
     */

    this.props.beginLoading()
    let documentsReceived = []

    // temporary - REMOVE after auth integration
    if (this.props.match) {
      documentsReceived = await getDocumentsByUser(this.props.match.params.id)
      this.props.setUserType(this.props.match.params.user === 'pm')
    } else {
      documentsReceived = await getAllDocuments()
    }

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
    this.props.endLoading()
  }

  /**
   * When a Field Partner has finished the process, this method is called to move their status to 'Complete'
   */
  async handleFinish() {
    this.props.beginLoading()
    await finishFieldPartner(this.props.match.params.id)
    this.props.history.push('/main')
    this.props.endLoading()
  }

  pStyle = {
    margin: 'auto'
  }

  render() {
    return (
      <div className="background-rectangles maxheight">
        <NavBar />
        {this.props.isPM ? (
          <div>
            <Button
              className="add-doc-text"
              color="transparent"
              onClick={() =>
                this.props.history.push('/selectdocumentspage/' + this.props.match.params.id)
              }
            >
              <img className="addImg" src={add} />
              <span className="add-doc-text">Add New Requirements</span>
            </Button>
            <br />
            <Button color="success" onClick={this.handleFinish}>
              Finish Process
            </Button>
          </div>
        ) : null}
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
        </Container>
      </div>
    )
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
