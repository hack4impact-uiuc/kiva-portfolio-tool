import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
// import { bindActionCreators } from 'redux'
import { Table } from 'reactstrap'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
    isPM: state.user.isPM
})  

class NotificationsBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { isPM } = this.props
        return (
            <Tabs>
                <TabList>
                    <Tab>Activity</Tab>
                    <Tab>Information</Tab>
                </TabList>

                <TabPanel>
                    {this.props.messages.map(message => {
                        // <SomeItem/>
                            return (
                                <div>
                                    {message}
                                </div>
                            )   
                    })}                    
                </TabPanel>
                <TabPanel>
                    <h2>Any content 2</h2>
                </TabPanel>
            </Tabs>
        );
    }
}

export default connect(mapStateToProps)(NotificationsBar)
