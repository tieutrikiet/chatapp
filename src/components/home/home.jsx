import React, { Component } from 'react';
import { auth, provider, database } from '../../configs/firebase';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Conversation from '../conversation/conversation.jsx';
import Message from '../message/message.jsx';
import { saveUserToDB, convert, saveNewEmail, sendMessage, getUser, convertTimestampToDate } from '../../helpers/helpers.js';
import './home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            friends: [],
            newEmail: '',
            message: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    observedChild = () => {
        if (this.state.user) {
            const myEmail = convert(this.state.user.email);
            if (myEmail) {
                let list = [];
                database.ref('users').child(myEmail).child('conversations').on('child_added', (snapshot) => {
                    getUser(snapshot.key).then((res) => {
                        if (res) {
                            list.push({
                                user: res,
                                timestamp: snapshot.val().timestamp
                            });
                            this.setState({
                                friends: this.state.friends.concat(list)
                            })
                        }
                    });
                });

                database.ref('users').child(myEmail).child('conversations').on('child_changed', (snapshot) => {
                    getUser(snapshot.key).then((res) => {
                        if (res) {
                            const list = this.state.friends.map((friend)=>{
                                if (res.user.uid === friend.user.uid) {
                                    return {
                                        user: res,
                                        timestamp: snapshot.val().timestamp
                                    };
                                }
                                else {
                                    return friend;
                                }
                            });

                            console.log({list});
                            this.setState({
                                friends: list
                            })
                        }
                    });
                });
            }
        }
    };

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            console.log({ currentUser: user });
            if (user) {
                this.setState({
                    user: user
                });

                this.observedChild();
            }
        });
    }

    // Two functions to support login and logout
    login = () => {
        auth.signInWithPopup(provider).then((result) => {
            console.log({ currentUser: result });
            const user = result.user;
            if (saveUserToDB(user)) {
                this.setState({
                    user: user
                })

                this.observedChild();
            }
        });
    };

    logout = () => {
        auth.signOut().then(() => {
            this.setState({
                user: null,
                friends: [],
                newEmail: '',
                message: ''
            });
        });
    }
    // ~End

    getUserDisplayName = () => {
        if (this.state.user) {
            const name = this.state.user.displayName;
            const url = this.state.user.photoURL;
            return (
                <div>
                    <div className="login-welcome">WELCOME {name}</div>
                    <img src={url} className="login-avatar" alt="avatar" />
                </div>
            );
        }

        return (
            <div className="login-welcome">WELCOME TO CHATAPP</div>
        );
    };

    getLoginButton = () => {
        if (this.state.user) {
            return (
                <button className="login-button logout-status" onClick={this.logout}>
                    SIGN OUT
                </button>
            );
        }

        return (
            <button className="login-button login-status" onClick={this.login}>
                SIGN IN
            </button>
        );
    };

    getListUser = () => {
        if (this.state.user) {
            const firstConversation = () => {
                if (this.state.friends) {
                    return (
                        this.getMessage(this.state.friends[0])
                    );
                }
                return <div />
            };

            return (
                <div className="login-main-content">
                    <div className="login-user-list">
                        <div className="find-friend">
                            <form onSubmit={this.handleSearch}>
                                <input className="find-friend-bar" type="email" placeholder="New email, new friend" onChange={this.handleChange} />
                                <button className="find-friend-button" type="submit">+</button>
                            </form>
                            {this.showListFriends()}
                        </div>

                    </div>
                    {firstConversation()}
                </div>
            );
        }

        return <div />
    };

    getMessage = (friendInfo) => {
        return (
            <div className="login-user-message">
                <div className="login-sub-message">
                    <div className="sub-message">

                    </div>
                </div>
                <div className="sub-text">
                    <input className="input-bar" placeholder="Your message" />
                    <button className="input-send">Send</button>
                </div>
            </div>
        );
    };

    showListFriends = () => {
        if (this.state.friends) {
            let list = this.state.friends;
            list.sort((a, b)=>{
                return b.timestamp - a.timestamp;
            });
            console.log(this.state.friends);
            console.log({list});
            return list.map((friend, index)=>{
                return <Conversation
                    avatarURL={friend.photoURL}
                    userName={friend.displayName}
                    lastLogin={convertTimestampToDate(friend.user.lastLogin)}
                    key={index}
                    />
            });
        }

        return <div/>
    }


    // Two functions for new email, new friend
    handleChange(event) {
        this.setState({ newEmail: event.target.value });
    }

    handleSearch(event) {
        console.log({ newEmail: this.state.newEmail });
        event.preventDefault();
        if (this.state.newEmail.length > 0) {
            const email = convert(this.state.newEmail);
            if (email) {
                //window.location.href = "/chat/" + email;
                saveNewEmail(this.state.newEmail);
            }
        }
    }
    // ~End

    render() {
        return (
            <div>
                <div className="login-header">
                    {this.getUserDisplayName()}
                </div>
                <div className="login-body">
                    {this.getLoginButton()}
                </div>
                {this.getListUser()}
            </div>
        );
    }
}

export default Home;