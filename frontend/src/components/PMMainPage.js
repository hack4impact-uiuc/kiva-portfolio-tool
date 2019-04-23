import React, { Component } from 'react'
import { getAllPartners } from '../utils/ApiWrapper'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { connect } from 'react-redux'
import { Progress } from 'reactstrap'
//import '../styles/colors.css'

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
      <div style={{ textAlign: 'center' }}>
        <h2>Field Partners</h2>

        <form onSubmit={this.handleSubmit}>
          <label>
            Q:
            <input
              type="text"
              value={this.state.query}
              placeholder="Search for a Field Partner..."
              onChange={this.handleQueryChange}
            />
          </label>
        </form>

        <Tabs>
          <TabList>
            <Tab>In Process</Tab>
            <Tab>New Partner</Tab>
            <Tab>Complete</Tab>
          </TabList>

          <TabPanel>
            <div>
              {this.state.filtered
                .filter(partner => partner.app_status == 'In Process')
                .map(partner => {
                  return <PartnerBar partner={partner} />
                })}
            </div>
          </TabPanel>

          <TabPanel>
            <div>
              {this.state.filtered
                .filter(partner => partner.app_status == 'New Partner')
                .map(partner => {
                  return <PartnerBar partner={partner} />
                })}
            </div>
          </TabPanel>

          <TabPanel>
            <div>
              {this.state.filtered
                .filter(partner => partner.app_status == 'Complete')
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
      <div>
        <div>Due Date: {partner.duedate}</div>
        <div>ICON/IMAGE HERE</div>
        <div>{partner.org_name}</div>
        <div>
          <Progress multi>
            <Progress bar color="dashgreen" value={approved} />
            <Progress bar color="dashorange" value={pending} />
            <Progress bar color="dashred" value={rejected} />
            <Progress bar color="dashgrey" value={rest} />
          </Progress>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(PMMainPage)
