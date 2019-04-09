import React from 'react'
import DocumentList from './DocumentList'
import Notification from "./Notification"
import { getAllDocuments } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import '../styles/dashboard.css'
import { updateDocuments } from '../redux/modules/user'
import '../styles/index.css'

// Not needed unless working with non "en" locales
// import { addLocaleData } from 'react-intl';
// import enLocaleData from 'react-intl/locale-data/en';

// Not needed unless working with non "en" locales
// addLocaleData(enLocaleData);

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
<<<<<<< HEAD
      documents: [],
      statuses: [],
      notification: "H"
=======
      statuses: ['Missing', 'Rejected', 'Pending', 'Approved']
>>>>>>> e54a167f69ecac6a79d72bc0cacfb558a6686dcc
    }
  }

  async componentDidMount() {
    const res = await getAllDocuments()
    if (res) {
<<<<<<< HEAD
      this.setState({
        documents: res,
        statuses: ['Missing', 'Pending', 'Rejected', 'Approved'],
        notification: ["a notification"]
      })
=======
      this.props.updateDocuments(res)
>>>>>>> e54a167f69ecac6a79d72bc0cacfb558a6686dcc
    } else {
      this.props.updateDocuments([])
    }
  }

  render() {
    return (
<<<<<<< HEAD
      <div>
        <div>
          {Object.keys(this.state.documents).map(key => {
            return (
              <DocumentList
                isPM={this.state.isPM}
                documents={this.state.documents[key]}
                status={key}
              />
            )
          })}
        </div>
        <div>
          <p> {"Notifications"} </p>
          {Object.keys(this.state.notification).map(key => {
            return (
              <Notification
                name={"PM Name"}
                time={"4/8/19"}
                description={"Something happened"}
              />
            )
          })}
        </div>
      </div>
=======
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
>>>>>>> e54a167f69ecac6a79d72bc0cacfb558a6686dcc
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
