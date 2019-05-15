import React, { Component } from 'react'
import { Button, ListGroupItem } from 'reactstrap'
import { connect } from 'react-redux'

import '../styles/notification.css'
import '../styles/partnerbar.css'
import '../styles/notifbar.css'

import close from '../media/greyX.png'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

export class Notification extends Component {
  render() {
    const { isPM } = this.props
    return (
      <ListGroupItem>
        {this.props.name ? (
          <div className="partner-icon">
            <p className="partner-org-initials">{this.props.name[0]}</p>
          </div>
        ) : (
          <div className="kiva-icon">
            <p className="partner-org-initials">k</p>
          </div>
        )}
        <div className="notif-info">
          <p className="person-name">
            {' '}
            <b> {this.props.name} </b>{' '}
          </p>
          <p className="time"> {this.props.time} </p>
          <p className="notif-description"> {this.props.description} </p>
        </div>
        <div>
          <Button
            className="exit-button-wrapper"
            color="transparent"
            onClick={() => {
              this.props.removeMessage(this.props.index)
            }}
          >
            <img className="exit-button" src={close} />
          </Button>
        </div>
      </ListGroupItem>
    )
  }
}

export default connect(mapStateToProps)(Notification)
