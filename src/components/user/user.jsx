import React, { Component } from 'react';
import "./user.css";

class UserList extends Component {
    
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
            </div>
          );
    }
}
 
export default UserList;