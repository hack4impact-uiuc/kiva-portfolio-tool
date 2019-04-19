import React, { Component } from 'react'
import { connect } from 'react-redux'
import english_img from '../media/english.png'
import french_img from '../media/french.png'
import spanish_img from '../media/spanish.png'
import portuguese_img from '../media/portuguese.png'
import Select from 'react-select'
import { components } from 'react-select'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/navbar.css'

const languages = [
  { value: 'english', label: 'English (US)', flag: english_img },
  { value: 'french', label: 'French', flag: french_img },
  { value: 'spanish', label: 'Spanish', flag: spanish_img },
  { value: 'portuguese', label: 'Portuguese', flag: portuguese_img }
]

const { Option } = components
const IconOption = props => (
  <Option {...props}>
    {props.data.label}
    <img src={props.data.flag} width="35" height="35" className={'flag'} />
  </Option>
)

class LanguageSelector extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: null
    }
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption })
    console.log(`Option selected:`, selectedOption)
  }

  render() {
    const { isPM } = this.props
    const { selectedOption } = this.state
    return (
      <Select
        width="500"
        height="500"
        placeholder={languages[0].label}
        value={selectedOption}
        onChange={this.handleChange}
        options={languages}
        components={{ Option: IconOption }}
      />
    )
  }
}

export default LanguageSelector
