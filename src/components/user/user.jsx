import React, { Component } from 'react';
import "./user.css";

class UserList extends Component {
    
    render() { 
        return (
            <div>
                <img className="user-avatar" src={this.props.avatarURL} alt={this.props.avatarURL}/>
            </div>
          );
    }
}
 
export default UserList;