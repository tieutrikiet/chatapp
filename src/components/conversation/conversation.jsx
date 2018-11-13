import React, { Component } from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import './conversation.css';

class Conversation extends Component {
    render() {
        return ( 
            <div className={this.props.isSelected ? "conv-main selected" : "conv-main"} onClick={this.props.handlerSelect} >
                <img src={this.props.avatarURL} alt={this.props.userName} className="conv-avatar" />
                <div className="conv-userInfo">
                    <div className={this.props.isRead ? "conv-userName" : "conv-userName isRead-status"}>{this.props.userName}</div>
                    <div className={this.props.isActived === true ? "conv-actived" : "conv-lastLogin"}>{this.props.isActived === true ? "Actived now" : this.props.lastLogin}</div>
                </div>
                <i className={this.props.isStarred ? "material-icons conv-starred" : "material-icons conv-unstarred"}>notifications_active</i>
            </div>
         );
    }
}
 
export default compose(firebaseConnect(), connect(({ firebase: { auth } }) => ({ auth })))(Conversation);