import React, { Component } from 'react'
import '../styles/selector.css'
import add from '../media/add.png'
import remove from '../media/remove.png'
import info from '../media/blueinfo.png'

export class Selector extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="surround-box">
        <h3>{this.props.name}</h3>
        <div>
          {this.props.documents.map(docClass => {
            let buttonType
            if (this.props.name === 'Selected') {
              buttonType = remove // placeholders for red delete X
            } else {
              buttonType = add // placeholder for green add button (see chloe design documentation)
            }
            return (
              <div className="panel">
                <div className="docClassValue">{docClass.name}</div>
                <img src={info} className="imageValue" width="26" />
                <button
                  onClick={() => {
                    this.props.update(docClass.name)
                  }}
                  className="buttonValue"
                >
                  <img src={buttonType} width="30" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
