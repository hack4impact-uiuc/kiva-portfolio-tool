import React from 'react'
import DocumentClassList from './DocumentClassList'
import { getAllDocumentClasses, createDocumentClass } from '../utils/ApiWrapper'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import '../styles/dashboard.css'
import { updateDocumentClasses } from '../redux/modules/user'
import '../styles/index.css'

const mapStateToProps = state => ({
  documentClasses: state.user.documentClasses
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocumentClasses
    },
    dispatch
  )
}

class DocumentClassPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      name: '',
      description: ''
    }
    this.toggle = this.toggle.bind(this)
  }

  async componentDidMount() {
    const res = await getAllDocumentClasses()
    if (res) {
      this.props.updateDocumentClasses(res)
    } else {
      this.props.updateDocumentClasses([])
    }
  }

  toggle() {
    this.setState({ modal: !this.state.modal })
  }

  updateName = event => {
    this.setState({ name: event.target.value })
  }

  updateDescription = event => {
    this.setState({ description: event.target.value })
  }

  render() {
    return (
      <>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          {
            //<Upload docID={this.props.documentClass._id} />
          }
          <ModalBody>
            <form>
              <span> Name: </span>
              <input onChange={this.updateName} />
              <br />
              <span> Description: </span>
              <textarea
                name="paragraph_text"
                cols="50"
                rows="10"
                onChange={this.updateDescription}
              />
              <br />
              <Button onClick={createDocumentClass(this.state.name, this.state.description)}>
                Submit
              </Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button className="invalidSearchButton" onClick={this.toggle}>
              Return
            </Button>
          </ModalFooter>
        </Modal>
        <h1>Edit Document Classes</h1>
        <Button color="primary" onClick={this.toggle}>
          Add New Document Class
        </Button>
        <DocumentClassList documentClasses={this.props.documentClasses} />
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentClassPage)
