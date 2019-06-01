import React, { Component } from 'react'
import {
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  UncontrolledDropdown
} from 'reactstrap'
import { withRouter } from 'react-router-dom'
import Sidebar from 'react-sidebar'

import { connect } from 'react-redux'

import LanguageSelector from './LanguageSelector'
import NotificationsBar from './NotificationsBar'

import k_logo from '../media/greenK.png'
import kiva_logo from '../media/kivaPlainLogo.png'
import info_image from '../media/gray_info.png'
import sandwich_image from '../media/sandwich.png'
import { removeCookie } from '../utils/cookie'
import { getUser, getFPByEmail, getPMByEmail } from '../utils/ApiWrapper'

import '../styles/navbar.scss'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

const sidebarClassName = ['closed', 'opened']

/**
 * This is the Navigation Bar that exist at the top of all screens once logged in
 * It contains
 * A bell icon to access the Notifications Bar
 * A sandwich icon to access a menu of other things
 */
export class NavBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoginPage: null,
      sidebarOpen: false,
      sidebarClass: sidebarClassName[0],
      role: '',
      email: '',
      wrongInfo: '',
      errorMessage: ''
    }

    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this)
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open })

    if (this.state.sidebarClass === sidebarClassName[0]) {
      this.setState({ sidebarClass: sidebarClassName[1] })
    } else {
      this.setState({ sidebarClass: sidebarClassName[0] })
    }
  }

  logout = () => {
    removeCookie('token')
    this.props.history.push('/')
  }

  redirect = async e => {
    if (this.state.role === 'fp') {
      let fp = await getFPByEmail(this.state.email)
      this.props.history.push('/dashboard/fp/' + fp._id)
    } else {
      let pm = await getPMByEmail(this.state.email)
      this.props.history.push('/overview/' + pm._id)
    }
  }

  async componentDidMount() {
    if (
      this.props.location.pathname !== '/' &&
      this.props.location.pathname !== '/register' &&
      this.props.location.pathname !== '/forgotPassword' &&
      this.props.location.pathname !== '/login'
    ) {
      this.setState({ isLoginPage: false })
    } else {
      this.setState({ isLoginPage: true })
    }

    const result = await getUser()
    if (
      result.error != null &&
      (result.error.response.status === 400 || result.error.response.status === 500)
    ) {
      this.setState({
        wrongInfo: !this.state.wrongInfo,
        errorMessage: result.error.response.data.message
      })
      return
    }

    this.setState({
      role: result.response.data.result.userRole,
      email: result.response.data.result.email
    })
  }

  render() {
    const { isPM } = this.props
    return (
      <div>
        {this.state.sidebarOpen ? (
          <Sidebar
            className={this.state.sidebarClass}
            rootClassName="sidebar-root"
            sidebarClassName="sidebar-styles"
            sidebar={
              <NotificationsBar
                closeFunc={this.onSetSidebarOpen}
                inDashboard={this.props.inDashboard}
              />
            }
            open={this.state.sidebarOpen}
            onSetOpen={this.onSetSidebarOpen}
            pullRight={true}
          />
        ) : (
          <Sidebar
            className={this.state.sidebarClass}
            rootClassName="sidebar-root hide"
            sidebarClassName="sidebar-styles"
            sidebar={
              <NotificationsBar
                closeFunc={this.onSetSidebarOpen}
                inDashboard={this.props.inDashboard}
              />
            }
            onSetOpen={this.onSetSidebarOpen}
            pullRight={true}
          />
        )}

        <Navbar className={this.props.className} color="white" light expand="md">
          {this.state.isLoginPage && (
            <NavbarBrand href="/">
              <img className="kivalogo" src={k_logo} width="60" height="60" alt="Kiva logo" />
            </NavbarBrand>
          )}

          {this.state.isLoginPage && (
            <Nav className="ml-auto margin-right-sm">
              <NavItem>
                <LanguageSelector />
              </NavItem>
            </Nav>
          )}

          {!this.state.isLoginPage && (
            <NavbarBrand onClick={this.redirect}>
              <img className="kivalogo" src={kiva_logo} width="90" height="50" alt="Kiva logo" />
            </NavbarBrand>
          )}

          {!this.state.isLoginPage && (
            <Nav className="ml-auto" navbar pullRight>
              <NavItem>
                <Button color="clear" onClick={() => this.onSetSidebarOpen(true)}>
                  <img src={info_image} width="29" height="29" alt="Info icon" />
                </Button>
              </NavItem>

              <NavItem className="sandwich">
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    <img src={sandwich_image} width="30" height="35" alt="Sandwich icon" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    {isPM && (
                      <div>
                        <DropdownItem onClick={() => this.props.history.push('/documentclasses')}>
                          Manage Documents
                        </DropdownItem>
                        <DropdownItem onClick={this.redirect}>Dashboard</DropdownItem>
                      </div>
                    )}
                    <DropdownItem onClick={() => this.props.history.push('/changePassword')}>
                      Change Password
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => this.props.history.push('/changeSecurityQuestion')}
                    >
                      Change Security Question
                    </DropdownItem>
                    <DropdownItem onClick={this.logout}>Log Out</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </NavItem>
            </Nav>
          )}
        </Navbar>
      </div>
    )
  }
}

export default connect(mapStateToProps)(withRouter(NavBar))
