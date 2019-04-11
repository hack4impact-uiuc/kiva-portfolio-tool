import React, { Component } from 'react'
import { Button, DropdownToggle, DropdownMenu, DropdownItem,
        Nav, Navbar, NavbarBrand, NavItem, NavbarToggler, UncontrolledDropdown } from 'reactstrap'
import { connect } from 'react-redux'
import kiva_logo from "../media/kivaPlainLogo.png"

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class NavBar extends Component {
  constructor(props) {
    super(props)
    // var logo = (
    //   <span class="logo">
    //     <a href="/">
    //       <img src="../media/kivaPlainLogo.png" height="10" width="50" alt="text here" /></a>
    //   </span>
    // );
    
    this.state = {
    }
  }

  render() {
    const { isPM } = this.props
    return (
        <div>
            <Navbar color="white" light expand="md">
                <NavbarBrand href="/">
                  <img src={kiva_logo} width="87" height="45"/>
                </NavbarBrand>
                    <Nav className="ml-auto" navbar>

                      <NavItem>
                        <Button> bell </Button>
                      </NavItem>

                      <NavItem>
                        <Button> i </Button>
                      </NavItem>

                      <NavItem>
                        <UncontrolledDropdown nav inNavbar>
                          <DropdownToggle nav caret>
                            =
                          </DropdownToggle>
                          <DropdownMenu right>
                            {isPM && (
                              <DropdownItem>
                                Manage Documents
                              </DropdownItem>
                            )}
                            <DropdownItem>
                              Log Out
                            </DropdownItem>
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