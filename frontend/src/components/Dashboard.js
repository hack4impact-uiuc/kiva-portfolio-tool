import React from 'react'
import DocumentList from './DocumentList'
<<<<<<< HEAD
import NotificationsBar from './NotificationsBar'
=======
>>>>>>> 604bea01f6c88d040a3567d41a3b1945161a94a2
import { getAllDocuments, getAllMessages } from '../utils/ApiWrapper'
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
      statuses: ['Missing', 'Rejected', 'Pending', 'Approved']
    }
  }

  async componentDidMount() {
      </Container>
>>>>>>> 553bb00141e25681d6f63aa89809bef8ed5925c7
    )
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
