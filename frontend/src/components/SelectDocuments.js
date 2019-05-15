import React from 'react'
import { Selector } from './Selector'
import { Input } from 'reactstrap'
import {
  getAllDocumentClasses,
  createDocuments,
  getDocumentsByUser,
  updateFPInstructions,
  getFPByID
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
      fp_org_name: '',
      instructions: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  /**
   * Gets all document classes from the backend and updates state
   */
  async componentDidMount() {
    this.props.beginLoading()
    let document_classes = await getAllDocumentClasses()
    let current_documents = await getDocumentsByUser(this.props.match.params.id)

    let available = {}

    for (const index in document_classes) {
      available[document_classes[index].name] = true
    }

    //The user should only be able to add document classes which aren't already assigned to the Field Partner
    for (const key in current_documents) {
      let docs_by_status = current_documents[key]
      for (const index in docs_by_status) {
        delete available[docs_by_status[index].docClassName]
      }
    }

    let filtered = available
    let fp_info = await getFPByID(this.props.match.params.id)

    this.setState({
      documentClasses: document_classes,
      available: available,
      filtered: filtered,
      fp_id: this.props.match.params.id,
      fp_org_name: fp_info.org_name,
      instructions: fp_info.instructions
    })
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

  updateInstructions = event => {
    this.setState({ instructions: event.target.value })
  }

  async handleSubmit() {
    this.props.beginLoading()
    let docClassIDs = this.state.documentClasses
      .filter(docClass => this.state.available[docClass.name] === false)
      .reduce((array, docClass) => {
        array.push(docClass._id)
        return array
      }, [])

    if (docClassIDs.length > 0) {
      const date =
        this.state.dueDate.getMonth() +
        ' ' +
        this.state.dueDate.getDate() +
        ' ' +
        this.state.dueDate.getFullYear()

      await createDocuments(this.state.fp_id, docClassIDs, date)
      const documents = await getDocumentsByUser(this.state.fp_id)
      this.props.updateDocuments(documents)
    }

    await updateFPInstructions(this.state.fp_id, this.state.instructions)

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
            Set a due date:
            <DatePicker
              selected={this.state.dueDate}
              onChange={this.newDueDate}
              className="datePicker"
            />
          </div>

          <div className="blockCustom instructionsDisplay">
            Add additional instructions:
            <br />
            <Input
              type="textarea"
              className="textarea-input"
              style={{ height: '200px' }}
              value={this.state.instructions}
              onChange={this.updateInstructions}
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
)(SelectDocumentsPage)
