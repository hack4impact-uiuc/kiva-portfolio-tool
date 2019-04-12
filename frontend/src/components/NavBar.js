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
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom';
import k_logo from "../media/greenK.png"
import kiva_logo from '../media/kivaPlainLogo.png'
import info_image from '../media/gray_info.png'
import sandwich_image from '../media/sandwich.png'
import english from '../media/english.png'
import '../styles/navbar.css'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

const NavBarComponent = withRouter(props => <NavBar {...props}/>);

class NavBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoginPage: true
    }
  }

  SomeMethod () {
    const {pathname} = this.props.location;
  }

  render() {
    const { isPM } = this.props
    return (
      <div>
        <Navbar color="white" light expand="md">
            {this.state.isLoginPage && (
              <NavbarBrand href="/">
                <img src={k_logo} width="50" height="50" />
              </NavbarBrand>
            )}

            {this.state.isLoginPage && (
              <Nav className="ml-auto" navbar>
                <NavItem>
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      <img src={english} width="35" height="35" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      {isPM && <DropdownItem>Manage Documents</DropdownItem>}
                      <DropdownItem>Log Out</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
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
                <NavItem>
                  <Button color="clear">
                    <img src={info_image} width="29" height="29" />
                  </Button>
                </NavItem>

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

export default connect(mapStateToProps)(NavBar)
