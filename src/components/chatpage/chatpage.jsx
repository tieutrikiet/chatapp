import React, { Component } from 'react';
import { database } from '../../configs/firebase';
import browserHistory from '../../routes/history';
import { compose } from "redux";
import { connect } from 'react-redux';
import {
    saveNewEmail, updateLastLogin, saveUserToDB,
    getUser, sendMessage, convert, convertTimestampToDate,
    getConversationID
} from '../../helpers/helpers.js';

import { firebaseConnect } from 'react-redux-firebase';
import Chatbox from '../chatbox/chatbox';
import './chatpage.css';

class Chatpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            newEmail: '',
            friendSelected: null
        }
    }

    componentWillReceiveProps({ auth }) {
        if (!auth || !auth.uid) {
            browserHistory.replace('/');
        }
        else {
            //this.observed(auth.email);
        }
    }

    componentDidMount() {
        
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
                browserHistory.replace(`/chat/${email}`);
            }
        }
    }

    render() {
        return (
            <div className="login-main-content">
                <div className="login-user-list">
                    <div className="find-friend">
                        <form onSubmit={this.handlerNewEmailSubmit}>
                            <input className="find-friend-bar" type="email" placeholder="New email, new friend" onChange={this.handlerNewEmailChange} />
                            <button className="find-friend-button" type="submit" >+</button>
                        </form>
                    </div>


                </div>

                <div className="login-user-message">

                </div>
            </div>
        );
    }
}

export default compose(firebaseConnect(props => {
    return [
        {
            path: `users/${props.match.params.email}`
        }
    ];
}), connect(({ firebase }, props) => ({
    auth: firebase.auth,
    friendEmail: props.match.params.email
}))
)(Chatpage);