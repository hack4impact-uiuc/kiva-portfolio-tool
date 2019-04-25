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
      filtered: [],
      //docClass: {},
      // docClasses filtered from docClasses using query
      //filtered: {},
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

    for (const index in document_classes) {
      document_classes[index].available = true
    }

    this.setState({ documentClasses: document_classes, filtered: document_classes })
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
    if (query === '') {
      newState['filtered'] = this.state.documentClasses
    } else {
      newState['filtered'] = this.state.documentClasses.filter(documentClass =>
        documentClass.name.includes(query)
      )
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
    // if (this.state.documentClasses[value] === 'Selected') {
    //   new_selection = 'Available'
    // } else {
    //   new_selection = 'Selected'
    // }
    new_selection = !this.state.documentClasses.available
    var newState = {}
    newState = this.state
    newState['documentClasses'][value].available = new_selection
    newState['filtered'][value].available = new_selection
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
                documents={this.state.filtered.filter(docClass => docClass.available)}
                update={this.changeSelection}
              />
            </div>

            <div className="blockCustom displayCell">
              <Selector
                name="Selected"
                documents={this.state.filtered.filter(docClass => !docClass.available)}
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
