import React from 'react'
import { Selector } from './Selector'
import { getAllDocumentClasses } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import '../styles/selectdocuments.css'
import search from '../media/search.png'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class SelectDocumentsPage extends React.Component {
  constructor(props) {
    super(props)
    var today = new Date()
    this.state = {
      // all docClasses
      documentClasses: [],
      available: {},
      // filtered DocClasses as the key with availability as the value
      filtered: {},
      // due date to be set by user so that it can be passed on, set to today (from date-picker)
      DueDate: today,
      // state that updates depending on what the user types in query bar
      query: ''
    }
  }

  /**
   * Gets all document classes from the backend and updates state
   */
  async componentDidMount() {
    let document_classes = await getAllDocumentClasses()

    let available = {}
    for (const index in document_classes) {
      available[document_classes[index].name] = true
    }

    let filtered = available

    this.setState({ documentClasses: document_classes, available: available, filtered: filtered })
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
    if (query === '') {
      newState['filtered'] = this.state.available
    } else {
      newState['filtered'] = Object.keys(this.state.available)
        .filter(name => name.toLowerCase().includes(query))
        .reduce((obj, key) => {
          obj[key] = this.state.available[key]
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
    let new_selection = !this.state.available[value]
    var newState = this.state
    newState['available'][value] = new_selection
    if (value in this.state.filtered) {
      newState['filtered'][value] = new_selection
    }
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
      <div>
        <div className="topBar">
          <div className="iconTop">
            <p className="iconInfo">FP</p>
          </div>
          <div className="partnernamebox">
            <h3 className="partnername">Fieldy McPartnerson</h3>
          </div>
        </div>

        <div className="pageSD">
          <h1>Select Documents</h1>

          <form onSubmit={this.handleSubmit}>
            <img src={search} width="18" />
            <input
              className="input-master"
              type="text"
              value={this.state.query}
              placeholder="Search For Documents Here"
              onChange={this.handleQueryChange}
            />
          </form>

          <div className="displayView">
            <div className="displayCell blockCustom">
              <Selector
                name="Available"
                documents={this.state.documentClasses.filter(
                  docClass => this.state.filtered[docClass.name]
                )}
                update={this.changeSelection}
              />
            </div>

            <div className="blockCustom displayCell">
              <Selector
                name="Selected"
                documents={this.state.documentClasses.filter(
                  docClass => this.state.filtered[docClass.name] === false
                )}
                update={this.changeSelection}
              />
            </div>
          </div>

          <div className="blockCustom dateDisplay">
            Set a Due Date:
            <DatePicker
              selected={this.state.DueDate}
              onChange={this.newDueDate}
              className="datePicker"
            />
          </div>

          <button className="nextButton">Next</button>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(SelectDocumentsPage)
