import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserComments } from "../../redux/actions/profileActions";
import Comment from "../../components/profileComment";
import "./profile.scss";

const shortid = require("shortid");

class Profile extends Component {
    componentDidMount() {
        if (!this.props.comments) this.props.fetchUserComments(this.props.match.params.user);
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.user !== prevProps.match.params.user) {
            this.onRouteChanged();
        }
    }

    onRouteChanged = () => {
        if (this.props.comments === undefined) this.props.fetchUserComments(this.props.match.params.user);
    };

    renderComments = () => {
        if (this.props.recent !== undefined)
            return this.props.recent.comments.map((comment, index) => (
                <Link to={`/${comment.videoID}`}>
                    <Comment videoID={comment.videoID} {...comment} index={index} key={shortid.generate()} title={comment.title} />
                </Link>
            ));
    };

    render() {
        return (
            <section>
                <h1>{this.props.match.params.user}</h1>
                <section className="profile-comments">{this.renderComments()}</section>
            </section>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        recent: state.profileReducer[ownProps.match.params.user]
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserComments: name => dispatch(fetchUserComments(name))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);
