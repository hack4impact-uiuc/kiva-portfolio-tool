import React, { Component } from 'react'
import { Selector } from './Selector'
import { getAllDocumentClasses } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      //put actions here
    },
    dispatch
  )
}
class SelectDocumentsPage extends React.Component {
  constructor(props) {
    super(props)
    var today = new Date()
    this.state = {
      docClass: {},
      filtered: {},
      DueDate: today,
      query: ''
    }
  }

  async componentDidMount() {
    let documents = await getAllDocumentClasses()
    this.setState(this.updateDocumentClasses(documents))
  }

  updateDocumentClasses(res) {
    if (res) {
      let docList = {}
      for (var i of res) {
        docList[i] = 'Available'
      }
      return {
        docClass: docList,
        filtered: docList
      }
    } else {
      return {
        docClass: {}
      }
    }
  }

  handleQueryChange = event => {
    let newState = this.state
    let query = event.target.value.toLowerCase()
    newState['query'] = query
    newState['filtered'] = {}
    if (query == '') {
      newState['filtered'] = this.state.docClass
    } else {
      newState['filtered'] = Object.keys(this.state.docClass)
        .filter(key => key.toLowerCase().includes(query))
        .reduce((obj, key) => {
          obj[key] = this.state.docClass[key]
          return obj
        }, {})
    }
    this.setState(newState)
  }

  changeSelection = value => {
    let new_selection
    if (this.state.docClass[value] == 'Selected') {
      new_selection = 'Available'
    } else {
      new_selection = 'Selected'
    }
    var newState = {}
    newState = this.state
    newState['docClass'][value] = new_selection
    newState['filtered'][value] = new_selection
    this.setState(newState)
  }

  newDueDate = date => {
    this.setState({
      DueDate: date
    })
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Select Documents</h2>

        <form onSubmit={this.handleSubmit}>
          <label>
            Q:
            <input
              type="text"
              value={this.state.query}
              placeholder="Search For Documents Here"
              onChange={this.handleQueryChange}
            />
          </label>
        </form>

        <div>
          <Selector
            name="Available"
            documents={this.state.filtered}
            update={this.changeSelection}
          />
        </div>

        <div>
          <Selector name="Selected" documents={this.state.filtered} update={this.changeSelection} />
        </div>

        <p>
          {' '}
          Set a Due Date:
          <DatePicker selected={this.state.DueDate} onChange={this.newDueDate} />
        </p>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectDocumentsPage)
