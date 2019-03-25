import React, { Component } from "react";
import { connect } from "react-redux";
import { createComment } from "../../redux/actions/commentActions";
import "./postComment.scss";
import emotes from "./emotes.json";

import postIcon from "../../images/post.svg";

class PostComment extends Component {
    state = {
        message: "",
        canPost: true,
        posted: false,
        postText: "post"
    };

    componentWillMount() {
        this.inputContainer = React.createRef();
        this.textInput = React.createRef();
    }

    componentDidMount() {
        if (this.props.reply) {
            this.inputContainer.current.style.width = "calc(100% - 65px)";
            this.inputContainer.current.style.marginLeft = "65px";
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.videoID !== prevProps.videoID) {
            this.onRouteChanged();
        }
    }

    onRouteChanged = () => {
        if (this.textInput.current !== null) {
            this.textInput.current.disabled = false;
            this.textInput.current.style.opacity = "0.8";

            this.setState({ message: "", canPost: true, postText: "post" });
        }
    };
    handleChange = e => {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value
        });
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

    handleSubmit = e => {
        if (!this.state.canPost) return;
        if (!/\S/.test(this.state.message)) return this.setState({ postText: "add text?" });
        this.textInput.current.disabled = true;
        this.textInput.current.style.opacity = "0.4";
        let parsedMessage = this.parseText(this.state.message);

        const temp = {
            message: parsedMessage,
            avatar: this.props.auth.photoURL,
            author: this.props.auth.displayName,
            points: 0
        };

        this.setState({ canPost: false, postText: "posted!", posted: true, post: { ...temp } });
        this.props.createComment(temp.message, this.props.videoID, this.props.parent);
    };

    render() {
        return (
            <section className="post-contain" ref={this.inputContainer}>
                {!this.props.auth.isEmpty ? (
                    <div className="post-message" style={{ marginLeft: `${this.props.count > 1 ? (this.props.count - 1) * 30 : 0}px`, width: `calc(100% - ${this.props.count > 1 ? (this.props.count - 1) * 30 : 0}px)` }}>
                        <textarea ref={this.textInput} className="post-input" type="text" id="message" onChange={this.handleChange} placeholder={this.props.placeHolder} value={this.state.message} />
                        <div className="post-menu-contain">
                            <div className="post-menu-post" onClick={this.handleSubmit}>
                                <div className="post-menu-icon">
                                    <img src={postIcon} alt="post" />
                                </div>
                                <div id="submit">{this.state.postText}</div>
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
        createComment: (comment, id, parent, reply) => dispatch(createComment(comment, id, parent))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostComment);
