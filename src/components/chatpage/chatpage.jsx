import React, { Component } from 'react';
import browserHistory from '../../routes/index';
import { compose } from "redux";
import { connect } from 'react-redux';
import {
    saveNewEmail, updateLastLogin, saveUserToDB,
    getUser, sendMessage, convert, convertTimestampToDate,
    getConversationID
} from '../../helpers/helpers.js';

import './chatpage.css';
import { firebaseConnect } from 'react-redux-firebase';

class Chatpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newEmail: '',
            message: ''
        }
    }

    componentWillReceiveProps({ auth }) {
        if (!auth || !auth.uid) {
            browserHistory.replace('/');
        }
    }

    handlerNewEmailChange = (event) => {
        this.setState({
            newEmail: event.target.value
        });
    }

    handlerNewEmailSubmit = (event) => {
        event.preventDefault();
        if (this.state.newEmail.length > 0) {
            const email = convert(this.state.newEmail);
            if (email) {
                saveNewEmail(this.state.newEmail);
                browserHistory.replace('/chat/' + email);
                this.setState({
                    newEmail: ''
                });
            }
        }
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
            <div className="login-main-content">
                <div className="login-user-list">
                    <div className="find-friend">
                        <form onSubmit={this.handlerNewEmailSubmit}>
                            <input className="find-friend-bar" type="email" placeholder="New email, new friend" onChange={this.handlerNewEmailChange} />
                            <button className="find-friend-button" type="submit">+</button>
                        </form>
                    </div>


                </div>

                <div className="login-user-message">
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
            </div>
        );
    }
}

export default compose(firebaseConnect([
    {
        path: "/users"
    },
    {
        path: "/conversations"
    }
]), connect(({firebase: auth}, state) => ({
    auth: auth,
    users: state.firebase.data["users"],
    conversations: state.firebase.data["conversations"]
}))
)(Chatpage);