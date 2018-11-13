import React, { Component } from 'react';
import browserHistory from '../../routes/history';
import { compose } from "redux";
import { connect } from 'react-redux';
import {
    saveNewEmail, updateLastLogin, saveUserToDB,
    getUser, sendMessage, convert, convertTimestampToDate,
    getConversationID
} from '../../helpers/helpers.js';

import { firebaseConnect } from 'react-redux-firebase';
import './chatbox.css';

class Chatbox extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleChange = (event) => {
        this.setState({
            message: event.target.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.message.length > 0) {
            sendMessage(this.props.toemail, this.state.message)
            this.setState({
                message: ''
            });
        }
    }

    render() {
        return (
            <div>
                <div className="login-sub-message">
                    <div className="sub-message" id="messages-content">

                    </div>
                </div>
                <div className="sub-text">
                    <form onSubmit={this.handleSubmit}>
                        <input className="input-bar" placeholder="Your message" type="text" onChange={this.handleChange} />
                        <button className="input-send" type="submit">Send</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default compose(firebaseConnect(), connect(({firebase: auth}) => ({
    auth: auth
}))
)(Chatbox);