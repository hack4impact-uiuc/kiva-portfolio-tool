import React from 'react'
import DocumentClassList from './DocumentClassList'
import { getAllDocumentClasses } from '../utils/ApiWrapper'
import { Button, Modal, ModalFooter } from 'reactstrap'
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
            modalOpen: false
        }
        this.toggle = this.toggle.bind(this)
    }

    async componentDidMount() {
        const res = await getAllDocumentClasses()
        if (res) {
            this.updateDocumentClasses(res)
        } else {
            this.updateDocumentClasses([])
        }
    }

    toggle() {
        this.setState({ modalOpen: !this.state.modalOpen })
    }

    render() {
        return (
            <>
                <h1>Edit Document Classes</h1>
                <Button color="primary" onClick={this.toggle}>
                    Add New Document Class
                </Button>
                <DocumentClassList documentClasses={this.props.documentClasses} />
            </>
        )
    }
}

export default connect (mapStateToProps, mapDispatchToProps) (DocumentClassPage)
