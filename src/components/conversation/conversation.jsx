import React, { Component } from 'react';
import './conversation.css';

class Conversation extends Component {
    render() {
        return ( 
            <div className="conv-main">
                <img src={this.props.avatarURL} alt={this.props.userName} className="conv-avatar" />
                <div className="conv-userInfo">
                    <div className="conv-userName">{this.props.userName}</div>
                    <div className="conv-lastLogin">{this.props.lastLogin}</div>
                </div>
                
            </div>
         );
    }
}
 
export default Conversation;