import React, { Component } from 'react';
import { auth, provider } from '../../configs/firebase';


import Conversation from '../conversation/conversation.jsx';
import Message from '../message/message.jsx';
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

    getUserList = () => {
        const users = [
            {
                avatarURL: "https://www.w3schools.com/w3images/avatar2.png",
                userName: "TESSTTT",
                lastLogin: "05/11/2018 10:11"
            },
            {
                avatarURL: "https://www.riinvest.net/wp-content/uploads/2018/02/FemaleAvatar-1.png",
                userName: "ABCDEF",
                lastLogin: "04/11/2018 04:32"
            },
            {
                avatarURL: "https://images.clipartlogo.com/files/istock/previews/8979/89799061-business-man-profile-icon-african-american-ethnic-male-avatar.jpg",
                userName: "QWERTY",
                lastLogin: "03/11/2018 21:44"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKLPQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            },
            {
                avatarURL: "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg",
                userName: "PQJKL",
                lastLogin: "03/11/2018 13:09"
            }
        ];

        return users.map((user, index) => {
            return <Conversation
                avatarURL={user.avatarURL}
                userName={user.userName}
                lastLogin={user.lastLogin}
                key={index}
            />
        });
    };

    getMessages = () => {
        const messages = [
            {
                email: "abc@gmail.com",
                content: "sshdbfksdhbfjsdhbfjshdvfdhjsvfjshdvfjsdvfdjsvfjsdhvfjsdkfjbsdkjfbsdhbfjdshavfjsdhavfjsdvfjhsdvfmsdvjfasdjfvdsakfhvadslkhfjbkwidgfiusgadifgwe7aytfgkadhisgfkjhasdbfjsbdjkfnbjksdaf",
                timestamp: "09:30"
            },
            {
                email: "tieutrikiet@gmail.com",
                content:
                    `74356287364521873492183429314621378461832
                sfsdfsdfsdfsdfsdfsdfsdf
                sdfsdfsdfsd`,
                timestamp: "09:33"
            }
            ,
            {
                email: "abc@gmail.com",
                content: "alo alo",
                timestamp: "09:35"
            }
            ,
            {
                email: "abc@gmail.com",
                content: "check it, please!!!!",
                timestamp: "09:40"
            }
            ,
            {
                email: "tieutrikiet@gmail.com",
                content: "I will check it.......",
                timestamp: "09:50"
            }
            ,
            {
                email: "abc@gmail.com",
                content:
                    `ok
i will wait for your response`,
                timestamp: "10:01"
            }
            ,
            {
                email: "abc@gmail.com",
                content: "hey you!!!",
                timestamp: "10:30"
            }
            ,
            {
                email: "tieutrikiet@gmail.com",
                content: "what's up men !?",
                timestamp: "10:32"
            }
            ,
            {
                email: "tieutrikiet@gmail.com",
                content: "dfkhsabdkh",
                timestamp: "10:35"
            }
            ,
            {
                email: "hoanglam41@gmail.com",
                content: "dfkhsabdkh",
                timestamp: "10:35"
            }
            ,
            {
                email: "tieutrikiet@gmail.com",
                content: "dfkhsabdkh",
                timestamp: "10:35"
            }
            ,
            {
                email: "tieutrikiet@gmail.com",
                content: "dfkhsabdkh",
                timestamp: "10:35"
            }
            ,
            {
                email: "tieutrikiet@gmail.com",
                content: "dfkhsabdkh",
                timestamp: "10:35"
            }

        ];

        return messages.map((message, index) => {
            return <Message
                email={message.email}
                content={message.content}
            />
        });
    }


    render() {
        console.log(auth.currentUser ? auth.currentUser.email : "dedfwef");
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
                        {this.getUserList()}
                    </div>
                    <div className="login-user-message">
                        <div className="login-sub-message">
                            <div className="sub-message">
                                {this.getMessages()}
                            </div>
                        </div>
                        <div className="sub-text">
                            <input className="input-bar" placeholder="Your message" />
                            <button className="input-send">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;