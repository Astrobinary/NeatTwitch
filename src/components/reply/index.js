import React, { Component } from "react";
import { connect } from "react-redux";
import { createComment, fetchComments, userVote } from "../../redux/actions/commentActions";
import "./reply.scss";
import uuid from "uuid";
import moment from "moment";

import PostComment from "../postComment";
import CommentsContainer from "../commentsContainer";

import replyIcon from "../../images/reply.svg";
import up from "../../images/up.svg";
import down from "../../images/down.svg";

const ReactMarkdown = require("react-markdown");

class comment extends Component {
    constructor(props) {
        super(props);
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

    renderReplies = (list, repTo, parent, pindex) => {
        if (list.length === 0) return <div>empty</div>;

        if (list.length === undefined) return <div>no replies</div>;
        console.log(list.length);

        return list.map((post, index) => {
            return (
                <div key={uuid.v4()}>
                    <div className="comment-user reply">
                        <div className="comment-vote">
                            <div className="comment-up" onClick={() => this.userVote(post.messageId, this.props.videoID, index, "up", this.props.auth.uid, post.voted)}>
                                {this.hasVoted(post.voted, this.props.auth.uid) ? <img src={up} alt="upvote" style={{ cursor: "not-allowed" }} /> : <img src={up} alt="upvote" />}
                            </div>
                            <div className="comment-points" id="points">
                                {post.points}
                            </div>
                            <div className="comment-down" onClick={() => this.userVote(post.messageId, this.props.videoID, index, "down", this.props.auth.uid, post.voted)}>
                                {this.hasVoted(post.voted, this.props.auth.uid) ? <img src={down} alt="downvote" style={{ cursor: "not-allowed" }} /> : <img src={down} alt="downvote" />}
                            </div>
                        </div>
                        <img className="comment-avatar" src={post.avatar} alt="icon" />
                        <div className="comment-message">
                            <div className="comment-username" htmlFor="message">
                                {post.author} (Replied {repTo})
                            </div>
                            <ReactMarkdown className="comment-output" source={post.message} disallowedTypes={["link", "heading", "thematicBreak", "linkReference", "table", "paragraph"]} unwrapDisallowed />
                            <div className="btn-contain com">
                                <div className="btn-by">{moment(post.timestamp).fromNow()}</div>
                                <div className="btn-post" id="submit" onClick={this.handleSubmit}>
                                    <div className="btn-icon">
                                        <img src={replyIcon} alt="reply" />
                                    </div>
                                    <div onClick={this.toggleReply}>reply</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {post.replies.length > 0 ? this.renderReplies(post.replies, post.message, post.replyId) : null}

                    {this.state.showReply ? <PostComment msgID={post.messageId} videoID={this.props.videoID} placeHolder={`replying to ${post.author}...`} reply={true} index={index} /> : null}
                </div>
            );
        });
    };

    render() {
        let comments = this.renderReplies(this.props.x);

        return <div>{comments}</div>;
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
