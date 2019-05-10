import React, { Component } from 'react'
import { getAllPartners, createFieldPartner, getAllPMs } from '../utils/ApiWrapper'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { bindActionCreators } from 'redux'
import { beginLoading, endLoading } from '../redux/modules/auth'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
  Progress,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import '../styles/partnerbar.css'
import search from '../media/search.png'
import Navbar from './NavBar'

import add from '../media/add.png'
// same button styling as in document class page
// 'Add New Doc Class' button styling the same
import '../styles/documentclasspage.css'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      beginLoading,
      endLoading
    },
    dispatch
  )
}

export class PMMainPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      partners: [],
      filtered: [],
      query: '',
      email: '',
      org_name: '',
      modal: false,
      pm_id: null
    }
    this.toggle = this.toggle.bind(this)
    this.handleNewFP = this.handleNewFP.bind(this)
    this.handleClickIP = this.handleClickIP.bind(this)
    this.handleClickNew = this.handleClickNew.bind(this)
  }

  /**
   * Waits for component to load and get all the partners attached to pm
   */
  async componentDidMount() {
    this.props.beginLoading()
    let partners = await getAllPartners()
    this.setState(this.loadPartners(partners))
    let pms = await getAllPMs()
    let pm = pms[0]
    this.setState({ pm_id: pm._id })
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
    if (query == '') {
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

  toggle = () => {
    this.setState({ modal: !this.state.modal })
  }

  async handleNewFP() {
    this.props.beginLoading()
    this.toggle()
    await createFieldPartner(this.state.org_name, this.state.email, this.state.pm_id)
    let partners = await getAllPartners()
    this.setState(this.loadPartners(partners))
    this.props.endLoading()
  }

  handleClickIP = id => {
    this.props.history.push('/dashboard/pm/' + id)
  }

  handleClickNew = id => {
    this.props.history.push('/selectdocumentspage/' + id)
  }

  render() {
    return (
      <div className="page maxheight">
        <Navbar />
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader>Add New Field Partner</ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleNewFP}>
              <p>Organization Name:</p>
              <input
                type="text"
                value={this.state.name}
                size="50"
                placeholder="Enter the Field Partner's organization name here..."
                onChange={this.handleNameChange}
              />
              <p>Email:</p>
              <input
                type="text"
                value={this.state.email}
                size="50"
                placeholder="Enter the Field Partner's email here..."
                onChange={this.handleEmailChange}
              />
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.toggle}>Exit</Button>
            <Button onClick={this.handleNewFP}>Create</Button>
          </ModalFooter>
        </Modal>

        <Container className="maxheight">
          <Tabs className="tab-master maxheight">
            <Row className="maxheight">
              <Col className="sidebar-background" sm="12" md="2">
                <TabList className="react-tabs__tab-list">
                  <Button
                    className="add-doc-text maxWidthFull"
                    id="new-fp-button"
                    onClick={this.toggle}
                  >
                    <img className="addImg" id="new-fp-button-img" src={add} />
                    <span className="add-doc-text" id="new-fp-button-text">
                      Add New
                    </span>
                  </Button>
                  <Tab>In Process</Tab>
                  <Tab>New Partner</Tab>
                  <Tab>Complete</Tab>
                </TabList>
              </Col>

              <Col className="fp-background maxheight" sm="12" md="10">
                <Row className="text-centered">
                  <Col md="10">
                    <h2 className="margin-top-sm">Field Partners</h2>
                    <form onSubmit={this.handleSubmit}>
                      <img src={search} width="23" />
                      <span>
                        <input
                          className="input-master margin-bottom-xs margin-top-xs"
                          type="text"
                          value={this.state.query}
                          placeholder="Search for a Field Partner..."
                          onChange={this.handleQueryChange}
                        />
                      </span>
                    </form>
                  </Col>
                </Row>

                <TabPanel>
                  <div className="partnerPanel">
                    {this.state.filtered
                      .filter(partner => partner.app_status == 'In Process')
                      .map(partner => {
                        return (
                          <Button
                            className="partnerButton"
                            color="transparent"
                            onClick={() => this.handleClickIP(partner._id)}
                          >
                            <PartnerBar partner={partner} />
                          </Button>
                        )
                      })}
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="partnerPanel">
                    {this.state.filtered
                      .filter(partner => partner.app_status == 'New Partner')
                      .map(partner => {
                        return (
                          <Button
                            className="partnerButton"
                            color="transparent"
                            onClick={() => this.handleClickNew(partner._id)}
                          >
                            <PartnerBar partner={partner} />
                          </Button>
                        )
                      })}
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="partnerPanel">
                    {this.state.filtered
                      .filter(partner => partner.app_status == 'Complete')
                      .map(partner => {
                        return (
                          <Button
                            className="partnerButton"
                            color="transparent"
                            onClick={() => this.handleClickNew(partner._id)}
                          >
                            <PartnerBar partner={partner} />
                          </Button>
                        )
                      })}
                  </div>
                </TabPanel>
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
  constructor(props) {
    super(props)
  }

  /**
   * Calculates percentages of each state of a document and puts it into a progress bar
   * In addition prints all info of a field partner
   */
  render() {
    const partner = this.props.partner
    const documents = partner.documents

    let approved = 0
    let pending = 0
    let rejected = 0
    let rest = 0

    // counts number of documents in eachS
    let len = documents.length
    for (const document in documents) {
      let item = documents[document].status
      if (item == 'Approved') {
        approved += 1
      } else if (item == 'Pending') {
        pending += 1
      } else if (item == 'Rejected') {
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
          {partner.duedate}
        </div>
        <div className="partner-icon">
          <p className="partner-org-initials">{partner.org_name[0]}</p>
        </div>
        <div className="nameProgressDisplay">
          <div>{partner.org_name}</div>
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
)(PMMainPage)
