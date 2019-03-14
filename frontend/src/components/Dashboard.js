import React from 'react'
import DocumentList from './DocumentList'
import { getAllDocuments } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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

const FILE_ID_DOC = '421186798979'
const FILE_ID_VIDEO = '308566420378'
const FILE_ID_3D = '319004423111'
const FILE_ID_TEXT = '308349801521'
const FILE_ID_EXCEL = '319011536090'
const FILE_ID_AUDIO = '308566419514'
const FILE_ID_IMAGE = '308345646235'

const container = document.querySelector('.container')
const token = 'aRPU7COQG1ozVy1pyRonB5S2hKTv13OR'
const language = 'en-US'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      //put actions here
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
    /* await getAllDocuments().then(results => {
      results ? 
      this.setState({
        documents: results
      }) :
      this.setState({
        documents: []
      }) */
    const res = await getAllDocuments()
    if (res) {
      this.setState({
        documents: res,
        statuses: ['Missing', 'Pending', 'Rejected', 'Approved']
      })
    } else {
      this.setState({
        documents: [],
        statuses: []
      })
    }
  }

  render() {
    return (
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
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
