import React, { Component } from "react";
import { connect } from "react-redux";
import { userVote } from "../../redux/actions/commentActions";
import "./comments.scss";
import uuid from "uuid";
import moment from "moment";

import { Link } from "react-router-dom";

import PostComment from "../postComment";

import replyIcon from "../../images/reply.svg";
import up from "../../images/up.svg";
import down from "../../images/down.svg";

const ReactMarkdown = require("react-markdown");

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = { showReply: false, count: 1, canVote: true };
    }

    componentWillMount() {
        if (this.props.count) {
            this.setState({ count: this.props.count + this.state.count });
        }
    }

    userVote = (messageID, videoID, index, direction, voter, voted) => {
        if (this.hasVoted(voted, voter)) return;
        this.props.userVote(messageID, videoID, index, direction, voter);
    };

    hasVoted = (voted, voter) => {
        if (voted === undefined) return false;

        return voted.includes(voter);
    };

    toggleReply = () => {
        this.setState({ showReply: !this.state.showReply });
    };

    render() {
        return (
            <div key={uuid.v4()}>
                <div className="comment-user" style={{ marginLeft: `${this.state.count > 1 ? (this.state.count - 1) * 30 : 0}px`, width: `calc(100% - ${this.state.count > 1 ? (this.state.count - 1) * 30 : 0}px)` }}>
                    <div className="comment-vote">
                        <div className="comment-up" onClick={() => this.userVote(this.props.messageID, this.props.videoID, this.props.index, "up", this.props.auth.uid, this.props.voted)}>
                            {this.hasVoted(this.props.voted, this.props.auth.uid) ? <img src={up} alt="upvote" style={{ cursor: "not-allowed" }} /> : <img src={up} alt="upvote" />}
                        </div>
                        <div className="comment-points" id="points">
                            {this.props.points}
                        </div>
                        <div className="comment-down" onClick={() => this.userVote(this.props.messageID, this.props.videoID, this.props.index, "down", this.props.auth.uid, this.props.voted)}>
                            {this.hasVoted(this.props.voted, this.props.auth.uid) ? <img src={down} alt="downvote" style={{ cursor: "not-allowed" }} /> : <img src={down} alt="downvote" />}
                        </div>
                    </div>
                    <img className="comment-avatar" src={this.props.avatar} alt="icon" />
                    <div className="comment-message">
                        <div className="comment-username" htmlFor="message">
                            <Link className="comment-username-text" to={`/user/${this.props.author}`}>
                                {this.props.author}
                            </Link>
                        </div>
                        <ReactMarkdown className="comment-output" source={this.props.message} disallowedTypes={["link", "heading", "thematicBreak", "linkReference", "table", "paragraph"]} unwrapDisallowed />
                        <div className="btn-contain com">
                            <div className="btn-by">{moment(this.props.timestamp).fromNow()}</div>
                            {this.state.showReply ? null : !this.props.auth.isEmpty ? (
                                <div className="btn-post" onClick={this.toggleReply}>
                                    <div className="btn-icon">
                                        <img src={replyIcon} alt="reply" />
                                    </div>
                                    <div>reply</div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                {this.state.showReply ? <PostComment {...this.props} placeHolder={`replying to ${this.props.author}...`} parent={this.props.messageID} count={this.state.count} reply={true} title={this.props.title} /> : null}
                {this.props.children && this.props.children.map((item, index) => <Comment key={uuid.v4()} {...item} count={this.state.count} auth={this.props.auth} userVote={this.userVote} title={this.props.title} />)}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.firebaseReducer.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        userVote: (messageId, videoID, index, direction, voter) => dispatch(userVote(messageId, videoID, index, direction, voter))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Comment);
