import React, { Component } from 'react'
import Select from 'react-select'
import { components } from 'react-select'

import english_img from '../media/english.png'
import french_img from '../media/french.png'
import spanish_img from '../media/spanish.png'
import portuguese_img from '../media/portuguese.png'

import '../styles/navbar.scss'

const languages = [
  { value: 'english', label: 'English (US)', flag: english_img },
  { value: 'french', label: 'French', flag: french_img },
  { value: 'spanish', label: 'Spanish', flag: spanish_img },
  { value: 'portuguese', label: 'Portuguese', flag: portuguese_img }
]

const { Option } = components
const IconOption = props => (
  <Option {...props} className="flag-container">
    {props.data.label}
    <img className="flag-space" src={props.data.flag} alt="Flag icon" />
  </Option>
)

/**
 * This component gives the ability to select several different languages for its users
 */
export class LanguageSelector extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: null
    }
  }

  componentDidMount = selectedOption => {
    this.setState({ selectedOption })
  }

  render() {
    const { selectedOption } = this.state
    return (
      <Select
        placeholder={languages[0].label}
        value={selectedOption}
        onChange={this.handleChange}
        options={languages}
        components={{ Option: IconOption }}
        className="langSelect"
      />
    )
  }
}

export default LanguageSelector
