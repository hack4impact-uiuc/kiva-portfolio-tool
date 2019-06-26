import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Button } from 'reactstrap'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateMessages } from '../redux/modules/user'

import Notification from './Notification'

import close from '../media/greyX.png'

import '../styles/notifbar.scss'

const mapStateToProps = state => ({
  allMessages: state.user.messages,
  instructions: state.user.instructions,
  language: state.user.language
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateMessages
    },
    dispatch
  )
}

/**
 * The notifcations bar is a two panel tab
 * Contains:
 * Messages or any other notifications such as document submissions, etc.
 * Information sent from a pm/fp to one another
 */
export class NotificationsBar extends Component {
  /**
   * Helper function that removes messages upon click by index in array
   */
  removeMessage = index => {
    let messages = [...this.props.allMessages]
    messages.splice(index, 1)
    this.props.updateMessages(messages)
  }

  closeSidebar = open => {
    this.props.closeFunc(open)
  }

  languages = {
    English: {
      activity: 'Activity',
      instructions: 'Instructions'
    }
  }

  render() {
    const allMessages = this.props.allMessages
    const instructions = this.props.instructions
    let text = this.languages[this.props.language]
    if (!text) {
      text = this.languages['English']
    }

    return (
      <Tabs className="notifications-tabs">
        <TabList>
          <Tab className="tab">
            <span className="tab-font">{text.activity}</span>
          </Tab>
          {this.props.inDashboard ? (
            <Tab className="tab">
              <span className="tab-font">{text.instructions}</span>
            </Tab>
          ) : null}
          <Button
            id={this.props.inDashboard ? 'sidebar-close-button' : 'pm-sidebar-close'}
            color="transparent"
            onClick={() => {
              this.closeSidebar(false)
            }}
          >
            <img className="exit-button" src={close} alt="Edit icon" />
          </Button>
        </TabList>

        <TabPanel>
          {allMessages.map((message, index) => {
            return (
              <Notification
                key={index}
                index={index}
                name={message.name}
                time={message.time}
                description={message.description}
                removeMessage={this.removeMessage}
              />
            )
          })}
        </TabPanel>

        {this.props.inDashboard ? (
          <TabPanel>
            <div className="instruction">
              <b>{text.instructions}</b>
              <p>{instructions}</p>
            </div>
          </TabPanel>
        ) : null}
      </Tabs>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsBar)
