import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class Notification extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: this.props.name,
      time: this.props.document,
      description: this.props.description
    }
  }

  render() {
    const { isPM } = this.props
    return (
      <div>
        <p class="name"> <b> {this.state.name} </b> </p>
        <p> {this.state.time} </p>
        <p class="description"> {this.state.description} </p>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Notification)