import React, { Component } from 'react'
import { ListGroupItem } from 'reactstrap'
import '../styles/notification.css'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

export class Notification extends Component {
  render() {
    const { isPM } = this.props
    return (
      <ListGroupItem>
        <p className="person-name">
          {' '}
          <b> {this.props.name} </b>{' '}
        </p>
        <p className="time"> {this.props.time} </p>
        <p className="notif-description"> {this.props.description} </p>
        <button
          onClick={() => {
            this.props.removeMessage(this.props.index)
          }}
        >
          X
        </button>
      </ListGroupItem>
    )
  }
}

export default connect(mapStateToProps)(Notification)
