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

  removeMessage = index => {
    let messages = [...this.props.allMessages]
    messages.splice(index, 1)
    this.props.updateMessages(messages)
  }

  render() {
    const { isPM } = this.props.isPM
    const allMessages = this.props.allMessages
    return (
      <Tabs>
        <TabList>
          <Tab>Activity</Tab>
          <Tab>Information</Tab>
        </TabList>

        <TabPanel>
          {allMessages.map((message, index) => {
            return (
              <Notification
                index={index}
                name={message.name}
                time={message.time}
                description={message.description}
                removeMessage={this.removeMessage}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsBar)
