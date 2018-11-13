import React, { Component } from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import './message.css';

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: <div />
        }
    }

    componentDidMount() {
        this.interval = setInterval(()=>{this.showContent()}, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);

        console.log("deinit");
    }

    detectImgUrl = () => {
        const img = document.createElement('img');
        let res = true;
        try {
            img.src = this.props.content;
            res = img.height > 0;
        } catch (error) {
            res = false;
        }

        return res;
    }

    showContent = () => {
        const authEmail = this.props.auth ? this.props.auth.email : "";

        if (this.detectImgUrl()) {
            this.setState({
                content:
                    <img src={this.props.content} alt={this.props.content} className={this.props.email === authEmail ? "mess-img myMessage" : "mess-img userMessage"} />
            });

            
        }
        else {
            this.setState({
                content:
                    <div className={this.props.email === authEmail ? "message myMessage" : "message userMessage"}>
                        {this.props.content}
                    </div>
            });
            
        }

    }

    render() {
        return (
            <div>
                {this.state.content}
                <div className="clear" />
            </div>
        );
    }
}

export default compose(firebaseConnect(), connect(({ firebase: { auth } }) => ({ auth })))(Message);

function checkURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}