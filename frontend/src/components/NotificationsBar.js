import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Button, ListGroupItem } from 'reactstrap'
import 'react-tabs/style/react-tabs.css'
import { bindActionCreators } from 'redux'
import Notification from './Notification'
import { connect } from 'react-redux'
import { updateMessages, updateInformation } from '../redux/modules/user'

import '../styles/notifbar.scss'

import close from '../media/greyX.png'

const mapStateToProps = state => ({
  isPM: state.user.isPM,
  allMessages: state.user.messages,
  allInformation: state.user.information
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateMessages,
      updateInformation
    },
    dispatch
  )
}
export class NotificationsBar extends Component {
  constructor(props) {
    super(props)
  }

  /**
   * Helper function that removes messages upon click by index in array
   */
  removeMessage = index => {
    let messages = [...this.props.allMessages]
    messages.splice(index, 1)
    this.props.updateMessages(messages)
  }

  /**
   * Helper function that removes infos upon click by index in array
   */
  removeInformation = index => {
    let information = [...this.props.allInformation]
    information.splice(index, 1)
    this.props.updateInformation(information)
  }

  render() {
    const { isPM } = this.props.isPM
    const allMessages = this.props.allMessages
    const allInformation = this.props.allInformation
    return (
      <Tabs>
        <TabList>
          <Tab className="tab">
            <span className="tab-font">Activity</span>
          </Tab>
          <Tab className="tab">
            <span className="tab-font">Information</span>
          </Tab>
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
          {allInformation.map((info, index) => {
            return (
              <ListGroupItem>
                <div>
                  <div className="instruction">
                    <b>Instruction</b>
                    <p>{info}</p>
                  </div>
                  <div>
                    <Button
                      className="exit-button-wrapper"
                      color="transparent"
                      onClick={() => {
                        this.removeInformation(index)
                      }}
                    >
                      <img className="exit-button" src={close}/>
                    </Button>
                  </div>
                </div>
              </ListGroupItem>
            )
          })}
        </TabPanel>
      </Tabs>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsBar)
