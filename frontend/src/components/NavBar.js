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
  NavbarToggler,
  UncontrolledDropdown
} from 'reactstrap'
import { connect } from 'react-redux'
import kiva_logo from '../media/kivaPlainLogo.png'
import notification_bell from '../media/notificationBell.png'
import info_image from '../media/info.svg'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class NavBar extends Component {
  render() {
    const { isPM } = this.props
    return (
      <div>
        <Navbar color="white" light expand="md">
          <NavbarBrand href="/">
            <img src={kiva_logo} width="87" height="45" />
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Button color="clear">
                <img src={notification_bell} width="30" height="30" />
              </Button>
            </NavItem>

            <NavItem>
              <Button color="clear">
                <img src={info_image} width="30" height="30" />
              </Button>
            </NavItem>

            <NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  O
                </DropdownToggle>
                <DropdownMenu right>
                  {isPM && <DropdownItem>Manage Documents</DropdownItem>}
                  <DropdownItem>Log Out</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    )
  }
}

export default connect(mapStateToProps)(NavBar)
