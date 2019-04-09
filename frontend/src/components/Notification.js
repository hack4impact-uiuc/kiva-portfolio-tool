import React, { Component } from 'react'
// import DateTimePicker from 'react-datetime-picker';
import { ListGroupItem } from 'reactstrap'
import '../styles/notification.css'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class Notification extends Component {
  constructor(props) {
    super(props)
  }

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
      </ListGroupItem>
    )
  }
}

export default connect(mapStateToProps)(Notification)
