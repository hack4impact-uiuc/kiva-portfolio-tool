import React, { Component }  from 'react'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'


class LoginPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			password: ''
		}
	}

	changedPassword = event => {
		this.setState({ password: event.target.value })
	}

	render() {
		return (
			<div>
				<p>{"Kiva"}</p>
			</div>
		)
	}
}

export default LoginPage