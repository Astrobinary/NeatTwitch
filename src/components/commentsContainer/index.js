import React, { Component } from "react";
import { connect } from "react-redux";
import { createComment, fetchComments, userVote } from "../../redux/actions/commentActions";
import "./comments.scss";
import Totop from "../toTop";
import Comment from "../comment";
const shortid = require("shortid");
const arrayToTree = require("array-to-tree");

class commentsContainer extends Component {
    fetch = () => {
        if (this.props.comments[this.props.videoID] === undefined) this.props.fetchComments(this.props.videoID);
    };

    hasComments = () => {
        return this.props.comments[this.props.videoID] !== undefined;
    };

    getComments = () => {
        if (this.props.comments[this.props.videoID] !== undefined) {
            if (this.props.comments[this.props.videoID].list.length === 0) return !this.props.auth.isEmpty ? <div style={{ marginTop: "-10px", color: "white", textAlign: "center", opacity: "0.6" }}>No comments: Be the first to comment!</div> : <div style={{ color: "white", textAlign: "center", opacity: "0.6" }}>No comments: Why not sign in and share a thought?</div>;

            let tree = arrayToTree(this.props.comments[this.props.videoID].list, {
                parentProperty: "parent",
                customID: "messageID"
            });
            return tree.map((comment, index) => <Comment videoID={this.props.videoID} {...comment} index={index} key={shortid.generate()} title={this.props.title} />);
        } else {
            return (
                <div className="view-comments" onClick={this.fetch} style={{ textAlign: "center" }}>
                    view comments
                </div>
            );
        }
    };

    render() {
        return (
            <section>
                {this.getComments()}
                <Totop />
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
        fetchComments: (id, more, doc) => dispatch(fetchComments(id, more, doc)),
        commentVote: (messageId, videoID, index, direction, voter) => dispatch(userVote(messageId, videoID, index, direction, voter))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(commentsContainer);
