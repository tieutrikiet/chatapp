import React, { Component } from 'react';
import { database, auth, provider } from '../../configs/firebase';
import browserHistory from '../../routes/index';
import {connect} from 'react-redux';
import { saveNewEmail, updateLastLogin, saveUserToDB, 
    getUser, sendMessage, convert, convertTimestampToDate, 
    getConversationID } from '../../helpers/helpers.js';

import './chatpage.css';

class Chatpage extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentWillReceiveProps({ auth }) {
        if (!auth || !auth.currentUser) {
            browserHistory.replace('/');
        }
    }

    handlerNewEmailChange = (event) => {
        
    }

    handlerNewEmailSubmit = (event) => {
        event.preventDefault();
        
    }

    handleChange = (event) => {
        
    }

    handleSubmit = (event) => {
        event.preventDefault(); 
        
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
 
export default connect(({firebase: {auth}}) => ({
    auth: auth
}))(Chatpage); 