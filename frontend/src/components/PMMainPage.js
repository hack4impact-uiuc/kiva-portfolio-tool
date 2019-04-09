import { React, Component } from 'react'
import { getAllPartners } from '../utils/ApiWrapper'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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
class PMMainPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      partners: [],
      filtered: [],
      query: ''
    }
  }

  async componentDidMount() {
    let partners = await getAllPartners()
    this.setState(this.loadPartners(messages))
  }

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

  handleQueryChange = event => {
    let newState = this.state
    let query = event.target.value.toLowerCase()
    newState['query'] = query
    newState['filtered'] = []
    if (query == '') {
      newState['filtered'] = this.state.partners
    } else {
      newState['filtered'] = this.state.partners
        .filter(partner => partner.name.toLowerCase().includes(query))
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
            <Tab>Reviewing</Tab>
            <Tab>Dormant</Tab>
          </TabList>

          <TabPanel>
          <div>
            {this.state.filtered
              .filter(partner => partner.status != "Dormant")
              .map(partner => {
                <PartnerBar partner={partner}/>
            })}
          </div>                   
          </TabPanel>

          <TabPanel>
            <div>
              {this.state.filtered
                .filter(partner => partner.status == "Dormant")
                .map(partner => {
                  <PartnerBar partner={partner}/>
              })}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}

class PartnerBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      partner: this.props.partner,
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
