import React, { Component } from 'react';
import { database, auth, provider } from '../../configs/firebase';
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect, isEmpty } from "react-redux-firebase";
import { updateLastLogin, saveUserToDB, convert, getUser } from '../../helpers/helpers.js';
import broswerHistory from '../../routes/history';
import './home.css';
import browserHistory from '../../routes/history';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            friends: []
        }
    };

    observed = () => {
        if (this.state.user) {
            console.log({user: this.state.user});
            const myEmail = convert(this.state.user.email);
            if (myEmail) {
                database.ref('users').child(myEmail).child('conversations').on('child_added', (snapshot)=> {
                    getUser(snapshot.key).then((res)=> {
                        if (res) {
                            this.setState({
                                friends: this.state.friends.concat({
                                    user: res,
                                    timestamp: snapshot.val().timestamp,
                                    isRead: snapshot.val().isRead,
                                    isStarred: snapshot.val().isStarred
                                })
                            });

                            this.sortList();

                            let email = convert(this.state.friends[0].user.email);
                            if (email) {
                                browserHistory.replace('/chat/' + email);
                            }
                            
                            console.log({list: this.state.friends});
                        }
                    });
                });
            }
        }
    }

    sortList = () => {
        if (this.state.friends) {
            this.state.friends.sort((a, b) => {
                return b.timestamp - a.timestamp;
            });
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                if (saveUserToDB(user)) {
                    this.setState({
                        user: user
                    })

                    this.observed()
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
                    user: user
                });
            }
        });
    }

    handlerLogout = () => {
        updateLastLogin();
        auth.signOut().then(() => {
            this.setState({
                user: null
            });
        });
    }

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

    render() {
        return (
            <div>
                <div className="login-header">
                    {this.getUserDisplayName()}
                </div>
                <div className="login-body">
                    {this.getLoginButton()}
                </div>

            </div>
        );
    }

}

export default compose(firebaseConnect(), connect(({ firebase: { auth } }) => ({ auth })))(Home);




    // getMessages = () => {
    //     if (auth.currentUser === null) {
    //         return;
    //     }

    //     const email = convert(this.state.friendEmail);
    //     if (email) {
    //         getConversationID(email).then((convID) => {
    //             if (convID) {
    //                 database.ref('conversations').child(convID).on('child_added', (snapshot) => {
    //                     this.setState({
    //                         messages: this.state.messages.concat(<Message 
    //                             email={snapshot.val().email}
    //                             content={snapshot.val().content}
    //                         />)
    //                     });
    //                 });
    //             }
    //         });

    //         window.location.href = "/chat/" + email;
    //     }
    // };

    // showListFriends = () => {
    //     if (this.state.friends) {
    //         let list = this.state.friends;
    //         list.sort((a, b) => {
    //             return b.timestamp - a.timestamp;
    //         });

    //         if (this.state.friendEmail) {
    //             // Do nothing
    //         }
    //         else {
    //             console.log(list[0]);
    //             // this.setState({
    //             //     friendEmail: list[0].user.email
    //             // })
    //             // this.getMessages();
    //         }

    //         return list.map((friend, index) => {
    //             return <Conversation
    //                 email={friend.user.email}
    //                 avatarURL={friend.user.photoURL}
    //                 userName={friend.user.displayName}
    //                 lastLogin={convertTimestampToDate(friend.user.lastLogin)}
    //                 isRead={friend.isRead}
    //                 isActived={friend.user.isActived}
    //                 handlerSelect={() => this.handlerSelect(friend.user.email)}
    //                 key={index}
    //             />
    //         });
    //     }

    //     return <div />
    // }