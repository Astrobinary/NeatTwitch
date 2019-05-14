import React, { Component } from "react";
import { connect } from "react-redux";
import { userVote } from "../../redux/actions/commentActions";
import "./profilecomment.scss";
import uuid from "uuid";
import moment from "moment";

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
                <div className="profile-comment-message">
                    <ReactMarkdown className="profile-comment-output" source={this.props.message} disallowedTypes={["link", "heading", "thematicBreak", "linkReference", "table", "paragraph"]} unwrapDisallowed />
                    <div className="btn-contain com">
                        <div className="btn-by">{moment(this.props.timestamp).fromNow()}</div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userVote: (messageId, videoID, index, direction, voter) => dispatch(userVote(messageId, videoID, index, direction, voter))
    };
};

export default connect(
    null,
    mapDispatchToProps
)(Comment);
