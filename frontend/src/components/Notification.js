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
      <>
        <p> <b> {this.state.name} </b> </p>
        <p> {this.state.time} </p>
        <p> {this.state.description} </p>
      </>
    )
  }
}

export default connect(mapStateToProps)(Notification)