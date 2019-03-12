import React, { Component } from "react";
import { connect } from "react-redux";
import { createComment, fetchComments } from "../../redux/actions/commentActions";
import "./comments.scss";
import uuid from "uuid";
import emotes from "./emotes.json";
const ReactMarkdown = require("react-markdown");

class Comments extends Component {
    state = {
        message: "",
        textArea: document.getElementById("message")
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

        this.setState({ message: "" });
    };

    handleSubmit = e => {
        const textArea = document.getElementById("message");
        const postBtn = document.getElementById("submit");
        if (!/\S/.test(this.state.message)) return (postBtn.innerHTML = "add text?");

        postBtn.innerHTML = "posted!";
        postBtn.disabled = true;
        textArea.disabled = true;
        textArea.style.opacity = 0.5;
        postBtn.style.opacity = 0.5;

        // https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0

        let parsedMessage = this.parseText(this.state.message);

        const temp = {
            message: parsedMessage,
            avatar: this.props.auth.photoURL,
            author: this.props.auth.displayName,
            points: 0
        };

        this.props.comments[this.props.videoID].unshift(temp);
        this.props.createComment(temp.message, this.props.videoID);
        this.updateComments();
    };

    parseText = text => {
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

    updateComments = () => {
        this.props.fetchComments(this.props.videoID);
    };

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    getComments = () => {
        if (this.props.comments[this.props.videoID] === undefined) {
            this.props.fetchComments(this.props.videoID);
            return <div>Loading...</div>;
        } else {
            if (this.props.comments[this.props.videoID].length === 0) return <div style={{ color: "white", textAlign: "left", opacity: "0.6" }}>Be the first to comment!</div>;
            return this.props.comments[this.props.videoID].map(x => (
                <div className="comment-user" key={uuid.v4()}>
                    <img className="comment-avatar" src={x.avatar} alt="icon" />
                    <div className="comment-message">
                        <div className="comment-username" htmlFor="message">
                            {x.author}
                            <span>+{x.points}</span>
                        </div>
                        <ReactMarkdown className="comment-output" source={x.message} disallowedTypes={["link", "heading", "thematicBreak", "linkReference", "table", "paragraph"]} unwrapDisallowed />
                        <button id="submit" onClick={this.handleSubmit} disabled>
                            reply
                        </button>
                    </div>
                </div>
            ));
        }
    };

    render() {
        return (
            <section className="comments-contain">
                {!this.props.auth.isEmpty ? (
                    <div className="comment-user">
                        <div className="comment-message">
                            <textarea className="comment-input" type="text" id="message" onChange={this.handleChange} placeholder="Enter witty comment here..." />
                            <div className="btn-contain">
                                <button id="submit" onClick={this.handleSubmit}>
                                    post
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
                <div className="comment-jump">user comments</div>
                {this.getComments()}
                <div />
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
        createComment: (comment, id) => dispatch(createComment(comment, id)),
        fetchComments: id => dispatch(fetchComments(id))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Comments);
