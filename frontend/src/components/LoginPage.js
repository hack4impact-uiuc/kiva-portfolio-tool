import React, { Component }  from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import { bindActionCreators } from 'redux'
import { login, beginLoading, endLoading } from '../redux/modules/verification'

const mapStateToProps = state => ({
  verified: state.verification.verified
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      login,
      beginLoading,
      endLoading
    },
    dispatch
  )
}



class LoginPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			password: '',
			email: ''
		}
	}

	updatePassword = event => {
		this.setState({ password: event.target.value })
	}

	updateEmail = event => {
		this.setState({ email: event.target.value })
	}

	verify = event => {
		this.props.login(this.state.password)
		this.props.beginLoading()
		this.props.endLoading()
	}

	render() {
		return (
			<div>
				<div style={{paddingLeft: '5%'}}
				>
					<p>Kiva</p>
				</div>
				<form onSubmit={this.verify>
					<span> Email: </span>
					<input onChange={this.updateEmail} />
					<br></br>
					<span> Password: </span>
					<input onChange={this.updatePassword} />
					<br></br>
					<Button type="submit" onClick={this.verify}>
						Sign In
					</Button>
				</form>
			</div>
		)
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)