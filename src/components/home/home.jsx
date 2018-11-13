import React, { Component } from 'react';
import { database, auth, provider } from '../../configs/firebase';
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect, isEmpty } from "react-redux-firebase";
import { updateLastLogin, saveUserToDB, convert, getListFriends } from '../../helpers/helpers.js';
import browserHistory from '../../routes/history';

import './home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    };

    observed = () => {
        if (this.state.user) {
            const myEmail = convert(this.state.user.email);
            if (myEmail) {
                getListFriends(myEmail).then((res)=>{
                    if (res) {
                        let list = res;
                        list.sort((a, b)=>{
                            return b.timestamp - a.timestamp;
                        });

                        browserHistory.replace('/chat/' + list[0].user);
                    }
                });
            }
        }

    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                if (saveUserToDB(user)) {
                    this.setState({
                        user: user
                    })

                    // browserHistory.replace(`/chat/${convert(user.email)}`);
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

            browserHistory.replace('/login');
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