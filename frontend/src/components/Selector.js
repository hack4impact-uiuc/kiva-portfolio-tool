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
          {Object.keys(this.props.documents).map(docClass => {
            let buttonType
            if (this.props.name === 'Selected') {
              buttonType = remove // placeholders for red delete X
            } else {
              buttonType = add // placeholder for green add button (see chloe design documentation)
            }
            if (this.props.documents[docClass] === this.props.name) {
              return (
                <div className="panel">
                  <div className="docClassValue">{docClass}</div>
                  <img src={info} className="imageValue" />
                  <button
                    onClick={() => {
                      this.props.update(docClass)
                    }}
                    className="buttonValue"
                  >
                    <img src={buttonType} width="20" />
                  </button>
                </div>
              )
            }
          })}
        </div>
      </div>
    )
  }
}
