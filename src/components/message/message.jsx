import React, { Component } from 'react';
import { auth } from '../../configs/firebase';
import './message.css';

class Message extends Component {

    render() { 
        const authEmail = auth.currentUser ? auth.currentUser.email : "";
        return ( 
            <div>
                <div className={this.props.email === authEmail ? "myMessage" : "userMessage"}>
                    {this.props.content}
                </div>
                <div className="clear"/>
            </div>
         );
    }
}
 
export default Message;