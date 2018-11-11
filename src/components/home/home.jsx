import React, { Component } from 'react';
import { database, auth, provider } from '../../configs/firebase';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect} from "react-redux-firebase";

import Conversation from '../conversation/conversation.jsx';
import Message from '../message/message.jsx';
import { saveNewEmail, updateLastLogin, saveUserToDB, 
         getUser, sendMessage, convert, convertTimestampToDate, 
         getConversationID } from '../../helpers/helpers.js';
import './home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            friends: [],
            newEmail: '',
            message: '',
            friendEmail: null,
            messages: []
        }

        this.handlerNewEmailChange = this.handlerNewEmailChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };

    observedChild = (string) => {
        if (this.state.user) {
            console.log(string);
            const myEmail = convert(this.state.user.email);
            if (myEmail) {
                database.ref('users').child(myEmail).child('conversations').on('child_added', (snapshot) => {
                    getUser(snapshot.key).then((res) => {
                        if (res) {
                            this.setState({
                                friends: this.state.friends.concat({
                                    user: res,
                                    timestamp: snapshot.val().timestamp,
                                    isRead: snapshot.val().isRead
                                })
                            })
                        }
                    });
                });
            }
        }
    };

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                if (saveUserToDB(user)) {
                    this.setState({
                        user: user,
                        friends: []
                    })
                    this.observedChild("Didmount");
                }
            }
        });
    }

    componentWillUnmount() {
        updateLastLogin();
    }

    handlerLogin = () => {
        auth.signInWithPopup(provider).then((result) => {
            const user = result.user;
            if (saveUserToDB(user)) {
                this.setState({
                    user: user,
                    friends: []
                });
            }
        });
    }

    handlerLogout = () => {
        updateLastLogin();
        auth.signOut().then(() => {
            this.setState({
                user: null,
                friends: [],
                newEmail: '',
                message: '',
                friendSelected: null
            });
        });
    }

    handlerNewEmailChange = (event) => {
        this.setState({ newEmail: event.target.value });
    }

    handlerNewEmailSubmit = (event) => {
        event.preventDefault();
        if (this.state.newEmail.length > 0) {
            const email = convert(this.state.newEmail);
            if (email) {
                saveNewEmail(this.state.newEmail);
                window.location.href = "/chat/" + email;
            }
        }
    }

    handleChange = (event) => {
        this.setState({ content: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.content.length > 0) {
            if (this.state.friendEmail) {
                sendMessage(this.state.friendEmail, this.state.content);
            }
        }
    }

    handlerSelect = (email) => {
        const convEmail = convert(email);
        if (convEmail) {
            this.setState({
                friendEmail: email,
                messages: []
            }, () => {
                console.log(this.state.friendEmail);
                this.getMessages();
            })
        }
        else {
            window.location.href = "/";
        }
    }

    // ------------------------------------------------------------------------------ //

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
                <button className="login-button logout-status" onClick={this.handlerLogout}>
                    SIGN OUT
                </button>
            );
        }

        return (
            <button className="login-button login-status" onClick={this.handlerLogin}>
                SIGN IN
            </button>
        );
    };

    getMessages = () => {
        if (auth.currentUser === null) {
            return;
        }

        const email = convert(this.state.friendEmail);
        if (email) {
            getConversationID(email).then((convID) => {
                if (convID) {
                    database.ref('conversations').child(convID).on('child_added', (snapshot) => {
                        this.setState({
                            messages: this.state.messages.concat(<Message 
                                email={snapshot.val().email}
                                content={snapshot.val().content}
                            />)
                        });
                    });
                }
            });

            window.location.href = "/chat/" + email;
        }
    };

    showListFriends = () => {
        if (this.state.friends) {
            let list = this.state.friends;
            list.sort((a, b) => {
                return b.timestamp - a.timestamp;
            });

            if (this.state.friendEmail) {
                // Do nothing
            }
            else {
                console.log(list[0]);
                // this.setState({
                //     friendEmail: list[0].user.email
                // })
                // this.getMessages();
            }

            return list.map((friend, index) => {
                return <Conversation
                    email={friend.user.email}
                    avatarURL={friend.user.photoURL}
                    userName={friend.user.displayName}
                    lastLogin={convertTimestampToDate(friend.user.lastLogin)}
                    isRead={friend.isRead}
                    isActived={friend.user.isActived}
                    handlerSelect={() => this.handlerSelect(friend.user.email)}
                    key={index}
                />
            });
        }

        return <div />
    }

    render() {
        return (
            <Router>
                <div>
                    <div className="login-header">
                        {this.getUserDisplayName()}
                    </div>
                    <div className="login-body">
                        {this.getLoginButton()}
                    </div>

                    <Route exact path="/" component={this.goToHomePage}/>
                    <Route exact path="/chat/:userMail" component={this.goToChatPage}/>
                </div>
            </Router>

        );
    }

    goToMainPage = (messageList) => {
        if (this.state.user) {
            return (
                <div className="login-main-content">
                    <div className="login-user-list">
                        <div className="find-friend">
                            <form onSubmit={this.handleSearch}>
                                <input className="find-friend-bar" type="email" placeholder="New email, new friend" onChange={this.handleChange} />
                                <button className="find-friend-button" type="submit">+</button>
                            </form>
                        </div>
                        {this.showListFriends()}
                    </div>

                    <div className="login-user-message">
                        <div className="login-sub-message">
                            <div className="sub-message" id="messages-content">
                                {messageList}
                            </div>
                        </div>
                        <div className="sub-text">
                            <form onSubmit={this.handleSend}>
                                <input className="input-bar" placeholder="Your message" type="text" onChange={this.handleChatChange} />
                                <button className="input-send" type="submit">Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }

        return <div />
    }

    goToHomePage = () => {
        return this.goToMainPage(null);
    }

    goToChatPage = ({match}) => {
        return this.goToMainPage(this.state.messages);
    }
}

export default compose(firebaseConnect(), connect(({firebase: {auth}}) => ({auth})))(Home);