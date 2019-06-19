import React, { Component } from 'react'
import { Input, Form } from 'reactstrap'
import DatePicker from 'react-datepicker'

import { updateDocuments, beginLoading, endLoading } from '../redux/modules/user'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import WithAuth from './auth/WithAuth'
import { Selector } from './Selector'
import Navbar from './NavBar'

import {
  getAllDocumentClasses,
  createDocuments,
  getDocumentsByUser,
  updateFPInstructions,
  getFPByID,
  updateFieldPartnerStatus,
  updateFieldPartnerDueDate
} from '../utils/ApiWrapper'

import search from '../media/search.png'

import '../styles/selectdocuments.scss'

const mapStateToProps = state => ({
  language: state.user.language
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

/**
 * Page that shows when a PM is creating a new FP.
 * Allows the PM to choose which docClasses that the new FP is required to submit
 * Allows the PM to set a duedate for all the documents
 * Allows the PM to search for a specific docClass as well
 */
export class SelectDocumentsPage extends Component {
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
        delete available[docs_by_status[index].docClass.name]
      }
    }

    let filtered = available
    let fp_info = await getFPByID(this.props.match.params.id)

    this.setState({
      documentClasses: document_classes,
      available: available,
      filtered: filtered,
      fp_id: this.props.match.params.id,
      dueDate: fp_info.due_date ? new Date(fp_info.due_date) : new Date(),
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

    // Currently breaks when no docClassIDs provided, so I (Arpan) wrapped it in an if statement - need to fix
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

    await updateFieldPartnerStatus(this.state.fp_id, 'In Process')

    await updateFieldPartnerDueDate(this.state.fp_id, this.state.dueDate.getTime())

    this.props.endLoading()
    this.props.history.push('/dashboard/pm/' + this.state.fp_id)
  }

  languages = {
    English: {
      select: 'Select documents',
      search: 'Search for documents here',
      available: 'Available',
      selected: 'Selected',
      setDueDate: 'Set a due date:',
      addInstructions: 'Add additional instructions:',
      assign: 'Assign'
    },
    Spanish: {
      select: 'Select documents (Spanish)',
      search: 'Search for documents here (Spanish)',
      available: 'Available (Spanish)',
      selected: 'Selected (Spanish)',
      setDueDate: 'Set a due date: (Spanish)',
      addInstructions: 'Add additional instructions: (Spanish)',
      assign: 'Assign (Spanish)'
    },
    French: {
      select: 'Select documents (French)',
      search: 'Search for documents here (French)',
      available: 'Available (French)',
      selected: 'Selected (French)',
      setDueDate: 'Set a due date: (French)',
      addInstructions: 'Add additional instructions: (French)',
      assign: 'Assign (French)'
    },
    Portuguese: {
      select: 'Select documents (Portuguese)',
      search: 'Search for documents here (Portuguese)',
      available: 'Available (Portuguese)',
      selected: 'Selected (Portuguese)',
      setDueDate: 'Set a due date: (Portuguese)',
      addInstructions: 'Add additional instructions: (Portuguese)',
      assign: 'Assign (Portuguese)'
    }
  }

  render() {
    let text = this.languages[this.props.language]
    if (!text) {
      text = this.languages['English']
    }

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
          <h1>{text.select}</h1>

          <Form onSubmit={this.handleSubmit}>
            <img src={search} width="18" alt="Search icon" />
            <input
              className="input-master"
              type="text"
              value={this.state.query}
              placeholder={text.search}
              onChange={this.handleQueryChange}
            />
          </Form>

          <div className="displayView">
            <div className="displayCell blockCustom">
              <Selector
                name={text.available}
                documents={this.state.documentClasses.filter(
                  docClass => this.state.filtered[docClass.name]
                )}
                update={this.changeSelection}
              />
            </div>

            <div className="blockCustom displayCell">
              <Selector
                name={text.selected}
                documents={this.state.documentClasses.filter(
                  docClass => this.state.filtered[docClass.name] === false
                )}
                update={this.changeSelection}
              />
            </div>
          </div>

          <div className="blockCustom dateDisplay">
            {text.setDueDate}
            <DatePicker
              selected={this.state.dueDate}
              onChange={this.newDueDate}
              className="datePicker"
            />
          </div>

          <div className="blockCustom instructionsDisplay">
            {text.addInstructions}
            <br />
            <Input
              type="textarea"
              className="textarea-input"
              style={{ height: '200px' }}
              value={this.state.instructions}
              onChange={this.updateInstructions}
            />
          </div>

          <button type="submit" className="nextButton margin-bottom-sm" onClick={this.handleSubmit}>
            {text.assign}
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
