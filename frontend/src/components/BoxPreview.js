import React, { Component } from 'react'

import { ContentPreview } from 'box-ui-elements'
import messages from 'box-ui-elements/i18n/en-US'
import 'box-ui-elements/dist/preview.css'
import '../styles/index.scss'

import { getAccessToken } from '../utils/ApiWrapper'

const container = document.querySelector('.container')
const language = 'en-US'
const FILE_ID_VIDEO = '308566420378'
const FILE_ID_3D = '319004423111'
const FILE_ID_TEXT = '308349801521'
const FILE_ID_EXCEL = '319011536090'
const FILE_ID_AUDIO = '308566419514'
const FILE_ID_IMAGE = '308345646235'

class BoxPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileId: 419075737331,
      accessToken: null
    }
  }

  async componentDidMount() {
    const res = await getAccessToken()
    if (res) {
      this.setState({
        accessToken: res
      })
    } else {
      this.setState({
        accessToken: null
      })
    }
  }

  render() {
    return (
      <ContentPreview
        hasHeader
        fileId={this.state.fileId}
        token={'xNT24dYkz8KM4QBdUnPTLvm3mAxWbgXN'}
        //token={this.state.accessToken}
        language={language}
        messages={messages}
        collection={[
          this.state.fileId,
          419072325627,
            418980052676
        ]}
      />
    )
  }
}

export default BoxPreview
