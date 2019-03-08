import React, { Component } from "react";
import firebase from "firebase/app";
import "./login.scss";
import Axios from "axios";
require("firebase/functions");

class LogIn extends Component {
    state = {
        email: "",
        password: ""
    };

    componentDidMount() {}

    doAuth = () => {};

    handleSubmit = e => {
        e.preventDefault();
        this.AuthenticateWithTwitch();
    };

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    render() {
        return (
            <section className="login-container">
                <form onSubmit={this.handleSubmit} className="login-form">
                    <h5>Sign In</h5>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" onChange={this.handleChange} />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" onChange={this.handleChange} />
                    </div>

                    <div>
                        <button>Login</button>
                    </div>
                </form>

                <div onClick={this.getURLParameter}>click me</div>
            </section>
        );
    }
}

export default LogIn;
