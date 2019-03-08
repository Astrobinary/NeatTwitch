import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createComment } from "../../redux/actions/commentActions";
import { firestoreConnect } from "react-redux-firebase";

import "./comments.scss";

class Comments extends Component {
    state = {
        message: "",
        title: ""
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.createComment(this.state);
    };

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    render() {
        console.log(this.props.comments);
        return (
            <section className="login-container">
                <form onSubmit={this.handleSubmit} className="login-form">
                    <h5>comments</h5>
                    <div>
                        <label htmlFor="message">Enter comment</label>
                        <input type="text" id="message" onChange={this.handleChange} />
                    </div>
                    <div>
                        <label htmlFor="title">title</label>
                        <input type="text" id="title" onChange={this.handleChange} />
                    </div>

                    <div>
                        <button>Login</button>
                    </div>
                </form>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        comments: state.firestoreReducer.ordered.comments
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createComment: comment => dispatch(createComment(comment))
    };
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    firestoreConnect([{ collection: "comments" }])
)(Comments);
