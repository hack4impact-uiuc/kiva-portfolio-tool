import React, { Component } from 'react'
import { connect } from 'react-redux'

import BackgroundSlideshow from 'react-background-slideshow'
import Navbar from './NavBar'
import kivaLogo from '../media/kivaPlainLogo.png'

import '../styles/index.css'
import '../styles/login.css'
import '../styles/navbar.css'

class Wrong extends Component {
  render() {
    return (
      <div>
        <p>404: Wrong Information Provided!</p>
      </div>
    )
  }
}
export default connect()(Wrong)
