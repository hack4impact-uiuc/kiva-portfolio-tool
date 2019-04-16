import React from 'react'
import DocumentClassList from './DocumentClassList'
import { getAllDocumentClasses } from '../utils/ApiWrapper'
import { Container, Row, Col } from 'reactstrap'
import '../styles/dashboard.css'
import { updateDocuments } from '../redux/modules/user'
import '../styles/index.css'

class DocumentClassPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            documentClasses: []
        }
    }

    async componentDidMount() {
        const res = await getAllDocumentClasses()
        if (res) {
            this.setState({ documentClasses: res })
        } else {
            this.setState({ documentClasses: [] })
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    {this.props.documents
                        ? this.state.statuses.map(key => {
                            return (
                                <Col sm="12" md="6">
                                    <DocumentList documents={this.props.documents[key]} status={key} />
                                </Col>
                            )
                        })
                        : null}
                </Row>
            </Container>
        )
    }
}

export default DocumentClassPage
