import React, { Component } from 'react';
import browserHistory from '../../routes/history';
import { connect } from "react-redux";
import './login.css';

class Login extends Component {
    componentWillReceiveProps({ auth }) {
        if (auth && auth.uid) {
            browserHistory.replace(`/chatpage`);
        }
      }

    render() { 
        return ( 
            <div/>
         );
    }
}
 
export default connect(({ firebase: { auth } }) => ({
    auth: auth
  }))(Login);