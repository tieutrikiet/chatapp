import React, { Component } from 'react';
import firebase, { auth, provider } from '../../configs/firebase';
import './login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
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
        auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
            console.log({ result });
            const user = result.user;
            this.setState({
                user: user
            })
        });
    };

    logout = () => {
        auth.signOut().then(()=>{
            this.setState({
                user: null
            });
        });
    }

    getUserDisplayName = () => {
        if (this.state.user) {
            const name = this.state.user.displayName;
            return (
                <div className="login-welcome">WELCOME {name}</div>
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
                    LOG OUT
                </button>
            );
        }

        return (
            <button className="login-button login-status" onClick={this.login}>
                LOGIN
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

export default Login;