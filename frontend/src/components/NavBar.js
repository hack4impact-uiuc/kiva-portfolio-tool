import React, { Component } from 'react'
import { Nav, Navbar, NavbarBrand, UncontrolledDropdown } from 'reactstrap';
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

//   toggle() {
//       this.setState({
//           isOpen: !this.state.isOpen
//       });
//   }

  render() {
    const { isPM } = this.props
    return (
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">kiva</NavbarBrand>
                    <Nav className="ml-auto" navbar> 
                        <UncontrolledDropdown nav inNavbar>
                        </UncontrolledDropdown>
                    </Nav>
            </Navbar>
        </div>
    )
  }
}

export default connect(mapStateToProps)(NavBar)