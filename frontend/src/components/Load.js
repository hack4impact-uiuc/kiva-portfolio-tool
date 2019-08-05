import React, { Component } from 'react'
import Loader from 'react-loader-spinner'

import { connect } from 'react-redux'

import '../styles/load.scss'

const mapStateToProps = state => ({
  loading: state.user.loading,
  language: state.user.language
})

/**
 * This component shows up whenever the website is waiting
 * for anything to load from the database
 */
class Load extends Component {
  languages = {
    English: {
      loading: 'Loading'
    },
    Spanish: {
      loading: 'Cargando'
    },
    French: {
      loading: 'Téléchargement'
    },
    Portuguese: {
      loading: 'Carregando'
    }
  }

  render() {
    let text = this.languages[this.props.language]
    if (!text) {
      text = this.languages['English']
    }

    if (this.props.loading) {
      return (
        <div
          className="load"
          style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, paddingTop: '15%' }}
        >
          <h1>{text.loading}</h1>
          <Loader type="Puff" color="#4FAF4E" height="10%" width="10%" />
        </div>
      )
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps)(Load)
