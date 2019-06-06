import React, { Component } from 'react'
import Select from 'react-select'
import { components } from 'react-select'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateLanguage } from '../redux/modules/user'

import english_img from '../media/english.png'
import french_img from '../media/french.png'
import spanish_img from '../media/spanish.png'
import portuguese_img from '../media/portuguese.png'

import '../styles/navbar.scss'

const languages = [
  { value: 'English', label: 'English', flag: english_img },
  { value: 'French', label: 'Français', flag: french_img },
  { value: 'Spanish', label: 'Español', flag: spanish_img },
  { value: 'Portuguese', label: 'Português', flag: portuguese_img }
]

const { Option } = components
const IconOption = props => (
  <Option {...props} className="flag-container">
    {props.data.label}
    <img className="flag-space" src={props.data.flag} alt="Flag icon" />
  </Option>
)

const mapStateToProps = state => ({
  language: state.user.language
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateLanguage
    },
    dispatch
  )
}

/**
 * This component gives the ability to select several different languages for its users
 */
export class LanguageSelector extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = option => {
    this.props.updateLanguage(option.value)
  }

  render() {
    return (
      <Select
        placeholder={this.props.language}
        onChange={this.handleChange}
        options={languages}
        components={{ Option: IconOption }}
        className="langSelect"
      />
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelector)
