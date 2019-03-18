import React, { Component } from "react";
import { connect } from "react-redux";
import { createComment, fetchComments, userVote } from "../../redux/actions/commentActions";
import "./comments.scss";
import uuid from "uuid";
import moment from "moment";

import CommentsContainer from "../postComment";
import PostReply from "../postReply";

import replyIcon from "../../images/reply.svg";
import up from "../../images/up.svg";
import down from "../../images/down.svg";

const ReactMarkdown = require("react-markdown");

class comment extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = { showReply: false };
    }

    userVote = (messageId, videoID, index, direction, voter, voted) => {
        if (this.hasVoted(voted, voter)) return;
        this.props.commentVote(messageId, videoID, index, direction, voter);
    };

    hasVoted = (voted, voter) => {
        return voted.includes(voter);
    };

    toggleReply = () => {
        this.setState({ showReply: !this.state.showReply });
    };
    getReplies = () => {
        if (this.props.comments[this.props.videoID] === undefined) {
            this.props.fetchComments(this.props.videoID);
            return <div>Loading...</div>;
        } else {
            if (this.props.comments[this.props.videoID].length === 0) return <div style={{ color: "white", textAlign: "left", opacity: "0.6" }}>Be the first to comment!</div>;
            return this.props.comments[this.props.videoID].map((x, index) => <comment videoID={this.props.videoID} x={x} dex={index} key={uuid.v4()} />);
        }
    };

    renderComment = x => {
        return (
            <div>
                <div className="comment-user">
                    <div className="comment-vote">
                        <div className="comment-up" onClick={() => this.userVote(x.messageId, videoID, index, "up", this.props.auth.uid, x.voted)}>
                            {this.hasVoted(x.voted, this.props.auth.uid) ? <img src={up} alt="upvote" style={{ cursor: "not-allowed" }} /> : <img src={up} alt="upvote" />}
                        </div>
                        <div className="comment-points" id="points">
                            {this.props.comments[videoID][index].points}
                        </div>
                        <div className="comment-down" onClick={() => this.userVote(x.messageId, videoID, index, "down", this.props.auth.uid, x.voted)}>
                            {this.hasVoted(x.voted, this.props.auth.uid) ? <img src={down} alt="downvote" style={{ cursor: "not-allowed" }} /> : <img src={down} alt="downvote" />}
                        </div>
                    </div>
                    <img className="comment-avatar" src={x.avatar} alt="icon" />
                    <div className="comment-message">
                        <div className="comment-username" htmlFor="message">
                            {x.author}
                        </div>
                        <ReactMarkdown className="comment-output" source={x.message} disallowedTypes={["link", "heading", "thematicBreak", "linkReference", "table", "paragraph"]} unwrapDisallowed />
                        <div className="btn-contain com">
                            <div className="btn-by">{moment(x.timestamp).fromNow()}</div>
                            <div className="btn-post" id="submit" onClick={this.handleSubmit}>
                                <div className="btn-icon">
                                    <img src={replyIcon} alt="reply" />
                                </div>
                                <div onClick={this.toggleReply}>reply</div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showReply ? <PostReply msgID={x.messageId} videoId={videoID} /> : null}
            </div>
        );
    };

    render() {
        let x = this.props.x;
        let index = this.props.dex;
        let videoID = this.props.videoID;
        return (
            <div>
                <div className="comment-user">
                    <div className="comment-vote">
                        <div className="comment-up" onClick={() => this.userVote(x.messageId, videoID, index, "up", this.props.auth.uid, x.voted)}>
                            {this.hasVoted(x.voted, this.props.auth.uid) ? <img src={up} alt="upvote" style={{ cursor: "not-allowed" }} /> : <img src={up} alt="upvote" />}
                        </div>
                        <div className="comment-points" id="points">
                            {this.props.comments[videoID][index].points}
                        </div>
                        <div className="comment-down" onClick={() => this.userVote(x.messageId, videoID, index, "down", this.props.auth.uid, x.voted)}>
                            {this.hasVoted(x.voted, this.props.auth.uid) ? <img src={down} alt="downvote" style={{ cursor: "not-allowed" }} /> : <img src={down} alt="downvote" />}
                        </div>
                    </div>
                    <img className="comment-avatar" src={x.avatar} alt="icon" />
                    <div className="comment-message">
                        <div className="comment-username" htmlFor="message">
                            {x.author}
                        </div>
                        <ReactMarkdown className="comment-output" source={x.message} disallowedTypes={["link", "heading", "thematicBreak", "linkReference", "table", "paragraph"]} unwrapDisallowed />
                        <div className="btn-contain com">
                            <div className="btn-by">{moment(x.timestamp).fromNow()}</div>
                            <div className="btn-post" id="submit" onClick={this.handleSubmit}>
                                <div className="btn-icon">
                                    <img src={replyIcon} alt="reply" />
                                </div>
                                <div onClick={this.toggleReply}>reply</div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showReply ? <PostReply msgID={x.messageId} videoId={videoID} /> : null}
            </div>
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
        fetchComments: id => dispatch(fetchComments(id)),
        commentVote: (messageId, videoID, index, direction, voter) => dispatch(userVote(messageId, videoID, index, direction, voter))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(comment);
