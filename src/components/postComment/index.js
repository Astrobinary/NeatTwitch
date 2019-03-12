import React, { Component } from "react";
import { connect } from "react-redux";
import { createComment } from "../../redux/actions/commentActions";
// import "./comments.scss";
import emotes from "./emotes.json";

import postIcon from "../../images/post.svg";

class PostComment extends Component {
    state = {
        message: "",
        canPost: true
    };

    componentDidUpdate(prevProps) {
        if (this.props.videoID !== prevProps.videoID) {
            this.onRouteChanged();
        }
    }

    onRouteChanged = () => {
        console.log("route changed");

        const textArea = document.getElementById("message");
        const postBtn = document.getElementById("submit");

        if (textArea === null) return;
        postBtn.innerHTML = "reply";
        postBtn.disabled = false;
        textArea.disabled = false;
        textArea.style.opacity = 1;
        postBtn.style.opacity = 1;
        textArea.value = "";

        this.setState({ message: "", canPost: true });
    };

    handleSubmit = e => {
        if (!this.state.canPost) return;
        const textArea = document.getElementById("message");
        const postBtn = document.getElementById("submit");
        if (!/\S/.test(this.state.message)) return (postBtn.innerHTML = "add text?");

        postBtn.innerHTML = "posted!";
        postBtn.disabled = true;
        textArea.disabled = true;
        textArea.style.opacity = 0.5;
        postBtn.style.opacity = 0.5;

        let parsedMessage = this.parseText(this.state.message);

        const temp = {
            message: parsedMessage,
            avatar: this.props.auth.photoURL,
            author: this.props.auth.displayName,
            points: 0
        };

        this.props.createComment(temp.message, this.props.videoID);
    };

    parseText = text => {
        this.setState({ canPost: false });
        const regex = /:(.+?):/gm;
        let matches = text.match(regex);

        let confirmed = [];
        let replaced = text;

        if (matches !== null) {
            matches.forEach(element => {
                if (emotes[element.slice(1, -1)] !== undefined) {
                    const word = element.slice(1, -1);
                    const id = emotes[element.slice(1, -1)].id;
                    confirmed.push({ [element]: `![${word}](https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0 "${word}")` });
                }
            });

            confirmed.forEach(match => {
                const key = Object.keys(match)[0];
                const value = Object.values(match)[0];
                replaced = replaced.replace(key, value);
            });

            return replaced;
        } else {
            return text;
        }
    };

    handleChange = e => {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    render() {
        return (
            <section className="comments-contain">
                {!this.props.auth.isEmpty ? (
                    <div className="comment-user">
                        <div className="comment-message">
                            <textarea className="comment-input" type="text" id="message" onChange={this.handleChange} placeholder="Enter witty comment here..." />
                            <div className="btn-contain">
                                <div className="btn-post" onClick={this.handleSubmit}>
                                    <div className="btn-icon">
                                        <img src={postIcon} alt="post" />
                                    </div>
                                    <div id="submit">post</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        comments: state.commentsReducer,
        auth: state.firebaseReducer.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createComment: (comment, id) => dispatch(createComment(comment, id))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostComment);
