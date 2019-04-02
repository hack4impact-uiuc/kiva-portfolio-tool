import React, { Component } from 'react'

export class Selector extends React.Component {
  constructor(props) {
    super(props)
  }

    render() {
        return (
        <div>
            <h2>
                {this.props.name}    
            </h2>
            <div>
                {Object.keys(this.props.documents).map((docClass) => {
                    let buttonType;
                    if (this.props.name === 'Selected') {
                        buttonType = "X"
                    } else {
                        buttonType = "+"
                    }
                    if (this.props.documents[docClass] === this.props.name) {
                        return (
                            <div>
                                {docClass} i <button onClick={() => {this.props.update(docClass)}}>{buttonType}</button>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
        )
    }
}

