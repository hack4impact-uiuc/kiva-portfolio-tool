import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { bindActionCreators } from 'redux'
import Notification from './Notification'
import { connect } from 'react-redux'
import { updateMessages, updateInformation } from '../redux/modules/user'


const mapStateToProps = state => ({
  isPM: state.user.isPM,
  allMessages: state.user.messages
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateMessages
    },
    dispatch
  )
}
class NotificationsBar extends Component {
  constructor(props) {
    super(props)
  }

  removeMessage = value => {

  }

  render() {
    const { isPM } = this.props.isPM
    const {allMessages} = this.props.allMessages
    return (
      <Tabs>
        <TabList>
          <Tab>Activity</Tab>
          <Tab>Information</Tab>
        </TabList>

        <TabPanel>
          {allMessages.map(message => {
            return (
              <Notification
                name={message.name}
                time={message.time}
                description={message.description}
              />
            )
          })}
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
      </Tabs>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsBar)
