import React from 'react'
import { Selector } from './Selector'
import {
  getAllDocumentClasses,
  createDocuments,
  getDocumentsByUser,
  getFPNameByID
} from '../utils/ApiWrapper'
import { updateDocuments } from '../redux/modules/user'
import { beginLoading, endLoading } from '../redux/modules/auth'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DatePicker from 'react-datepicker'
import Navbar from './NavBar'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import '../styles/index.css'
import '../styles/selectdocuments.css'

import search from '../media/search.png'
import WithAuth from './WithAuth'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocuments,
      beginLoading,
      endLoading
    },
    dispatch
  )
}

export class SelectDocumentsPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // all docClasses
      documentClasses: [],
      available: {},
      // filtered DocClasses as the key with availability as the value
      filtered: {},
      // due date to be set by user so that it can be passed on, set to today (from date-picker)
      dueDate: new Date(),
      // state that updates depending on what the user types in query bar
      query: '',
      fp_id: null,
      fp_org_name: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  /**
   * Gets all document classes from the backend and updates state
   */
  async componentDidMount() {
    this.props.beginLoading()
    let document_classes = await getAllDocumentClasses()

    let available = {}
    for (const index in document_classes) {
      available[document_classes[index].name] = true
    }

    let filtered = available
    let fp_info

    if (this.props.match) {
      this.setState({ fp_id: this.props.match.params.id })
      fp_info = await getFPNameByID(this.props.match.params.id)
      this.setState({ fp_org_name: fp_info })
    }

    this.setState({ documentClasses: document_classes, available: available, filtered: filtered })
    this.props.endLoading()
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
      dueDate: date
    })
  }

  async handleSubmit() {
    this.props.beginLoading()
    let docClassIDs = this.state.documentClasses
      .filter(docClass => this.state.available[docClass.name] === false)
      .reduce((array, docClass) => {
        array.push(docClass._id)
        return array
      }, [])

    const date =
      this.state.dueDate.getMonth() +
      ' ' +
      this.state.dueDate.getDate() +
      ' ' +
      this.state.dueDate.getFullYear()

    await createDocuments(this.state.fp_id, docClassIDs, date)
    const documents = await getDocumentsByUser(this.state.fp_id)
    this.props.updateDocuments(documents)
    this.props.endLoading()
    this.props.history.push('/dashboard/pm/' + this.state.fp_id)
  }

  render() {
    return (
      <div className="background-wave-blue maxheight">
        <Navbar />
        <div className="topBar">
          <div className="iconTop">
            <p className="iconInfo">
              {this.state.fp_org_name
                .replace(/\W*(\w)\w*/g, '$1')
                .toUpperCase()
                .substring(0, 2)}
            </p>
          </div>
          <div className="partnernamebox">
            <h3 className="partnername">{this.state.fp_org_name}</h3>
          </div>
        </div>

        <div className="pageSD margin-top-sm">
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
              selected={this.state.dueDate}
              onChange={this.newDueDate}
              className="datePicker"
            />
          </div>

          <button className="nextButton margin-bottom-sm" onClick={this.handleSubmit}>
            Assign
          </button>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithAuth(SelectDocumentsPage))
