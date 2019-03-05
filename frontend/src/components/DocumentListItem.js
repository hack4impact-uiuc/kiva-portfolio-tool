import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  isPM: state.user.isPM
})

class DocumentListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      docClass: this.props.docClass,
      fileName: this.props.fileName
    }
  }
  render() {
    const {isPM} = this.props;
    return (
      <tr>
        <td>{this.state.docClass}</td>
        <td>{this.state.fileName ? this.state.fileName : 'N/A'}</td>
        <td class="interaction">
          {this.state.fileName ? 'DOWNLOAD ' : '' }
          {isPM ? 'APPROVE' : 'UPLOAD'}
        </td>
      </tr>
    )
  }
}

export default connect(
  mapStateToProps
)(DocumentListItem)
