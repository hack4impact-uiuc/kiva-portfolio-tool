import React, { Component } from 'react'
import { connect } from 'react-redux'
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
import LanguageSelector from './LanguageSelector'
import NotificationsBar from './NotificationsBar'
import { withRouter } from 'react-router-dom'
import k_logo from '../media/greenK.png'
import kiva_logo from '../media/kivaPlainLogo.png'
import info_image from '../media/gray_info.png'
import sandwich_image from '../media/sandwich.png'
import Sidebar from 'react-sidebar'
import '../styles/index.css'
import '../styles/navbar.css'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

const sidebarClassName = ['closed', 'opened']

export class NavBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoginPage: null,
      sidebarOpen: false,
      sidebarClass: sidebarClassName[0]
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

  componentDidMount() {
    if (
      this.props.location.pathname != '/' &&
      this.props.location.pathname != '/register' &&
      this.props.location.pathname != '/forgotPassword' &&
      this.props.location.pathname != '/login'
    ) {
      this.setState({ isLoginPage: false })
    } else {
      this.setState({ isLoginPage: true })
    }
  }

  render() {
    const { isPM } = this.props
    return (
      <div>
        <Sidebar
          className={this.state.sidebarClass}
          rootClassName="sidebar-root"
          sidebarClassName="sidebar-styles"
          sidebar={<NotificationsBar />}
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          pullRight={true}
        />

        <Navbar className={this.props.className} color="white" light expand="md">
          {this.state.isLoginPage && (
            <NavbarBrand href="/">
              <img src={k_logo} width="60" height="60" />
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
            <NavbarBrand href="/">
              <img src={kiva_logo} width="90" height="50" />
            </NavbarBrand>
          )}

          {!this.state.isLoginPage && (
            <Nav className="ml-auto" navbar>
              <Button color="clear" onClick={() => this.onSetSidebarOpen(true)}>
                <img src={info_image} width="29" height="29" />
              </Button>

              <NavItem className="sandwich">
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    <img src={sandwich_image} width="30" height="35" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    {isPM && (
                      <DropdownItem onClick={() => this.props.history.push('/documentclasspage')}>
                        Manage Documents
                      </DropdownItem>
                    )}
                    <DropdownItem>Log Out</DropdownItem>
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
