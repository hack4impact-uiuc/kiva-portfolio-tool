import React, { Component } from 'react'
import { connect } from 'react-redux'
//import '../styles/dashboard.css'
//import '../styles/index.css'
import '../styles/load.css'
import Loader from 'react-loader-spinner'

const mapStateToProps = state => ({
  loading: state.auth.loading
})

class Load extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.loading) {
      return (
        <div className="load">
          Loading
          <Loader type="Puff" color="green" height="100" width="100" />
        </div>
      )
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps)(Load)
