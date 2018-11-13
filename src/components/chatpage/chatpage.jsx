import React, { Component } from 'react';
import { database } from '../../configs/firebase';
import browserHistory from '../../routes/history';
import { compose } from "redux";
import { connect } from 'react-redux';
import {
    saveNewEmail,
    getUser, sendMessage, convert, convertTimestampToDate,
    markAsRead, updateUserAsRead
} from '../../helpers/helpers.js';

import { firebaseConnect } from 'react-redux-firebase';
import Conversation from '../conversation/conversation';
import Message from '../message/message';

import './chatpage.css';

class Chatpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            friends: [],
            newEmail: '',
            friendSelected: null,
            callObserved: false,
            messages: [],
            callMessage: false
        }
    }

    componentWillReceiveProps({ auth, friendEmail }) {
        console.log({ auth, friendEmail, state:this.state });
        if (!auth || !auth.uid) {
            browserHistory.replace('/');
        }
        else {
            this.setState({
                currentUser: auth.email
            }, () => {
                this.observed();
            });
        }
    }

    componentDidMount() {
        if (this.props.auth) {
            this.setState({
                currentUser: this.props.auth.email
            }, () => {
                this.observed();
            });
        }
    }

    observed = () => {
        if (this.state.currentUser && !this.state.callObserved) {
            const email = convert(this.state.currentUser);
            if (email) {
                this.setState({
                    callObserved: true
                });

                database.ref('users').child(email).child('conversations').on('child_added', (snapshot) => {
                    getUser(snapshot.key).then((res) => {
                        if (res) {
                            this.setState({
                                friends: this.state.friends.concat({
                                    user: res,
                                    timestamp: snapshot.val().timestamp,
                                    isRead: snapshot.val().isRead,
                                    conversationID: snapshot.val().conversationID
                                })
                            }, () => {
                                if (this.props.friendEmail) {
                                    if (!this.state.callMessage) {
                                        this.state.friends.forEach((friend) => {
                                            if (this.props.friendEmail === convert(friend.user.email)) {
                                                this.setState({
                                                    friendSelected: friend,
                                                    message: [],
                                                    callMessage: true
                                                }, () => {
                                                    this.getMessage();
                                                });
                                            }
                                        });
                                    }
                                }
                                else {
                                    this.setState({
                                        friendSelected: {
                                            user: res,
                                            timestamp: snapshot.val().timestamp,
                                            isRead: snapshot.val().isRead,
                                            conversationID: snapshot.val().conversationID
                                        },
                                        messages: []
                                    }, () => {
                                        this.getMessage();
                                    });
                                }
                            });
                        }
                    });
                });

                database.ref('users').child(email).child('conversations').on('child_changed', (snapshot) => {
                    console.log({ changed: snapshot.val(), key: snapshot.key });
                    let list = this.state.friends;
                    this.state.friends.forEach((friend, index) => {
                        if (convert(friend.user.email) === snapshot.key) {
                            list[index].timestamp = snapshot.val().timestamp;
                            list[index].isRead = snapshot.val().isRead;
                            this.setState({
                                friends: list
                            });
                        }
                    });

                });

                database.ref('users').on('child_changed', (snapshot)=>{
                    let list = this.state.friends;
                    this.state.friends.forEach((friend, index) => {
                        if (convert(friend.user.email) === snapshot.key) {
                            list[index].user = snapshot.val();
                            this.setState({
                                friends: list
                            });
                        }
                    });
                });

            }
        }
    }

    // --------------------------------------------------------- //

    handlerNewEmailChange = (event) => {
        this.setState({
            newEmail: event.target.value
        });
    }

    handlerNewEmailSubmit = (event) => {
        event.preventDefault();
        if (this.state.newEmail.length > 0) {
            const email = convert(this.state.newEmail);
            if (email) {
                const callObserved = this.state.friends.length > 0;
                this.setState({
                    callMessage: false,
                    callObserved: callObserved
                }, ()=>{
                    saveNewEmail(this.state.newEmail);
                    browserHistory.replace(`/chat/${email}`);
                });
                document.getElementById("addEmailTextfield").reset();
            }
        }
    }

    handleChange = (event) => {
        this.setState({
            message: event.target.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.message.length > 0 && this.state.friendSelected) {
            sendMessage(this.state.friendSelected.user.email, this.state.message)
            this.setState({
                message: ''
            });
            document.getElementById("messageTextfield").reset();
        }
    }

    handlerSelect = (email) => {
        const emailSelected = convert(email);
        if (emailSelected) {
            this.state.friends.forEach((friend) => {
                if (emailSelected === convert(friend.user.email)) {
                    this.setState({
                        friendSelected: friend
                    }, () => {
                        this.getMessage();
                        browserHistory.replace(`/chat/${emailSelected}`);
                    });
                }
            });

        }
    }

    // ------------------------------------------------------------------------------------------- //

    showMessages = () => {
        if (this.state.friends.length > 0) {
            const list = this.state.messages.map((message, index) => {
                return <Message
                    email={message.email}
                    content={message.content}
                    key={index}
                />
            });
            return (
                <div>
                    <div className="login-sub-message">
                        <div className="sub-message" id="messages-content">
                            {list}
                        </div>
                    </div>
                    <div className="sub-text">
                        <form onSubmit={this.handleSubmit} id="messageTextfield">
                            <input className="input-bar" placeholder="Your message" type="text" onChange={this.handleChange} />
                            <button className="input-send" type="submit">Send</button>
                        </form>
                    </div>
                </div>
            );
        }
        return <div />
    }

    getMessage = () => {
        if (this.state.friendSelected) {
            database.ref('conversations').child(this.state.friendSelected.conversationID).on('value', (snapshot) => {
                const keys = Object.keys(snapshot.val());
                const values = Object.values(snapshot.val());

                console.log({snap:snapshot.val(), keys, values});

                this.setState({
                    messages: keys.map((key, index)=>{
                        if (values[index].email !== this.state.currentUser) {
                            markAsRead(this.state.friendSelected.conversationID, key);
                            updateUserAsRead(this.state.friendSelected.user.email);
                        }

                        return {
                            key: key,
                            email: values[index].email,
                            content: values[index].content,
                            isRead: values[index].isRead,
                            timestamp: values[index].timestamp
                        }
                    })
                });
            });
        }
    }

    render() {
        let listFriends = this.state.friends;
        listFriends.sort((a, b) => {
            return b.timestamp - a.timestamp;
        });


        const list = listFriends.map((friend, index) => {
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

        return (
            <div className="login-main-content">
                <div className="login-user-list">
                    <div className="find-friend">
                        <form onSubmit={this.handlerNewEmailSubmit} id="addEmailTextfield">
                            <input className="find-friend-bar" type="email" placeholder="New email, new friend" onChange={this.handlerNewEmailChange} />
                            <button className="find-friend-button" type="submit" >+</button>
                        </form>
                    </div>
                    {list}
                </div>

                <div className="login-user-message">
                    {this.showMessages()}
                </div>
            </div>
        );
    }
}

export default compose(firebaseConnect(props => {
    return [
        {
            path: `users/${props.match.params.email}`
        }
    ];
}), connect(({ firebase }, props) => ({
    auth: firebase.auth,
    friendEmail: props.match.params.email
}))
)(Chatpage);