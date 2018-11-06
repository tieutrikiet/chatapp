import React, { Component } from 'react';
import { database, auth } from '../../configs/firebase';
import Conversation from '../conversation/conversation.jsx';
import Message from '../message/message.jsx';
import { getUser, convert, convertTimestampToDate, getConversationID } from '../../helpers/helpers.js';
import './home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: []
        }
    };

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.getMessages(this.props.friendEmail);
            }
        });

    }

    getUserDisplayName = () => {
        if (this.props.user) {
            const name = this.props.user.displayName;
            const url = this.props.user.photoURL;
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
        if (this.props.user) {
            return (
                <button className="login-button logout-status" onClick={this.props.handlerLogout}>
                    SIGN OUT
                </button>
            );
        }

        return (
            <button className="login-button login-status" onClick={this.props.handlerLogin}>
                SIGN IN
            </button>
        );
    };

    getListUser = () => {
        if (this.props.user) {
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
                </div>
            );
        }

        return <div />
    };

    // showConversation = () => {
    //     if (this.props.friendEmail) {
    //         const userEmail = this.props.friendEmail;
    //         getUser(userEmail).then((res) => {
    //             if (res) {
    //                 this.showMessages(res);
    //             }
    //             else {
    //                 window.location.href = "/";
    //             }
    //         });
    //     }
    // }

    showMessages = () => {
        const list = this.state.message.map((mess, index) => {
            return <Message email={mess.email} content={mess.content} key={index} />
        });

        console.log(this.state.message);

        return (
            <div className="login-user-message">
                <div className="login-sub-message">
                    <div className="sub-message">
                        {list}
                    </div>
                </div>
                <div className="sub-text">
                    <form onSubmit={this.props.handleSend}>
                        <input className="input-bar" placeholder="Your message" type="text" onChange={this.props.handleChatChange} />
                        <button className="input-send" type="submit">Send</button>
                    </form>
                </div>
            </div>
        );
    };

    getMessages = (fromEmail) => {
        if (auth.currentUser === null) {
            return;
        }

        const email = convert(fromEmail);
        if (email) {
            console.log({ email });
            getConversationID(email).then((convID) => {
                console.log({ convID });
                if (convID) {
                    database.ref('conversations').child(convID).on('child_added', (snapshot) => {
                        console.log({ snap: snapshot.val().content });
                        this.setState({
                            message: this.state.message.concat({
                                email: snapshot.val().email,
                                content: snapshot.val().content
                            })
                        });
                    });
                }
                return <div />
            });
        }
    };

    showListFriends = () => {
        if (this.props.friends) {
            let list = this.props.friends;
            list.sort((a, b) => {
                return b.timestamp - a.timestamp;
            });

            return list.map((friend, index) => {
                return <Conversation
                    email={friend.user.email}
                    avatarURL={friend.user.photoURL}
                    userName={friend.user.displayName}
                    lastLogin={convertTimestampToDate(friend.user.lastLogin)}
                    isRead={friend.isRead}
                    isActived={friend.user.isActived}
                    select={this.props.select}
                    key={index}
                />
            });
        }

        return <div />
    }

    render() {
        return (
            <div>
                <div className="login-header">
                    {this.getUserDisplayName()}
                </div>
                <div className="login-body">
                    {this.getLoginButton()}
                </div>
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
                    {this.showMessages()}
                </div>
            </div>
        );
    }
}

export default Home;