import React, { Component } from "react";
import "./login.scss";

class LogIn extends Component {
    state = {
        email: "",
        password: ""
    };

    handleSubmit = e => {
        e.preventDefault();
        console.log(this.state);
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
            </section>
        );
    }
}

export default LogIn;
