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

    

    render() {
        return (
            <div>
                
            </div>
        );
    }
}

export default compose(firebaseConnect(), connect(({firebase: auth}) => ({
    auth: auth
}))
)(Chatbox);