import React, { Component } from 'react'
import { Button, DropdownToggle, DropdownMenu, DropdownItem,
        Nav, Navbar, NavbarBrand, NavItem, NavbarToggler, UncontrolledDropdown } from 'reactstrap';
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class NavBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    const { isPM } = this.props
    return (
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">kiva</NavbarBrand>
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