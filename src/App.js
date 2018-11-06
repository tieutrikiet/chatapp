import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { auth, provider, database } from './configs/firebase';
import { saveUserToDB, convert, saveNewEmail, sendMessage, getUser, updateLastLogin} from './helpers/helpers.js';

import Home from './components/home/home';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user: null,
        friends: [],
        newEmail: '',
        message: '',
        friendSelected: null
    }

    this.handlerNewEmailChange = this.handlerNewEmailChange.bind(this);
    this.handlerNewEmailSubmit = this.handlerNewEmailSubmit.bind(this);
    this.handlerChatChange = this.handlerChatChange.bind(this);
    this.handlerChatSubmit = this.handlerChatSubmit.bind(this);
  }

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
                    console.log({friends:this.state.friends});
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

  handlerChatChange = (event) => {
    this.setState({ message: event.target.value });
  }

  handlerChatSubmit = (event) => {
    event.preventDefault();
    if (this.state.message.length > 0) {
        if (this.state.friendSelected) {
          console.log(this.state.friendSelected);
          sendMessage(this.state.friendSelected.email, this.state.message);
        }
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={this.goToHome} />
          <Route exact path="/chat/:userEmail" component={this.goToChatPage} />
        </div>
      </Router>
      
    );
  }

  goToHome = () => {
    return <Home 
      user={this.state.user}
      handlerLogout={this.handlerLogout}
      handlerLogin={this.handlerLogin}
      handleChange={this.handlerNewEmailChange}
      handleSearch={this.handlerNewEmailSubmit}
      handleChatChange={this.handlerChatChange}
      handleSend={this.handlerChatSubmit}
      friends={this.state.friends}
    />
  }

  goToChatPage = ({match}) => {
    return <Home 
      user={this.state.user}
      handlerLogout={this.handlerLogout}
      handlerLogin={this.handlerLogin}
      handleChange={this.handlerNewEmailChange}
      handleSearch={this.handlerNewEmailSubmit}
      handleChatChange={this.handlerChatChange}
      handleSend={this.handlerChatSubmit}
      friends={this.state.friends}
      friendEmail={match.params.userEmail}
    />
  }

}

export default App;