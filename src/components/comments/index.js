import React, { Component } from "react";
import { connect } from "react-redux";
import { createComment, fetchComments, userVote } from "../../redux/actions/commentActions";
import "./comments.scss";
import uuid from "uuid";
// import emotes from "./emotes.json";
import moment from "moment";

import PostComment from "../postComment";
import postIcon from "../../images/post.svg";
import replyIcon from "../../images/reply.svg";
import up from "../../images/up.svg";
import down from "../../images/down.svg";

const ReactMarkdown = require("react-markdown");

class Comments extends Component {
    updateComments = () => {
        this.props.fetchComments(this.props.videoID);
    };

    handleChange = e => {
        e.preventDefault();

        this.setState({
            [e.target.id]: e.target.value
        });
    };

    userVote = (messageId, videoID, index, direction, voter, voted) => {
        if (this.hasVoted(voted, voter)) return;
        this.props.commentVote(messageId, videoID, index, direction, voter);
    };

    hasVoted = (voted, voter) => {
        return voted.includes(voter);
    };

    getComments = () => {
        if (this.props.comments[this.props.videoID] === undefined) {
            this.props.fetchComments(this.props.videoID);
            return <div>Loading...</div>;
        } else {
            if (this.props.comments[this.props.videoID].length === 0) return <div style={{ color: "white", textAlign: "left", opacity: "0.6" }}>Be the first to comment!</div>;
            return this.props.comments[this.props.videoID].map((x, index) => (
                <div className="comment-user" key={uuid.v4()}>
                    <div className="comment-vote">
                        <div className="comment-up" onClick={() => this.userVote(x.messageId, this.props.videoID, index, "up", this.props.auth.uid, x.voted)}>
                            {this.hasVoted(x.voted, this.props.auth.uid) ? <img src={up} alt="upvote" style={{ cursor: "not-allowed" }} /> : <img src={up} alt="upvote" />}
                        </div>
                        <div className="comment-points" id="points">
                            {this.props.comments[this.props.videoID][index].points}
                        </div>
                        <div className="comment-down" onClick={() => this.userVote(x.messageId, this.props.videoID, index, "down", this.props.auth.uid, x.voted)}>
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
                                <div>reply</div>
                            </div>
                        </div>
                    </div>
                </div>
            ));
        }
    };

    render() {
        return (
            <section className="comments-contain">
                <PostComment videoID={this.props.videoID} />
                <div className="comment-jump">user comments</div>
                {this.getComments()}
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
        fetchComments: id => dispatch(fetchComments(id)),
        commentVote: (messageId, videoID, index, direction, voter) => dispatch(userVote(messageId, videoID, index, direction, voter))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Comments);
