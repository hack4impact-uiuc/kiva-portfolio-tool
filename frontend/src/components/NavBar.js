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
  isPM: state.user.isPM,
  language: state.user.language
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

  languages = {
    English: {
      manage: 'Manage documents',
      changePassword: 'Change password',
      changeSecurityQuestion: 'Change security question',
      logOut: 'Log out'
    },
    Spanish: {
      manage: 'Manage documents (Spanish)',
      changePassword: 'Change password (Spanish)',
      changeSecurityQuestion: 'Change security question (Spanish)',
      logOut: 'Log out (Spanish)'
    },
    French: {
      manage: 'Manage documents (French)',
      changePassword: 'Change password (French)',
      changeSecurityQuestion: 'Change security question (French)',
      logOut: 'Log out (French)'
    },
    Portuguese: {
      manage: 'Manage documents (Portuguese)',
      changePassword: 'Change password (Portuguese)',
      changeSecurityQuestion: 'Change security question (Portuguese)',
      logOut: 'Log out (Portuguese)'
    }
  }

  render() {
    const { isPM } = this.props
    let text = this.languages[this.props.language]
    if (!text) {
      text = this.languages['English']
    }

    return (
      <div>
        {/* Currently the sidebar requires the children prop but seems like it doesn't do too much,
          so I copied the notifications bar component into the childrens prop for now to remove the console error
        */}
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
            children={
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
            children={
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
            <Nav className="ml-auto" id="navbar-vertical-centered" navbar>
              <NavItem className="margin-right-sm">
                <LanguageSelector />
              </NavItem>

              <NavItem>
                <Button id="info-icon" color="clear" onClick={() => this.onSetSidebarOpen(true)}>
                  <img src={info_image} width="29" height="29" alt="Info icon" />
                </Button>
              </NavItem>

              <UncontrolledDropdown className="sandwich" nav inNavbar>
                <DropdownToggle nav caret>
                  <img src={sandwich_image} width="30" height="35" alt="Sandwich icon" />
                </DropdownToggle>
                <DropdownMenu right>
                  {isPM && (
                    <div>
                      <DropdownItem onClick={() => this.props.history.push('/documentclasses')}>
                        {text.manage}
                      </DropdownItem>
                      <DropdownItem onClick={this.redirect}>Dashboard</DropdownItem>
                    </div>
                  )}
                  <DropdownItem onClick={() => this.props.history.push('/changePassword')}>
                    {text.changePassword}
                  </DropdownItem>
                  <DropdownItem onClick={() => this.props.history.push('/changeSecurityQuestion')}>
                    {text.changeSecurityQuestion}
                  </DropdownItem>
                  <DropdownItem onClick={this.logout}>{text.logOut}</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          )}
        </Navbar>
      </div>
    )
  }
}

export default connect(mapStateToProps)(withRouter(NavBar))
