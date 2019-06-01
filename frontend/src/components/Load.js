import React, { Component } from 'react'
import Loader from 'react-loader-spinner'

import { connect } from 'react-redux'

import '../styles/load.scss'

const mapStateToProps = state => ({
  loading: state.user.loading
})

/**
 * This component shows up whenever the website is waiting
 * for anything to load from the database
 */
class Load extends Component {
  render() {
    if (this.props.loading) {
      return (
        <div className="load" style={{ paddingTop: '15%' }}>
          <h1>Loading</h1>
          <Loader type="Puff" color="#4FAF4E" height="10%" width="10%" />
        </div>
      )
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps)(Load)
