import React, { Component } from 'react';
import { auth, provider } from '../../configs/firebase';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Conversation from '../conversation/conversation.jsx';
import Message from '../message/message.jsx';
import './login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            friends: null
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    user: user
                });
            }
        });
    }

    login = () => {
        auth.signInWithPopup(provider).then((result) => {
            console.log({ result });
            const user = result.user;
            this.setState({
                user: user
            })
        });
    };

    logout = () => {
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
            return (
                <div className="login-main-content">
                    <div className="login-user-list">
                        <div className="find-friend">
                            <form onSubmit={}>
                                <input className="find-friend-bar" type="email" placeholder="New email, new friend" />
                                <button className="find-friend-button" type="submit">+</button>
                            </form>
                        </div>
                    </div>
                    {this.getMessage()}
                </div>
            );
        }

        return <div />
    };

    getMessage = () => {
        if (this.state.friends) {
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
        }

        return <div />
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
                {this.getListUser()}

            </div>
        );
    }
}

export default Login;