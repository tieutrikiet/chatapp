import React, { Component } from 'react';
import {convert} from '../../helpers/helpers';
import './conversation.css';

class Conversation extends Component {
    handlerSelect = () => {
        // console.log(this.props.email);
        const email = convert(this.props.email);
        if (email) {
            window.location.href = "/chat/" + email;
        }
        else {
            window.location.href = "/";
        }
    }

    render() {
        return ( 
            <div className={this.props.isSelected ? "conv-main selected" : "conv-main"} onClick={this.props.handlerSelect} >
                <img src={this.props.avatarURL} alt={this.props.userName} className="conv-avatar" />
                <div className="conv-userInfo">
                    <div className={this.props.isRead ? "conv-userName" : "conv-userName isRead-status"}>{this.props.userName}</div>
                    <div className={this.props.isActived === true ? "conv-actived" : "conv-lastLogin"}>{this.props.isActived === true ? "Actived now" : this.props.lastLogin}</div>
                </div>
                
            </div>
         );
    }
}
 
export default Conversation;