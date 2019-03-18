import React, { Component } from "react";
import { connect } from "react-redux";
import { createComment, fetchComments, userVote } from "../../redux/actions/commentActions";
import "./comments.scss";
import Comment from "../comment";
const shortid = require("shortid");

class commentsContainer extends Component {
    getComments = () => {
        if (this.props.comments[this.props.videoID] === undefined) {
            this.props.fetchComments(this.props.videoID);
            return <div>Loading...</div>;
        } else {
            if (this.props.comments[this.props.videoID].length === 0) return <div style={{ color: "white", textAlign: "left", opacity: "0.6" }}>Be the first to comment!</div>;
            return this.props.comments[this.props.videoID].map((comment, index) => <Comment videoID={this.props.videoID} {...comment} index={index} key={shortid.generate()} />);
        }
    };

    render() {
        return <section>{this.getComments()}</section>;
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
)(commentsContainer);
