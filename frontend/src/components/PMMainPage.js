import React, { Component } from 'react'
import { getAllPartners } from '../utils/ApiWrapper'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { bindActionCreators } from 'redux'
import 'react-tabs/style/react-tabs.css'
import { connect } from 'react-redux'
import { Progress } from 'reactstrap'
import '../styles/colors.css'
import '../styles/partnerbar.css'
import search from '../media/search.png'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class PMMainPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      partners: [],
      filtered: [],
      query: ''
    }
  }

  /**
   * Waits for component to load and get all the partners attached to pm
   */
  async componentDidMount() {
    let partners = await getAllPartners()
    this.setState(this.loadPartners(partners))
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
        partner.name.toLowerCase().includes(query)
      )
    }
    this.setState(newState)
  }

  render() {
    return (
      <div className="page">
        <div>
          <span />
          <p>Fieldy McPartnerson</p>
        </div>
        <h2>Field Partners</h2>

        <form onSubmit={this.handleSubmit}>
          <img src={search} width="18" />
          <input
            className="input-master"
            type="text"
            value={this.state.query}
            placeholder="Search for a Field Partner..."
            onChange={this.handleQueryChange}
          />
        </form>

        <Tabs className="tab-master">
          <TabList className="react-tabs__tab-list">
            <Tab>REVIEWING</Tab>
            <Tab>DORMANT</Tab>
          </TabList>

          <TabPanel>
            <div className="partnerPanel">
              {this.state.filtered
                .filter(partner => partner.status != 'Dormant')
                .map(partner => {
                  return <PartnerBar partner={partner} />
                })}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="partnerPanel">
              {this.state.filtered
                .filter(partner => partner.status == 'Dormant')
                .map(partner => {
                  return <PartnerBar partner={partner} />
                })}
            </div>
          </TabPanel>
        </Tabs>
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
    let approved = 0
    let pending = 0
    let rejected = 0

    // counts number of documents in each
    let len = Object.keys(this.props.partner.documents).length
    for (var key in this.props.partner.documents) {
      let item = this.props.partner.documents[key]
      if (item == 'Approved') {
        approved += 1
      } else if (item == 'Pending') {
        pending += 1
      } else if (item == 'Rejected') {
        rejected += 1
      }
    }

    // turns into percentage values
    approved = Math.floor((approved / len) * 100)
    pending = Math.floor((pending / len) * 100)
    rejected = Math.floor((rejected / len) * 100)
    let rest = 100 - approved - pending - rejected

    return (
      <div className="partnerBox">
        <div className="duedate">
          <div className="due">Due</div>
          {this.props.partner.duedate}
        </div>
        <div className="icon">{this.props.partner.name[0]}</div>
        <div className="nameProgressDisplay">
          <div>{this.props.partner.name}</div>
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

export default connect(mapStateToProps)(PMMainPage)
