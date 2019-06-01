import React, { Component } from 'react'
import { Container, Row, Col, Button } from 'reactstrap'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  updateDocuments,
  updateMessages,
  updateInstructions,
  setUserType,
  beginLoading,
  endLoading
} from '../redux/modules/user'

import WithAuth from './auth/WithAuth'
import DocumentList from './DocumentList'
import NavBar from './NavBar'

import {
  getDocumentsByUser,
  getMessagesByFP,
  updateFieldPartnerStatus,
  getFPByID
} from '../utils/ApiWrapper'

import add from '../media/add.png'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import '../styles/index.css'
import 'box-ui-elements/dist/preview.css'

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
      setUserType,
      beginLoading,
      endLoading,
      updateInstructions
    },
    dispatch
  )
}
export class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fp_statuses: ['Missing', 'Rejected', 'Pending', 'Approved'],
      pm_statuses: ['Pending', 'Missing', 'Rejected', 'Approved'],
      pm_id: null
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
    documentsReceived = await getDocumentsByUser(this.props.match.params.id)
    this.props.setUserType(this.props.match.params.user === 'pm')

    /**
     * Contains all messages received from backend
     */
    const messagesReceived = await getMessagesByFP(
      this.props.match.params.id,
      this.props.match.params.user === 'fp'
    )

    /**
     * Contains all information received from backend
     */
    const fp = await getFPByID(this.props.match.params.id)
    const instructionsReceived = fp.instructions

    // Processing the date to a readable string
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    let due_date = new Date(fp.due_date).toLocaleDateString('en-US', options)

    this.setState({
      pm_id: fp.pm_id,
      dueDate: due_date
    })

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

    if (instructionsReceived) {
      this.props.updateInstructions(instructionsReceived)
    } else {
      this.props.updateInstructions('')
    }
    this.props.endLoading()
  }

  /**
   * When a Field Partner has finished the process, this method is called to move their status to 'Complete'
   */
  async handleFinish() {
    this.props.beginLoading()
    await updateFieldPartnerStatus(this.props.match.params.id, 'Complete')
    this.props.history.push('/overview/' + this.state.pm_id)
    this.props.endLoading()
  }

  pStyle = {
    margin: 'auto'
  }

  render() {
    return (
      <div className="background-rectangles maxheight">
        <NavBar inDashboard />
        <h1>Due Date: {this.state.dueDate}</h1>
        {this.props.isPM ? (
          <div>
            <Button
              className="add-doc-text"
              color="transparent"
              onClick={() => this.props.history.push('/setup/' + this.props.match.params.id)}
            >
              <img className="addImg" src={add} alt="Add icon" />
              <span className="add-doc-text">Update requirements/instructions</span>
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
)(WithAuth(Dashboard))
