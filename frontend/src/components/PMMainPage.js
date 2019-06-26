import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import {
  Container,
  Row,
  Col,
  Progress,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Input
} from 'reactstrap'

import { bindActionCreators } from 'redux'
import { updateMessages, beginLoading, endLoading } from '../redux/modules/user'
import { connect } from 'react-redux'

import WithAuth from './auth/WithAuth'
import Navbar from './NavBar'

import {
  createFieldPartner,
  deleteDocumentsByFP,
  updateFPInstructions,
  getPartnersByPM,
  getMessagesByPM
} from '../utils/ApiWrapper'

import { sendChangePasswordEmail } from '../utils/sendMail'

import search from '../media/search.png'
import add from '../media/add.png'

// same button styling as in document class page
// 'Add New Doc Class' button styling the same
import '../styles/partnerbar.scss'
import '../styles/documentclasspage.scss'

const mapStateToProps = state => ({
  language: state.user.language
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      beginLoading,
      endLoading,
      updateMessages
    },
    dispatch
  )
}

/**
 * This is a PM's home page
 * It shows all the field partners a PM is working with under 3 categories (New, In Progress, Completed)
 * Each field partner has their own banner upon which name, duedate, and completion rate is shown
 * Also includes the Navigation Bar up top
 */
export class PMMainPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      partners: [],
      filtered: [],
      query: '',
      email: '',
      org_name: '',
      newModal: false, // for creating a new FP
      completeModal: false,
      complete_id: null, // for confirmation of process restart for a 'Complete' FP
      responseMessage: null,
      errorModal: true
    }
    this.newToggle = this.newToggle.bind(this)
    this.completeToggle = this.completeToggle.bind(this)
    this.handleNewFP = this.handleNewFP.bind(this)
    this.handleClickIP = this.handleClickIP.bind(this)
    this.handleClickNew = this.handleClickNew.bind(this)
    this.handleClickComplete = this.handleClickComplete.bind(this)
    this.handleClickCompleteRestart = this.handleClickCompleteRestart.bind(this)
  }

  /**
   * Waits for component to load and get all the partners attached to pm
   */
  async componentDidMount() {
    this.props.beginLoading()
    let pm_id = this.props.match.params.id
    let partners = await getPartnersByPM(pm_id)
    let messages = await getMessagesByPM(pm_id)
    if (messages) {
      this.props.updateMessages(messages)
    }
    this.setState(this.loadPartners(partners))
    this.setState({ pm_id: pm_id })
    this.props.endLoading()
  }

  /**
   *
   * @param {*} res updates state of partners and filtered to res if it exists
   */
  loadPartners(res) {
    if (res) {
      return {
        partners: res,
        filtered: res
      }
    } else {
      return {
        partners: [],
        filtered: []
      }
    }
  }

  /**
   * Picks up on any changes in query from and updates query state
   * Filtered is then filter to include substrings of query
   * Then state is updated
   */
  handleQueryChange = event => {
    let newState = this.state
    let query = event.target.value.toLowerCase()
    newState['query'] = query
    newState['filtered'] = []
    if (query === '') {
      newState['filtered'] = this.state.partners
    } else {
      newState['filtered'] = this.state.partners.filter(partner =>
        partner.org_name.toLowerCase().includes(query)
      )
    }
    this.setState(newState)
  }

  handleNameChange = event => {
    this.setState({ org_name: event.target.value })
  }

  handleEmailChange = event => {
    this.setState({ email: event.target.value })
  }

  newToggle = () => {
    this.setState({ newModal: !this.state.newModal })
  }

  errorToggle = () => {
    this.setState({ errorModal: !this.state.errorModal })
  }

  completeToggle = id => {
    this.setState({ completeModal: !this.state.completeModal, complete_id: id })
  }

  /**
   * Called on submission of a new Field Partner
   */
  async handleNewFP() {
    this.props.beginLoading()
    this.newToggle()
    const result = await createFieldPartner(
      this.state.org_name,
      this.state.email,
      this.props.match.params.id
    )

    if (
      result.error != null &&
      (result.error.response.status === 400 || result.error.response.status === 500)
    ) {
      this.setState({
        responseMessage: result.error.response.data.message
      })
      this.props.endLoading()
      return
    }

    let partners = await getPartnersByPM(this.props.match.params.id)
    this.setState(this.loadPartners(partners))
    this.props.endLoading()

    await sendChangePasswordEmail(
      this.state.email,
      result.response.data.result.password,
      this.props.match.params.id
    )
  }

  /**
   * Called when clicking on an 'In Process' Field Partner
   */
  handleClickIP = id => {
    this.props.history.push('/dashboard/pm/' + id)
  }

  /**
   * Called when clicking on a 'New Parter' Field Partner
   */
  handleClickNew = id => {
    this.props.history.push('/setup/' + id)
  }

  /**
   * Called from the 'Complete' Field Partner modal when the user wants to just view the corresponding dashboard
   */
  handleClickComplete = () => {
    this.props.history.push('/dashboard/pm/' + this.state.complete_id)
  }

  /**
   * Called from the 'Complete' Field Partner modal when the user wants to restart the process
   */
  async handleClickCompleteRestart() {
    this.completeToggle()
    let id = this.state.complete_id
    await deleteDocumentsByFP(id)
    await updateFPInstructions(id, '')
    this.props.history.push('/setup/' + id)
  }

  languages = {
    English: {
      addFP: 'Add new field partner',
      orgName: 'Organization name:',
      enterOrgName: "Enter the field partner's organization name here...",
      email: 'Email:',
      enterEmail: "Enter the field partner's email here...",
      create: 'Create',
      confirm:
        'Are you sure you want to restart the process? This will delete all documents associated with this field partner.',
      exit: 'Exit',
      view: 'View dashboard',
      restart: 'Restart process',
      add: 'Add new',
      inProcess: 'In process',
      newPartner: 'New partner',
      complete: 'Complete',
      search: 'Search for a field partner...',
      fieldPartners: 'Field Partners'
    },
    Spanish: {
      addFP: 'Add new field partner (Spanish)',
      orgName: 'Organization name: (Spanish)',
      enterOrgName: "Enter the field partner's organization name here... (Spanish)",
      email: 'Email: (Spanish)',
      enterEmail: "Enter the field partner's email here... (Spanish)",
      create: 'Create (Spanish)',
      confirm:
        'Are you sure you want to restart the process? This will delete all documents associated with this field partner. (Spanish)',
      exit: 'Exit (Spanish)',
      view: 'View dashboard (Spanish)',
      restart: 'Restart process (Spanish)',
      add: 'Add new (Spanish)',
      inProcess: 'In process (Spanish)',
      newPartner: 'New partner (Spanish)',
      complete: 'Complete (Spanish)',
      search: 'Search for a field partner... (Spanish)',
      fieldPartners: 'Field Partners (Spanish)'
    },
    French: {
      addFP: 'Add new field partner (French)',
      orgName: 'Organization name: (French)',
      enterOrgName: "Enter the field partner's organization name here... (French)",
      email: 'Email: (French)',
      enterEmail: "Enter the field partner's email here... (French)",
      create: 'Create (French)',
      confirm:
        'Are you sure you want to restart the process? This will delete all documents associated with this field partner. (French)',
      exit: 'Exit (French)',
      view: 'View dashboard (French)',
      restart: 'Restart process (French)',
      add: 'Add new (French)',
      inProcess: 'In process (French)',
      newPartner: 'New partner (French)',
      complete: 'Complete (French)',
      search: 'Search for a field partner... (French)',
      fieldPartners: 'Field Partners (French)'
    },
    Portuguese: {
      addFP: 'Add new field partner (Portuguese)',
      orgName: 'Organization name: (Portuguese)',
      enterOrgName: "Enter the field partner's organization name here... (Portuguese)",
      email: 'Email: (Portuguese)',
      enterEmail: "Enter the field partner's email here... (Portuguese)",
      create: 'Create (Portuguese)',
      confirm:
        'Are you sure you want to restart the process? This will delete all documents associated with this field partner. (Portuguese)',
      exit: 'Exit (Portuguese)',
      view: 'View dashboard (Portuguese)',
      restart: 'Restart process (Portuguese)',
      add: 'Add new (Portuguese)',
      inProcess: 'In process (Portuguese)',
      newPartner: 'New partner (Portuguese)',
      complete: 'Complete (Portuguese)',
      search: 'Search for a field partner... (Portuguese)',
      fieldPartners: 'Field Partners (Portuguese)'
    }
  }

  render() {
    let text = this.languages[this.props.language]
    if (!text) {
      text = this.languages['English']
    }

    return (
      <div className="page background-circles-green maxheight">
        <Navbar />
        <Modal isOpen={this.state.newModal} toggle={this.newToggle}>
          <ModalHeader>{text.addFP}</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleNewFP}>
              <label className="margin-top-sm">{text.orgName}</label>
              <Input
                className="modal-input-master"
                type="text"
                value={this.state.org_name}
                size="50"
                placeholder={text.enterOrgName}
                onChange={this.handleNameChange}
              />
              <label className="margin-top-sm">{text.email}</label>
              <Input
                className="modal-input-master"
                type="text"
                value={this.state.email}
                size="50"
                placeholder={text.enterEmail}
                onChange={this.handleEmailChange}
              />
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.newToggle}>Exit</Button>
            <Button type="submit" onClick={this.handleNewFP} color="success ">
              {text.create}
            </Button>
          </ModalFooter>
        </Modal>
        {this.state.responseMessage ? (
          <Modal isOpen={this.state.errorModal} toggle={this.errorToggle}>
            <ModalHeader>Error</ModalHeader>
            <ModalBody>{this.state.responseMessage}</ModalBody>
            <ModalFooter>
              <Button onClick={this.errorToggle}>Exit</Button>
            </ModalFooter>
          </Modal>
        ) : null}
        <Modal isOpen={this.state.completeModal} toggle={this.completeToggle}>
          <ModalHeader>{text.confirm}</ModalHeader>
          <ModalFooter>
            <Button onClick={this.completeToggle}>{text.exit}</Button>
            <Button onClick={this.handleClickComplete} color="primary">
              {text.view}
            </Button>
            <Button onClick={this.handleClickCompleteRestart} color="success">
              {text.restart}
            </Button>
          </ModalFooter>
        </Modal>

        <Container className="maxheight">
          <Tabs className="tab-master maxheight">
            <Row className="maxheight">
              <Col className="text-centered sidebar-background" sm="12" md="2">
                <Button className="add-doc-text" id="new-fp-button" onClick={this.newToggle}>
                  <img className="addImg" src={add} alt="Add icon" />
                  <span>{text.add}</span>
                </Button>
                <TabList className="react-tabs__tab-list">
                  <Tab>{text.inProcess}</Tab>
                  <Tab>{text.newPartner}</Tab>
                  <Tab>{text.complete}</Tab>
                </TabList>
              </Col>

              <Col className="fp-background" sm="12" md="10">
                <Row className="text-centered">
                  <Col md="12">
                    <h2 className="margin-top-sm">{text.fieldPartners}</h2>
                    <Form onSubmit={this.handleSubmit}>
                      <img src={search} width="23" alt="Search icon" />
                      <span>
                        <input
                          className="input-master margin-bottom-xs margin-top-xs"
                          type="text"
                          value={this.state.query}
                          placeholder={text.search}
                          onChange={this.handleQueryChange}
                        />
                      </span>
                    </Form>
                  </Col>
                </Row>

                <Row>
                  <TabPanel>
                    <div className="partnerPanel">
                      {this.state.filtered
                        .filter(partner => partner.app_status === 'In Process')
                        .map(partner => {
                          return (
                            <Col md="6" className="panel-tabletbreak" key={partner._id}>
                              <Button
                                className="partnerButton"
                                color="transparent"
                                onClick={() => this.handleClickIP(partner._id)}
                              >
                                <PartnerBar partner={partner} />
                              </Button>
                            </Col>
                          )
                        })}
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="partnerPanel">
                      {this.state.filtered
                        .filter(partner => partner.app_status === 'New Partner')
                        .map(partner => {
                          return (
                            <Col md="6" className="panel-tabletbreak" key={partner._id}>
                              <Button
                                className="partnerButton"
                                color="transparent"
                                onClick={() => this.handleClickNew(partner._id)}
                              >
                                <PartnerBar partner={partner} />
                              </Button>
                            </Col>
                          )
                        })}
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="partnerPanel">
                      {this.state.filtered
                        .filter(partner => partner.app_status === 'Complete')
                        .map(partner => {
                          return (
                            <Col md="6" className="panel-tabletbreak" key={partner._id}>
                              <Button
                                className="partnerButton"
                                color="transparent"
                                onClick={() => this.completeToggle(partner._id)}
                              >
                                <PartnerBar partner={partner} />
                              </Button>
                            </Col>
                          )
                        })}
                    </div>
                  </TabPanel>
                </Row>
              </Col>
            </Row>
          </Tabs>
        </Container>
      </div>
    )
  }
}

/**
 * Component containing information about a single partner
 */
class PartnerBar extends Component {
  /**
   * Calculates percentages of each state of a document and puts it into a progress bar
   * In addition prints all info of a field partner
   */
  render() {
    const partner = this.props.partner
    const documents = partner.documents

    const dueDate = new Date(partner.due_date)
    let displayDate =
      dueDate.getMonth() +
      1 +
      '/' +
      dueDate.getDate() +
      '/' +
      dueDate
        .getFullYear()
        .toString()
        .substring(2)

    let approved = 0
    let pending = 0
    let rejected = 0
    let rest = 0

    // counts number of documents in eachS
    let len = documents.length
    for (const document in documents) {
      let item = documents[document].status
      if (item === 'Approved') {
        approved += 1
      } else if (item === 'Pending') {
        pending += 1
      } else if (item === 'Rejected') {
        rejected += 1
      }
    }

    // turns into percentage values
    if (len > 0) {
      approved = Math.floor((approved / len) * 100)
      pending = Math.floor((pending / len) * 100)
      rejected = Math.floor((rejected / len) * 100)
      rest = 100 - approved - pending - rejected
    } else {
      rest = 100
    }

    return (
      <div className="partnerBox">
        <div className="duedate">
          <div className="due">Due</div>
          {displayDate}
        </div>
        <div className="partner-icon">
          <p className="partner-org-initials">{partner.org_name[0]}</p>
        </div>
        <div className="nameProgressDisplay">
          <p>{partner.org_name}</p>
          <div className="progressAdditional">
            {approved}%
            <Progress multi>
              <Progress bar color="dashgreen" value={approved} />
              <Progress bar color="dashorange" value={pending} />
              <Progress bar color="dashred" value={rejected} />
              <Progress bar color="dashgrey" value={rest} />
            </Progress>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithAuth(PMMainPage))
