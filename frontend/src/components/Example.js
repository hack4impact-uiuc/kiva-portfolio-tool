import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Example extends React.Component {
  // wont be guaranteed that we'll use this, but this just specifies the expected
  // object type to be passed in to use
  static propTypes = {
    item: PropTypes.object,
    removeItem: PropTypes.func,
    markTodoDone: PropTypes.func
  }

  onClickClose = () => {
    const { index, removeItem } = this.props
    removeItem(index) // calls function passed in by props on the index, also passed in by props
  }

  onClickDone = () => {
    const { index, markTodoDone } = this.props
    markTodoDone(index)
  }

  render() {
    const { item } = this.props
    const todoClass = item.done ? 'done' : 'undone'
    return (
      <table>
        <tbody>
          <tr data-testid={`todoItem${item.index}`}>
            <td className={todoClass}>
              <span
                data-testid="markAsCompleted"
                className="glyphicon glyphicon-ok icon"
                aria-hidden="true"
                onClick={this.onClickDone}
              />
              {item.value}
              <span
                data-testid="markAsDeleted"
                className="glyphicon glyphicon-remove-sign close"
                aria-hidden="true"
                onClick={this.onClickClose}
              />
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default Example
