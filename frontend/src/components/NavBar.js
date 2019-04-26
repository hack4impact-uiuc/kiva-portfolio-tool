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
import '../styles/navbar.scss'
import Sidebar from 'react-sidebar'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class NavBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoginPage: null,
      sidebarOpen: false
    };

    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  componentDidMount() {
    if (this.props.location.pathname != '/') {
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
          rootClassName="sidebar-root"
          sidebarClassName="sidebar-sidebar"
          contentClassName="sidebar-content"
          
          sidebar={<NotificationsBar></NotificationsBar>}
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          styles={{ sidebar: { background: "white" } }} />
        <Navbar color="white" light expand="md">
          {this.state.isLoginPage && (
            <NavbarBrand href="/">
              <img src={k_logo} width="60" height="60" />
            </NavbarBrand>
          )}

          {this.state.isLoginPage && (
            <Nav className="ml-auto">
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
                    {isPM && <DropdownItem>Manage Documents</DropdownItem>}
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
