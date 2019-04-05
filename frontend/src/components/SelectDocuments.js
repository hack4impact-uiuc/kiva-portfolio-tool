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
      // all docClasses
      docClass: {},
      // docClasses filtered from docClasses using query
      filtered: {},
      // due date to be set by user so that it can be passed on
      DueDate: today,
      // state that updates depending on what the user types in query bar
      query: ''
    }
  }

  /**
   * Gets all document classes from the backend and updates state
   */
  async componentDidMount() {
    let documents = await getAllDocumentClasses()
    this.setState(this.updateDocumentClasses(documents))
  }

  /**
   *
   * @param {*} res is the list of documents received from backend
   * In states docClass and filtered, set every doc received in an available state
   */
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

  /***
   * Takes in an event, ie query changing.
   * Sets query in state to be equal to query in frontend form
   * Filters docClasses depending on query and stores it into filtered
   * Updates the state
   */
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

  /**
   * On click function to change the value of any docClass
   * Selected -> Available
   * Available -> Selected
   * Updates both filter and docClass
   */
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

  /**
   * Updates due date in state to the user selected date
   */
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
