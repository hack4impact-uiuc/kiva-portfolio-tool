import React from 'react'
import DocumentList from './DocumentList'
import { getAllDocuments } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
<<<<<<< HEAD
import { Container, Row, Col } from 'reactstrap'
import '../styles/dashboard.css'
=======
import { updateDocuments } from '../redux/modules/user'

import { render } from 'react-dom'

// Not needed unless working with non "en" locales
// import { addLocaleData } from 'react-intl';
// import enLocaleData from 'react-intl/locale-data/en';

import { ContentPreview } from 'box-ui-elements'
import messages from 'box-ui-elements/i18n/en-US'
import 'box-ui-elements/dist/preview.css'
import './index.scss'

// Not needed unless working with non "en" locales
// addLocaleData(enLocaleData);
>>>>>>> master

const mapStateToProps = state => ({
  isPM: state.user.isPM,
  documents: state.user.documents
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateDocuments
    },
    dispatch
  )
}
class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      documents: [],
      statuses: []
    }
  }

  async componentDidMount() {
    const res = await getAllDocuments()
    if (res) {
      this.props.updateDocuments(res)
    } else {
      this.props.updateDocuments([])
    }
  }

  render() {
    return (
      <Container>
        <Row>
          {this.props.documents
          ? Object.keys(this.props.documents).map(key => {
              <Col sm="12" md="6">
                <DocumentList documents={this.props.documents[key]} status={key} />
              </Col>
            })
          : null}
        </Row>
      </Container>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
